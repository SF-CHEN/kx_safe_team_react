# 对接纪要：评测任务总表（资源中心 / 任务运维）

- **日期：** 2026-08-13
- **范围：** 资源中心「我的任务」列表、管理端任务运维 / 运营总览 / 用户历史任务，改为只读评测任务总表
- **相关路径：**
  - `src/app/pages/ResourceCenter.tsx`
  - `src/app/components/AdminWorkflowWorkbench.tsx`
  - `src/app/pages/AdminDashboard.tsx`
  - `src/api/evaluation/evaluationTaskMaster.ts`、`myList.ts`、`adminList.ts`
- **OpenAPI：** `src/api/docs/api.json` → `/temp/evaluation-task-master/*`
- **UI 改动：** 否（仅数据源与状态映射）
- **关联：**
  - [20260807-resource-center.md](./20260807-resource-center.md)
  - [20260807-eval-tasks.md](./20260807-eval-tasks.md)
  - [20260807-llm-eval-tasks.md](./20260807-llm-eval-tasks.md)

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-13 | 资源中心、管理端任务列表不再并行打三个 `page`，改走 `evaluation-task-master/page`；改状态走总表 `update` |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 资源中心我的任务 | `POST /temp/evaluation-task-master/page` | `fetchMyResourceTasks` | `entity.userId` |
| 管理端任务列表 | 同上 | `fetchAdminEvaluationTasks` | 不按用户过滤 |
| 管理端改状态 | `PUT /temp/evaluation-task-master/update` | `updateAdminEvaluationTaskStatus` | 写入总表英文枚举 |
| 任务详情（封装未挂 UI） | `GET /temp/evaluation-task-master/getDetailById` | `getEvaluationTaskMasterById` | 本轮列表未用 |
| 可信/数据安全材料 | `GET .../getDetailById` + `sys-file/getDetailById` | 管理端按 `taskRefId` 查明细 | 总表无 `fileId` |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 列表 | `evaluation-task-master/page` | 已接 | 替代三类分表 `page` |
| 改状态 | `evaluation-task-master/update` | 已接 | 替代可信/数据安全分表 `update`；大模型分表原本无 update |
| 用户提交材料 | 分表 `getDetailById`（`taskRefId`） | 已接 | 仅 `TRUST` / `DATA_SAFETY` |
| 报告上传 / 推送 | — | 无接口 | 仍 toast |
| 智能体安全 | 总表 `productType` 无对应枚举 | 无接口 | 列表不展示 |

## 字段映射

| UI 列 / 能力 | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 任务编号 | `master:` + `id` | 已实现 | 总表主键，不再用分表前缀 |
| 任务名称 | `name` | 已实现 | 空则 `任务 #id` |
| 产品 | `productType` | 已实现 | 见下方产品映射 |
| 被测对象 | `targetObject` | 已实现 | |
| 提交方式 | `submitType` | 已实现 | `LOCAL_PROJECT_FILE` / `USER_MODEL` |
| 状态 | `status` | 已实现 | 英文枚举映射中文工作流态 |
| 提交时间 | `createdAt` | 已实现 | |
| 评测诉求 | — | 已实现（空态） | 总表无独立诉求字段，详情暂用 `name` |
| 提交用户 | `userId` → `用户 #id` | 已实现 | 无用户名 |
| 用户材料 | 分表 `fileId`（经 `taskRefId`） | 已实现 | 性能/安全分表无 fileId，材料为空 |

### 产品映射

| `productType` | 管理端产品 | 资源中心 `evalType` |
| --- | --- | --- |
| `PERFORMANCE` | 大模型性能评测 | 大模型评测（页面再显示为性能评测） |
| `SAFETY` | 大模型安全评测 | 大模型安全评测 |
| `DATA_SAFETY` | 模型数据安全评测 | 模型数据安全评测 |
| `TRUST` | 深度模型可信测评 | 深度模型可信测评 |

### 状态映射

| 总表 | 前端工作流态 | 管理端分组 |
| --- | --- | --- |
| `PROCESSING` / `WAITING` | 处理中 | 处理中 |
| `AWAIT_SUPPLEMENT` | 待用户补充 | 待用户补充 |
| `COMPLETED` | 已交付 | 已结束 |
| `FAILED` | 已终止 | 已结束 |

写入：`待补充材料` / `待用户补充` → `AWAIT_SUPPLEMENT`。

## 待确认事项

### Q1：`page` 是否按 `entity.userId` 过滤

- **现状：** 资源中心传 `entity: { userId }`；若后端忽略，会看到他人任务。
- **方案：** 1) 后端按 userId 过滤 2) 服务端强制取当前登录用户 3) 前端二次 filter（不可靠）
- **建议（仅建议）：** 方案 2
- **状态：** 待确认（沿用资源中心旧问）

### Q2：`WAITING` 与 `PROCESSING` 是否应区分展示

- **现状：** 两者都映射为「处理中」，以适配现有四态筛选。
- **方案：** 1) 维持合并 2) 允许改 UI 增加「等待处理」 3) `WAITING` 映射为「待受理」
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（本轮按方案 1）

### Q3：`FAILED` 映射为「已终止」还是「处理异常」

- **现状：** 已映射「已终止」，进入已结束分组。旧分表 `FAILED` 曾映射「处理异常」并算处理中。
- **方案：** 1) 已终止 2) 处理异常（仍算处理中） 3) 改 UI 增加失败态
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（本轮按方案 1）

### Q4：改状态是否只需 `id` + `status`

- **现状：** `update` 提交了名称、产品、被测对象等已有字段，避免整行覆盖清空。
- **状态：** 待确认（联调看后端是增量还是全量）

## 后端缺口

| 缺口能力 | 现状 | 前端临时策略 |
| --- | --- | --- |
| 总表无 `fileId` | 材料在分表 | 管理端用 `taskRefId` 查明细；性能/安全无文件 |
| 报告独立上传 | 无 | toast |
| 报告推送 | 无 | toast |
| 任务终止专用语义 | 仅有 `FAILED` | 终止按钮仍 toast，未写 `FAILED` |
| 智能体任务 | 枚举无 AGENT | 列表不展示 |
| 列表分页 UI | 单次 200 | 未加分页条 |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 无新增联调文案 | — | 页面副标题仍为业务描述 |

## 验收要点

- [ ] 资源中心打开 Network 只见一条 `POST /temp/evaluation-task-master/page`，body 含 `entity.userId`
- [ ] 管理端任务运维 / 总览打开同上路径，不并行打三类分表 `page`
- [ ] 请求补件 Network 可见 `PUT /temp/evaluation-task-master/update`，`status=AWAIT_SUPPLEMENT`
- [ ] 布局未改；报告上传 / 推送 / 终止仍为 toast
- [ ] 可信 / 数据安全任务若有 `taskRefId`+`fileId`，材料区可下载
