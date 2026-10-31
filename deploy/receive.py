#!/usr/bin/env python3
"""专用 SSH 账号入口：校验发布包并原子切换对应版本系列。"""
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import sys
import tarfile
import tempfile

ROOT = Path('/opt/dip-proto')
PUBLIC = Path('/www/wwwroot/ai/work/dip-proto')
TAG = re.compile(r'v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)')


def receive(command, stream):
    args = shlex.split(command)
    if len(args) != 3 or not TAG.fullmatch(args[0]) or not re.fullmatch(r'[a-f0-9]{40}', args[1]) or not re.fullmatch(r'[a-f0-9]{64}', args[2]):
        raise ValueError('只接受：v主版本.次版本.补丁 提交SHA 产物SHA256')
    tag, commit, digest = args
    match = TAG.fullmatch(tag)
    series = f'v{match[1]}.{match[2]}'
    patch = int(match[3])
    with (ROOT / 'deploy.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        with tempfile.TemporaryDirectory(prefix='incoming-', dir=ROOT) as tmp:
            archive = Path(tmp) / 'web.tar.gz'
            h = hashlib.sha256()
            size = 0
            with archive.open('wb') as out:
                while True:
                    chunk = stream.read(1024 * 1024)
                    if not chunk:
                        break
                    size += len(chunk)
                    if size > 50 * 1024 * 1024:
                        raise ValueError('发布包超过 50MB')
                    h.update(chunk)
                    out.write(chunk)
            if h.hexdigest() != digest:
                raise ValueError('发布包摘要不匹配')
            web = Path(tmp) / 'web'
            web.mkdir()
            with tarfile.open(archive, 'r:gz') as tar:
                members = tar.getmembers()
                if len(members) > 5000 or sum(m.size for m in members) > 100 * 1024 * 1024:
                    raise ValueError('解压内容过大')
                for member in members:
                    path = Path(member.name)
                    if path.is_absolute() or '..' in path.parts or not (member.isfile() or member.isdir()):
                        raise ValueError('发布包包含非法路径或文件类型')
                    if member.isfile():
                        target = web / path
                        target.parent.mkdir(parents=True, exist_ok=True)
                        with tar.extractfile(member) as src, target.open('wb') as dst:
                            shutil.copyfileobj(src, dst)
                        target.chmod(0o644)
            manifest = json.loads((web / 'release.json').read_text())
            if manifest != {'version': tag, 'commit': commit, 'basePath': f'/work/dip-proto/{series}/'}:
                raise ValueError('发布版本信息不匹配')
            html = (web / 'index.html').read_text()
            if f'/work/dip-proto/{series}/assets/' not in html:
                raise ValueError('构建产物的资源路径不正确')
            current = PUBLIC / series
            if current.exists():
                old = json.loads((current / 'release.json').read_text())
                old_match = TAG.fullmatch(old['version'])
                if not old_match or int(old_match[3]) > patch:
                    raise ValueError('拒绝用旧补丁覆盖新版本；回滚请由管理员显式操作')
            destination = ROOT / 'releases' / tag
            record = ROOT / 'archives' / f'{tag}.sha256'
            if destination.exists():
                if not record.exists() or record.read_text().strip() != digest:
                    raise ValueError('禁止覆盖已发布的不可变版本')
            else:
                shutil.move(str(web), destination)
                record.write_text(digest + '\n')
                shutil.copyfile(archive, ROOT / 'archives' / f'{tag}.tar.gz')
            if current.is_symlink():
                if current.resolve() != destination.resolve():
                    (ROOT / 'archives' / f'{series}.previous').write_text(os.readlink(current) + '\n')
            elif current.exists():
                raise ValueError('目标不是部署软链接，拒绝覆盖')
            pending = PUBLIC / f'.{series}.pending'
            pending.unlink(missing_ok=True)
            pending.symlink_to(destination)
            os.replace(pending, current)
            print(json.dumps(manifest, ensure_ascii=False))


if __name__ == '__main__':
    try:
        receive(os.environ.get('SSH_ORIGINAL_COMMAND', ''), sys.stdin.buffer)
    except Exception as error:
        print(f'部署失败：{error}', file=sys.stderr)
        sys.exit(1)
