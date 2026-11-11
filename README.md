# dip-proto

智慧家庭数智平台原型，包含工作台、平台模块导航、下载中心、审批中心、数据分级降级申请和飞书通知演示。当前版本为 `v2.0.3`，使用前端演示数据。

默认访问版本目录会跳转到工作台（`/workbench`）。下载中心使用独立地址 `/downloadable-files`，可通过平台右上角下载图标打开。旧版根地址携带 `requestId` 的文件定位链接仍会进入对应下载页面。

## 当前功能

- 工作台提供功能搜索、可申请权限标识与申请表单、前九项收藏、收藏拖动排序、日期周次、审批待办、帮助与公告及最近使用。
- 九宫格按工作台、数据加工、洞察分析、数据应用、平台管理组织模块，顶部与左侧菜单随模块切换；未实现的业务页面保留占位。
- 下载中心、审批中心、系统管理分别组织各自菜单，工作台不显示平台侧栏。
- 页面采用自适应布局，工作空间、收藏顺序、最近使用及权限申请原型记录保存在当前浏览器。

权限标识采用 `src/app/data/menuAccess.ts` 中的原型配置，当前将用户管理等权限配置页面设为需申请。权限申请记录只保存在本地浏览器，不会实际授权；项目尚未接入服务端权限或审批接口。工作台待办来自 `src/app/data/approvalRecords.ts` 中与“我的审批”共用的演示数据。

## 本地开发

使用 Node.js 22 和 pnpm 10.11.0。

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

## 单文件分享版本

`dip-proto-share.html` 是可直接打开的离线演示版本，包含生成时的整个平台页面、脚本和样式。需要更新时执行 `pnpm build:share`，默认打开工作台，下载中心仍通过右上角入口进入。

本地开发不会自动更新分享文件。仅在明确要求时重新生成分享版本；提交 GitHub、发布版本和更新线上环境也需单独明确要求。

## 版本开发与发布

| 分支 | 正式 Release 标签 | 访问地址 |
| --- | --- | --- |
| `release/2.0` | `v2.0.0`、`v2.0.1` 等 | https://ai.liqi123.com/work/dip-proto/v2.0/ |
| `release/2.1` | `v2.1.0`、`v2.1.1` 等 | https://ai.liqi123.com/work/dip-proto/v2.1/ |

`main` 保留公共基线及默认工作流，各版本分支独立开发。后续新系列同样按主、次版本号自动映射独立路径。创建分支不会立即上线，正式发布 Release 后才部署。

`release/2.0` 和 `release/2.1` 已创建。继续开发 2.1 功能：

```bash
git switch release/2.1
# 开发完成后，将 package.json 的 version 改为 2.1.0，提交并推送。
git push -u origin release/2.1
```

发布 `v2.0.1` 的步骤：

1. 在 `release/2.0` 开发并将 `package.json` 版本改为 `2.0.1`。
2. 提交并推送该分支，等待“构建检查”通过。
3. 在 GitHub 创建正式 Release，标签填 `v2.0.1`，Target 选择 `release/2.0`。
4. 点击 Publish release，等待“发布并部署阿里云”工作流通过。
5. 若 GitHub 发布事件漏触发，定时检查会自动补齐部署；检查计划为每 5 分钟一次，实际时间受 GitHub 调度影响。
6. 打开该系列访问地址，或检查 `release.json` 中的版本和提交号。

Release 标签必须与 package.json 版本一致，且标签提交属于对应 `release/主.次` 分支。草稿和预发布版本不会上线；仅推送分支或标签也不会触发上线。已发布标签和产物不可覆盖。补丁升级只影响当前系列，其他系列继续运行。

部署配置、恢复及回滚见 [部署说明](deploy/README.md)。原始设计来自 [Figma downLoadCenter](https://www.figma.com/design/TX9w6rP0PbghW7zljUJhRX/downLoadCenter)。
