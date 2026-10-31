#!/usr/bin/env bash
# 管理员首次安装；在服务器执行，参数为本项目专用 SSH 公钥文件。
set -euo pipefail
[[ $(id -u) == 0 ]] || { echo '请使用管理员账号执行'; exit 1; }
SOURCE_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
PUBLIC_KEY_FILE=${1:?需要专用 SSH 公钥文件}
grep -Eq '^ssh-ed25519 [A-Za-z0-9+/=]+( .*)?$' "$PUBLIC_KEY_FILE"
ROOT=/opt/dip-proto
EXT=/www/server/panel/vhost/nginx/extension/ai.liqi123.com
install -d -m 755 "$ROOT" "$EXT" /usr/local/lib/dip-proto
install -d -m 700 "$ROOT/backups"
STAMP=$(date -u +%Y%m%dT%H%M%SZ)
cp -a /www/server/panel/vhost/nginx/html_ai.liqi123.com.conf "$ROOT/backups/site-$STAMP.conf"
if [[ -e "$EXT/dip-proto.conf" ]]; then
  cp -a "$EXT/dip-proto.conf" "$ROOT/backups/dip-proto-$STAMP.conf"
fi
if ! id dip-deploy >/dev/null 2>&1; then
  useradd --system --create-home --shell /bin/sh dip-deploy
fi
install -d -o dip-deploy -g dip-deploy -m 755 "$ROOT/releases" "$ROOT/archives" /www/wwwroot/ai/work/dip-proto
# 临时收包目录及部署锁由专用账号管理。
chown dip-deploy:dip-deploy "$ROOT"
install -d -o dip-deploy -g dip-deploy -m 700 /home/dip-deploy/.ssh
{ printf 'restrict,command="/usr/local/lib/dip-proto/receive.py" '; cat "$PUBLIC_KEY_FILE"; } > /home/dip-deploy/.ssh/authorized_keys
chown dip-deploy:dip-deploy /home/dip-deploy/.ssh/authorized_keys
chmod 600 /home/dip-deploy/.ssh/authorized_keys
install -o root -g root -m 755 "$SOURCE_DIR/receive.py" /usr/local/lib/dip-proto/receive.py
install -o root -g root -m 644 "$SOURCE_DIR/nginx.conf" "$EXT/dip-proto.conf"
if ! /www/server/nginx/sbin/nginx -t; then
  if [[ -e "$ROOT/backups/dip-proto-$STAMP.conf" ]]; then
    cp -a "$ROOT/backups/dip-proto-$STAMP.conf" "$EXT/dip-proto.conf"
  else
    rm -f "$EXT/dip-proto.conf"
  fi
  exit 1
fi
/www/server/nginx/sbin/nginx -s reload
echo 'dip-proto 部署入口安装完成'
