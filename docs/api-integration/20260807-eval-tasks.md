# 对接纪要：模型可信 / 模型数据安全评测任务

- **日期：** 2026-08-07
- **范围：** 深度模型可信评测、模型数据安全评测（用户创建 + 管理端列表 + 文件上传/下载）
- **相关路径：**
  - `src/app/components/LightweightUploadTaskModal.tsx`
  - `src/app/components/AdminWorkflowWorkbench.tsx`
  - `src/app/pages/AdminDashboard.tsx`（待办徽标）
  - `src/api/evaluation/adminList.ts`、`modelTrust.ts`、`modelDataSafety.ts`
  - `src/api/file/sysFile.ts`（本轮新增）
- **OpenAPI：** `src/api/docs/api.json`
- **UI 改动：** 否（仅清过时文案）
- **后续：** 大模型性能/安全评测（`evaluation-task`）见 [`20260807-llm-eval-tasks.md`](./20260807-llm-eval-tasks.md)

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-13 | **列表改走总表** `evaluation-task-master/page`（见 [20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)） |
| 2026-08-07 | 初稿；用户创建任务对接 `add` |
| 2026-08-07 | 管理端列表改读双 `page`；状态改走 `update`；上传明确暂缓 |
| 2026-08-07 | 管理端列表额外合并 `evaluation-task/page`（详见 llm 纪要） |
| 2026-08-13 | **回接管理端**：用户列表/任务列表曾在 newUI 工作流同步中改成 `workflowStore`；现已接回 `fetchAuthUsers` / `fetchAdminEvaluationTasks` / 改状态 / 下材料。补件说明、独立报告、终止仍无接口 |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 文件上传 | `POST /temp/sys-file/upload` | `uploadSysFile` | multipart 字段名 `file`；前端校验 ≤50MB |
| 文件详情 | `GET /temp/sys-file/getDetailById` | `getSysFileById` / `fetchSysFilesByIds` | 管理端材料区 |
| 文件下载 | `GET /temp/sys-file/download` | `downloadSysFile` | blob 触发浏览器保存 |
| 新增模型可信评测任务 | `POST /temp/model-trust-evaluation-task/add` | `addModelTrustEvaluationTask` | 先 upload 再 add，带 `fileId` |
| 新增模型数据安全评测任务 | `POST /temp/model-data-safety-evaluation-task/add` | `addModelDataSafetyEvaluationTask` | 同上 |
| 管理端列表（可信） | `POST /temp/model-trust-evaluation-task/page` | `fetchAdminEvaluationTasks` | 与数据安全 / 大模型合并排序 |
| 管理端列表（数据安全） | `POST /temp/model-data-safety-evaluation-task/page` | 同上 | `pageSize=200` |
| 管理端改状态 | `PUT .../update` | `updateAdminEvaluationTaskStatus` | 写入当前下拉文案；枚举见 Q2 |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 用户提交材料 | `sys-file/upload` | 已接 | 创建任务前置 |
| 材料展示 | `sys-file/getDetailById` | 已接 | 按任务 `fileId` 批量拉 |
| 材料下载 | `sys-file/download` | 已接 | 管理端「用户提交材料」 |
| 报告独立上传 | — | **无接口** | DTO 仅单一 `fileId`，见 Q1 |
| 报告推送 | — | 无接口 | toast |
| 内部备注 | — | 无字段 | toast |

## 字段映射（创建任务）

| UI | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 本地文件 | `fileId`（经 upload 返回 `SysFile.id`） | 已实现 | |
| 评测诉求 | `evaluationRequirement` | 已实现 | |
| 当前用户 | `userId` | 已实现 | |

## 字段映射（管理端列表）

