# 阿里云部署说明

## 部署结构

本项目为静态 React 原型。构建在 GitHub Actions 完成，阿里云仅接收构建产物，复用现有 HTTPS 和 Nginx，不新增常驻服务。

- GitHub：`yangqiang5156/dip-proto`
- 域名：`ai.liqi123.com`
- 公开目录：`/www/wwwroot/ai/work/dip-proto/v主.次`，软链接指向独立发布目录。
- 发布目录：`/opt/dip-proto/releases/v主.次.补丁`
- 发布归档及摘要：`/opt/dip-proto/archives/`
- 上一版本记录：`/opt/dip-proto/archives/v主.次.previous`
- 受限 SSH 入口：`/usr/local/lib/dip-proto/receive.py`
- Nginx 扩展：`/www/server/panel/vhost/nginx/extension/ai.liqi123.com/dip-proto.conf`

页面路由与资源使用同一构建基础路径，深层页面刷新会返回当前系列的 index.html。缺失静态资源返回 404。版本系列之间的文件、地址和切换互不覆盖。

## GitHub Actions

`ci.yml` 在 main、release 分支和 PR 执行安装、部署脚本测试及前端构建。

`release.yml` 在正式 Release 发布后执行：校验语义化版本与分支、固定标签构建、生成 release.json、归档产物、通过 SSH 部署、验证公网版本及深层路由。Actions 页面也可以手动重试一个已发布正式版本。所有部署串行执行，避免竞争。旧补丁不能覆盖该系列的新补丁。

仓库 Secrets：

| 名称 | 用途 |
| --- | --- |
| `DEPLOY_HOST` | 阿里云服务器地址 |
| `DEPLOY_SSH_KEY` | 项目专用 SSH 私钥 |
| `DEPLOY_KNOWN_HOSTS` | 通过现有可信 SSH 连接核实的主机公钥 |

部署用户 `dip-deploy` 无 sudo 权限，SSH Key 强制执行收包脚本，禁止交互终端和端口转发。服务端脚本由 root 管理，部署用户只写本项目产物目录。私钥不进入 Git。

收包脚本验证版本、提交号、SHA256、清单、资源路径、归档大小与路径，拒绝软链接、特殊文件和目录穿越。校验完成后原子替换对应版本系列的软链接；旧发布包和目录保留。发布版本和标签不应修改。

## 发布事件补偿

`reconcile.yml` 保留发布事件触发，同时每 5 分钟检查已发布的正式 Release，按各系列最高补丁与公网 release.json 对比，发现未上线版本时调度 release.yml。GitHub 高峰期定时任务可能延迟。存在运行中的部署时跳过，已正确上线的版本不重复部署。仅此检查任务具有本仓库 `actions: write` 权限，使用临时 GITHUB_TOKEN，不新增长期 GitHub 凭据。

可在“检查待部署的 Release”手动运行时填写 force_tag，演练当前系列最新正式版本的完整检查及重新部署流程。

## 验证

```bash
python3 -m unittest discover -s deploy -p 'test_*.py'
VITE_BASE_PATH=/work/dip-proto/v2.0/ pnpm build
curl -f https://ai.liqi123.com/work/dip-proto/v2.0/release.json
```

自动化部署成功后，还应检查页面显示及关键交互。此项目没有真实后端、数据库或需要迁移的业务数据。

## 显式回滚

由有管理员权限的人 SSH 登录服务器，先查看当前及上一版本：

```bash
readlink /www/wwwroot/ai/work/dip-proto/v2.0
cat /opt/dip-proto/archives/v2.0.previous
```

确认目标历史发布目录存在且 release.json 正确后，显式替换软链接，例如：

```bash
ln -s /opt/dip-proto/releases/v2.0.0 /www/wwwroot/ai/work/dip-proto/.v2.0.rollback
mv -Tf /www/wwwroot/ai/work/dip-proto/.v2.0.rollback /www/wwwroot/ai/work/dip-proto/v2.0
curl -f https://ai.liqi123.com/work/dip-proto/v2.0/release.json
```

不会改变其他版本系列。无需重载 Nginx。回滚不会删除旧产物。修复完成应发布更高补丁号，而非覆盖历史版本。

## 维护

发布脚本和 Nginx 配置变更需要管理员复核后同步到服务器，普通 Release 只发布静态文件，不自动替换服务器管理脚本。归档不自动删除，定期检查磁盘后按需清理，保留当前版本、上一版本及回滚所需产物。
