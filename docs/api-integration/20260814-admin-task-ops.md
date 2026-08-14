# 对接纪要：管理后台 · 任务运维（评测任务总表 v2）

- **日期：** 2026-08-14
- **范围：** 管理后台「任务运维」工作台：列表、详情、补件、终止、交付、沟通记录
- **相关路径：**
  - `src/app/components/AdminWorkflowWorkbench.tsx`
  - `src/api/evaluation/evaluationTaskMaster.ts`
  - `src/api/evaluation/evaluationTaskMasterCommunication.ts`
  - `src/api/evaluation/adminList.ts`
  - `src/api/types.ts`
- **OpenAPI：** `src/api/docs/api.md` / `api.json` → `/temp/evaluation-task-master/*`、`/temp/evaluation-task-master-communication/*`、`/temp/sys-file/upload`
- **UI 改动：** 否（仅数据源与 handler；去掉过时 toast 文案）
- **关联：** [20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)（旧版改状态走 `update`，已废弃）

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-14 | 按新文档重接：去掉总表 `update`；补件/终止走 `adminReply`；交付走 `upload`+`deliver`；详情走 DetailVo；沟通走 `listByMasterId` |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 任务列表 | `POST /temp/evaluation-task-master/page` | `fetchAdminEvaluationTasks` | 一次拉 200 条，前端切片 |
| 任务详情 | `GET .../getDetailById` | `fetchAdminEvaluationTaskDetail` | 返回 `EvaluationTaskMasterDetailVo` |
| 沟通记录 | `GET .../listByMasterId` | 同上（并行） | 选中任务后加载 |
| 请求补件 | `POST .../adminReply` | `adminRequestSupplement` | `handleResult=REQUEST_SUPPLEMENT` |
| 终止任务 | `POST .../adminReply` | `adminTerminateTask` | `handleResult=TERMINATE` |
| 上传交付文件 | `POST /temp/sys-file/upload` | `uploadSysFile` | 确认交付时才上传 |
| 确认交付 | `POST .../deliver` | `adminDeliverTask` | `{ id, deliverFileId }` |
| 下载用户材料 | `GET /temp/sys-file/download` | `downloadSysFile` | 详情里的材料 id |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 列表 | `evaluation-task-master/page` | 已接 | |
| 详情 VO | `getDetailById` | 已接 | 用户名 / 邮箱 / 诉求 / 材料 / 交付文件 |
| 沟通 | `listByMasterId` + `adminReply` | 已接 | |
| 交付 | `sys-file/upload` + `deliver` | 已接 | 仅单文件 |
| 用户补件 | `supplementMaterial` | 封装已有 | 资源中心侧，本页不调 |
| 运营总览 | `GET /temp/overview/operationalOverview` | 已接 | 见 [20260814-admin-overview.md](./20260814-admin-overview.md) |

## 字段映射

| UI 列 / 能力 | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 任务编号 | `master:` + `id` | 已实现 | |
| 任务名称 | `name`（列表） | 已实现 | |
| 产品 | `productType` | 已实现 | |
| 被测对象 | `targetObject` | 已实现 | |
| 状态 | `status` | 已实现 | 见下方状态映射 |
| 提交用户 | DetailVo.`username` | 已实现 | 列表态仍可能是 `用户 #id`，选中后刷新 |
| 联系方式 | DetailVo.`email` | 已实现 | |
| 评测诉求 | DetailVo.`evaluationRequirement` | 已实现 | |
| 配置摘要 | `configSummary` | 已实现 | |
| 用户材料 | `evaluationMaterialFileId` / `supplementFileId` | 已实现 | 详情补齐 |
| 交付文件 | `deliverFileId` / 本地 pending + upload | 已实现 | |
| 沟通记录 | Communication 列表 | 已实现 | 一条记录可拆成管理员意见 + 用户回复 |
| 意见说明 | `adminComment` | 已实现 | |

### 状态映射（正式枚举）

| 总表 | 前端工作流态 |
| --- | --- |
| `PROCESSING` | 处理中 |
| `AWAIT_SUPPLEMENT` | 待用户补充 |
| `DELIVERED` | 已交付 |
| `TERMINATED` | 已终止 |

兼容历史：`WAITING`→处理中，`COMPLETED`→已交付，`FAILED`→已终止。

## 待确认事项

### Q1：交付是否仅支持单个文件

- **现状：** `DeliverTaskSo.deliverFileId` 为单个；UI 仍允许多选，前端只取第一个并 toast 提示。
- **方案：** 1) 维持单文件 2) 后端改多文件 3) 前端打 zip 再上传
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（本轮按方案 1）

### Q2：列表分页是否改为服务端分页

- **现状：** 仍一次 `pageSize=200` 再前端切片（与旧版一致，未改 UI）。
- **方案：** 1) 维持 2) 允许改 UI 接 `pageCurrent`/`total`
- **建议（仅建议）：** 方案 1，待任务量上来再改
- **状态：** 待确认

### Q3：运营总览是否改接 `operationalOverview`

- **现状：** 已接，见 [20260814-admin-overview.md](./20260814-admin-overview.md)
- **状态：** 已实现

### Q4：DetailVo.`materialName` 与 `supplementFileId` 对应关系

- **现状：** 补充材料文件名优先用 `materialName`；评测材料用 `evaluationMaterialName`。
- **状态：** 待联调确认命名是否交叉

## 后端缺口

| 缺口能力 | 现状 | 前端临时策略 |
| --- | --- | --- |
| 多文件交付 | 仅单 `deliverFileId` | 只取首个文件 |
| 智能体安全产品 | 枚举无 AGENT | 筛选项保留，列表无数据 |
| 操作日志持久化 | 无 | 仍 localStorage |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 「报告独立上传接口未开放…」 | 已删除 | 交付已接 |
| 「报告推送接口未开放…」 | 已删除 | |
| 「任务终止接口未开放…」 | 已删除 | |
| 「补件说明暂无独立字段…」 | 已删除 | 走 `adminComment` |

## 验收要点

- [ ] 打开任务运维 Network 可见 `POST /temp/evaluation-task-master/page`
- [ ] 选中任务可见 `getDetailById` + `listByMasterId`
- [ ] 发送补件：`adminReply` 且 `handleResult=REQUEST_SUPPLEMENT`，意见写入 `adminComment`
- [ ] 终止：同上且 `TERMINATE`
- [ ] 确认交付：先 `sys-file/upload`，再 `deliver` 带 `deliverFileId`
- [ ] 布局未改；过时「未开放」toast 已消失
