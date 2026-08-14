# 对接纪要：管理后台 · 用户管理

- **日期：** 2026-08-14
- **范围：** 管理后台「用户管理」：用户分页列表、启停、资料编辑、顶部 KPI 四卡
- **相关路径：**
  - `src/app/components/AdminWorkflowWorkbench.tsx`（`RegisteredUserPanel`）
  - `src/app/pages/AdminDashboard.tsx`（总览侧用户列表映射）
  - `src/api/auth.ts`、`src/api/user/sysUser.ts`、`src/api/overview/operationalOverview.ts`、`src/api/types.ts`
- **OpenAPI：** `src/api/docs/api.md` / `api.json` → `/temp/sys-user/*`、`GET /temp/overview/userOverview`
- **UI 改动：** 否（仅数据源与字段映射）

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-14 | 按新文档重接：`enabled` / `lastLoginAt`；启停改 `updateUserStatus`；KPI 改 `userOverview` |
| 2026-08-14 | 历史任务 / 进行中计数改为 `evaluation-task-master/page` + `entity.userId`，不再全量拉再前端过滤 |
| 2026-08-14 | 重置密码对接 `POST /temp/sys-user/resetPassword`（固定为 123456 的 MD5） |
| 2026-08-14 | 历史任务弹窗加服务端分页（`pageCurrent` / `pageSize` + `DataPagination`） |
| 2026-08-14 | 「进行中任务」列去掉 page 凑数；无按用户统计接口，固定显示 `—` |
| 2026-08-14 | 侧栏用户/进行中徽章改用 `operationalOverview`，不再为侧栏拉 `sys-user/page` |
| 2026-08-14 | 用户列表展示 ADMIN；编辑/启停/重置密码禁用，仅可看历史任务 |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 用户分页 | `POST /temp/sys-user/page` | `fetchAuthUsers` | 不传 `role`，含 ADMIN+USER；ADMIN 只读 |
| 禁用/启用 | `POST /temp/sys-user/updateUserStatus` | `updateAuthUserStatus` / `updateSysUserStatus` | body: `{ userId, enabled }`；**不再**用 `update`+`deleted` |
| 编辑用户名 | `PUT /temp/sys-user/update` | `updateSysUser` | 仅写 `username` |
| 重置密码 | `POST /temp/sys-user/resetPassword` | `resetSysUserPassword` | body 仅 `{ userId }`；服务端写死为 `md5(123456)` |
| 用户 KPI | `GET /temp/overview/userOverview` | `fetchUserOverview` | 四卡主数字 |
| 历史任务 | `POST /temp/evaluation-task-master/page` | `fetchAdminEvaluationTaskPage({ userId, pageCurrent, pageSize })` | `entity.userId`；弹窗内 `DataPagination` |
| 进行中任务数 | — | — | **无按用户统计接口**；列显示 `—`，禁止用 page 凑 |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 用户列表 | `sys-user/page` | 已接 | 主列表 |
| 启停 | `sys-user/updateUserStatus` | 已接 | 专用接口 |
| 重置密码 | `sys-user/resetPassword` | 已接 | 仅传 userId |
| 用户总览 | `overview/userOverview` | 已接 | 替代本地 activities / 拉 200 条凑 KPI |
| 历史任务 | `evaluation-task-master/page` + `entity.userId` | 已接 | 弹窗分页 |
| 按用户进行中任务数 | — | 无接口 | 见 Q4；列空着显示 `—` |
| 联系方式独立字段 | — | 无接口 | 见 Q1 |

## 字段映射