| UI 展示 | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 任务标题 | `evaluationRequirement` 截断 | 已实现 | 无独立 name；空则 `任务 #id` |
| 产品类型 | 按来源写死 | 已实现 | 可信 / 数据安全 |
| 评测诉求 | `evaluationRequirement` | 已实现 | |
| 提交用户 | `userId` → `用户 #id` | 已实现 | 无用户名字段 |
| 联系方式 | — | 已实现（空态） | 显示 `—` |
| 模型 | — | 已实现（空态） | 显示 `—` |
| 状态 | `status` | 已实现（透传） | 空则前端显示「待受理」；枚举待确认 |
| 创建时间 | `createdAt` | 已实现 | |
| 配置摘要 | `fileId` / `emailStatus` | 已实现 | |
| 用户提交材料 | `fileId` → `SysFile` | 已实现 | 展示 `originalName` / `size`，点击 download |
| 附件下载 | `GET .../sys-file/download` | 已实现 | |
| 报告上传 / 推送 / 备注 | — | 暂缓 | 见缺口 |

## 待确认事项

### Q1：报告文件与用户材料共用 `fileId`？

- **现状：** `ModelTrustEvaluationTask` / `ModelDataSafetyEvaluationTask` 仅有一个 `fileId`。管理端「上传报告」若写回同一字段会覆盖用户材料。
- **影响：** 管理端报告上传仍禁用（toast）。
- **方案：**
  1. 后端增 `reportFileId`（或附件列表）
  2. 确认可用 update 覆盖 `fileId` 存报告（不推荐）
  3. 继续暂缓报告上传
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（本轮按方案 3）

### Q2：`status` / `emailStatus` 枚举

- **现状：** 管理端下拉仍用原中文工作流态；改状态原样写入 `status`。
- **方案：** 后端给出枚举后做映射；或确认可直接存中文。
- **状态：** 待确认

### Q3：上传允许的文件类型

- **现状：** OpenAPI summary 写「pdf/office/图片/txt，最大50MB」；门户 `accept` 仍为 ZIP/模型等工程格式（未改 UI）。
- **影响：** 选工程压缩包可能被服务端拒收。
- **方案：**
  1. 后端放宽为压缩包/模型格式
  2. 前端改 `accept` 与文案对齐 pdf/office（需用户允许改 UI）
  3. 维持现状，联调看实际校验
- **建议（仅建议）：** 方案 1（产品页本就是工程文件场景）
- **状态：** 待确认

### Q4：OpenAPI upload `content-type`

- **现状：** `api.json` 标 `application/json` + binary；前端按常见约定用 `multipart/form-data` 字段 `file`。
- **状态：** 已按 multipart 实现；若联调失败再改

### Q5：用户管理「任务数」列

- **现状：** 已改为按 `fetchAdminEvaluationTasks` 的 `userId` 统计进行中任务，不再读 `workflowStore` 列表。
- **状态：** 已处理（2026-08-13）

## 后端缺口

| 缺口能力 | 现状 | 前端临时策略 |
| --- | --- | --- |
| 报告独立文件字段 | 无 | 报告上传 toast，不调用 upload+update |
| 报告推送 | 无 | 推送按钮 toast |
| 内部备注 | 无字段 | 保存备注 toast |
| 用户名 / 联系方式 | DTO 仅 `userId` | 显示 `用户 #id`，联系方式 `—` |
| 列表分页 UI | 单次拉 200 | 超出需补分页（未加 UI） |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 材料区「文件上传尚未接入…」 | 改为「暂无关联材料可下载」 | 上传已接，空态为无 fileId |
| 「推送与文件能力待后端…」 | 改为「报告推送与独立报告上传待后端补充接口」 | 下载已通 |

## 验收要点

- [ ] 创建任务 Network：先 `POST /temp/sys-file/upload`，再对应 `.../add`，body 含 `fileId`
- [ ] 管理端列表后可见 `GET .../sys-file/getDetailById`（有 fileId 的任务）
- [ ] 点击材料触发 `GET .../sys-file/download?id=`
- [ ] 列表合并展示；布局未改
- [ ] 报告上传 / 推送 / 备注仍为 toast，未伪造覆盖 fileId
- [ ] 样式布局未改
