# 对接纪要：模型可信 / 模型数据安全评测任务

- **日期：** 2026-08-07
- **范围：** 深度模型可信评测、模型数据安全评测（用户创建 + 管理端列表）
- **相关路径：**
  - `src/app/components/LightweightUploadTaskModal.tsx`
  - `src/app/components/AdminWorkflowWorkbench.tsx`
  - `src/app/pages/AdminDashboard.tsx`（待办徽标）
  - `src/api/evaluation/adminList.ts`、`modelTrust.ts`、`modelDataSafety.ts`
- **OpenAPI：** `src/api/docs/api.json`
- **UI 改动：** 否（默认）

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-07 | 初稿；用户创建任务对接 `add` |
| 2026-08-07 | 管理端列表改读双 `page`；状态改走 `update`；上传明确暂缓 |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 新增模型可信评测任务 | `POST /temp/model-trust-evaluation-task/add` | `addModelTrustEvaluationTask` | 门户轻量上传弹窗 |
| 新增模型数据安全评测任务 | `POST /temp/model-data-safety-evaluation-task/add` | `addModelDataSafetyEvaluationTask` | 门户轻量上传弹窗 |
| 管理端列表（可信） | `POST /temp/model-trust-evaluation-task/page` | `fetchAdminEvaluationTasks` | 与数据安全合并排序 |
| 管理端列表（数据安全） | `POST /temp/model-data-safety-evaluation-task/page` | 同上 | `pageSize=200` |
| 管理端改状态 | `PUT .../update` | `updateAdminEvaluationTaskStatus` | 写入当前下拉文案；枚举见 Q2 |

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
| 配置摘要 | `fileId` / `emailStatus` | 已实现 | 有则展示「关联文件 ID / 邮件状态」 |
| 附件下载 / 报告上传 / 推送 / 备注 | — | 暂缓 | 上传未开放；操作 toast 提示 |

## 待确认事项

### Q1：`fileId` 与文件上传

- **状态：** **暂缓**（用户确认：上传先不管，后端未好）
- 创建与列表均不依赖上传；材料区保持空态。

### Q2：`status` / `emailStatus` 枚举

- **现状：** 管理端下拉仍用原中文工作流态；改状态原样写入 `status`。
- **方案：** 后端给出枚举后做映射；或确认可直接存中文。
- **状态：** 待确认

### Q3：管理端列表数据源

- **状态：** **已选定方案 1 / 已实现** — 读双 `page` 合并；缺列 `—`。

### Q4：用户管理「任务数」列

- **现状：** 仍统计本地 `workflowStore`，与 API 列表可能不一致。
- **方案：** 1) 按 `userId` 聚合 API 任务数 2) 等后端用户接口带任务计数字段 3) 列显示 `—`
- **状态：** 待确认（本轮未改）

## 后端缺口

| 缺口能力 | 现状 | 前端临时策略 |
| --- | --- | --- |
| 文件上传 / 下载 | 无 | 材料空态；上传/下载 toast |
| 报告推送 | 无 | 推送按钮 toast |
| 内部备注 | 无字段 | 保存备注 toast |
| 用户名 / 联系方式 | DTO 仅 `userId` | 显示 `用户 #id`，联系方式 `—` |
| 列表分页 UI | 单次拉 200 | 超出需补分页（未加 UI） |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 材料区「API 配置无本地文件」 | 改为「文件上传尚未接入…」 | 与上传暂缓一致 |
| 推送区底部说明 | 改为「推送与文件能力待后端接口接入」 | 能力未接，非误导「已联调完成」 |

## 验收要点

- [ ] Network：`page` 两类任务均有请求；改状态可见对应 `update`
- [ ] 列表合并展示可信 + 数据安全；布局未改
- [ ] 无用户名/联系方式/模型时为 `—` 或 `用户 #id`，未用近似字段冒充
- [ ] 上传/推送/备注点击仅 toast，未伪造接口
- [ ] 顶栏待办徽标基于 API 列表（非已推送）