| UI 列 / 能力 | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 用户名 / UID | `username` / `id` | 已实现 | |
| 联系方式 | — | 待确认 | 暂用 `username` 展示；见 Q1 |
| 注册时间 | `createdAt` | 已实现 | |
| 最后登录 | `lastLoginAt` | 已实现 | **不再**用 `updatedAt` 冒充 |
| 账号状态 | `enabled` | 已实现 | `true`→正常，`false`→已停用；缺省视为启用 |
| 总注册用户 | `UserOverviewVo.totalUserCount` | 已实现 | 失败回退列表 `total` |
| 今日新增 | `todayNewUserCount` | 已实现 | |
| 近 7 天活跃 | `activeUserCountLast7Days` | 已实现 | |
| 当前禁用 | `disabledUserCount` | 已实现 | 启停成功后前端乐观 ±1，并触发远程刷新 |

## 待确认事项（不阻塞其余对接）

### Q1：联系方式（手机号／邮箱）

- **现状：** `SysUser` 无 email / phone；编辑弹窗仍可改本地展示，仅 `username` 写入后端。
- **影响：** 「联系方式」列与编辑表单第二项无法落库。
- **方案：**
  1. 后端在 `SysUser` 增加 `email`/`phone`，前端再接
  2. 前端隐藏编辑弹窗联系方式输入（需改 UI，本轮未做）
  3. 维持现状：列展示 username，保存时 toast 提示未写入
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（本轮按方案 3）

### Q2：管理员重置密码

- **现状：** 已接 `POST /temp/sys-user/resetPassword`，body `{ userId }`；服务端固定重置为 `123456` 的 MD5。前端成功后用 prompt 展示明文 `123456` 供管理员传达。
- **状态：** 已实现

### Q3：`enabled` 缺省语义

- **现状：** 映射为 `enabled !== false`（缺省视为启用）。
- **方案：** 1) 维持 2) 缺省显示「—」不推断
- **状态：** 已选定：方案 1

### Q4：用户列表「进行中任务」列

- **现状：** OpenAPI 无「按用户统计进行中任务数」接口；`userOverview` / `taskOverview` 均为全站汇总。禁止用 `evaluation-task-master/page` 按用户拉列表凑数。
- **方案：**
  1. 后端增加如 `GET .../userTaskStats?userId=` 或列表字段 `ongoingTaskCount`
  2. 前端列固定显示 `—`（本轮已做）
  3. 用 page + userId 再前端过滤（已否决）
- **建议（仅建议）：** 方案 1；未提供前方案 2
- **状态：** 已选定：方案 2

## 后端缺口

| 缺口能力 | 现状 | 建议接口 / 字段 | 前端临时策略 |
| --- | --- | --- | --- |
| 联系方式 | 无字段 | `SysUser.email` 或 `phone` | 展示 username；编辑不落库 |
| 按用户进行中任务数 | 无接口 | 列表字段或专用统计 | 列显示 `—` |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 重置密码「需由后端重置」toast | 已删除 | 已接真实 `resetPassword` |
| 编辑成功 toast（联系方式未写入） | 保留 | 真实缺口提示，非误导演示文案 |

## 验收要点

- [ ] 用户管理 Network 可见 `POST /temp/sys-user/page`、`GET /temp/overview/userOverview`
- [ ] 禁用/启用走 `POST /temp/sys-user/updateUserStatus`（body 含 `userId`+`enabled`），**不应**再对启停打 `PUT .../update` + `deleted`
- [ ] 「最后登录」来自 `lastLoginAt`；无值显示 `—`
- [ ] 四张 KPI 与 `userOverview` 字段一致（失败时总注册回退分页 total）
- [ ] 点「历史任务」可见 `POST /temp/evaluation-task-master/page`，body 含 `entity.userId`、`pageCurrent`、`pageSize`；翻页会重新请求
- [ ] 「进行中任务」列固定 `—`；用户列表加载时**不应**为每个用户打 `evaluation-task-master/page`
- [ ] 点「重置密码」可见 `POST /temp/sys-user/resetPassword`，body 仅 `{ userId }`；成功后提示默认密码 `123456`
- [ ] 布局与按钮结构未改（历史任务弹窗底部分页为用户明确要求）
- [ ] 联系方式未擅自拼接后端语义
