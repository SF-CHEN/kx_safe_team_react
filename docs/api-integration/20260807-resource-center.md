# 对接纪要：资源中心

- **日期：** 2026-08-07
- **范围：** 资源中心「我的任务与报告」只读后端总表；列表服务端分页；补充材料走上传 + supplementMaterial
- **相关路径：**
  - `src/app/pages/ResourceCenter.tsx`
  - `src/api/evaluation/myList.ts`
  - `src/api/evaluation/evaluationTaskMaster.ts`
- **OpenAPI：** `src/api/docs/api.json` → `/temp/evaluation-task-master/page`（见 [20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)）
- **UI 改动：** 是（表格底部增加既有 `DataPagination`；用户点名要求分页）
- **关联：**
  - `[20260807-eval-tasks.md](./20260807-eval-tasks.md)`
  - `[20260807-llm-eval-tasks.md](./20260807-llm-eval-tasks.md)`
  - `[20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)`

## 变更记录

| 日期         | 说明                                            |
| ---------- | --------------------------------------------- |
| 2026-08-14 | 顶部状态统计卡对接 `GET /temp/overview/myTaskOverview`；「全部任务」为四态合计 |
| 2026-08-14 | 去掉顶部统计对 `page` 的凑数请求（无专用统计接口）；卡片数字改为 `—` |
| 2026-08-14 | 去掉 `workflowStore` 合并；列表走总表 `page` 分页；补充材料接 `supplementMaterial`；交付文件走 `sys-file/download` |
| 2026-08-13 | **列表改走总表**：见 [20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)；不再并行三类 `page` |
| 2026-08-07 | 大模型任务映射：`type` 枚举 PERFORMANCE/SAFETY；诉求读 `demandSupplement` |
| 2026-08-07 | 初稿；列表改读三类 `page` + `entity.userId`；附件/报告/消息未接 |

## 已对接（可联调）

| 能力        | 接口                                                  | 前端封装                   | 备注                    |
| --------- | --------------------------------------------------- | ---------------------- | --------------------- |
| 我的任务分页    | `POST /temp/evaluation-task-master/page`            | `fetchMyResourceTasks` | `entity.userId` + 产品/状态/名称或 id；默认 10 条/页 |
| 状态统计卡片    | `GET /temp/overview/myTaskOverview`                 | `fetchMyTaskOverview` | `processingCount` / `awaitSupplementCount` / `deliveredCount` / `terminatedCount`；全部=四态合计 |
| 补充材料      | `POST /temp/sys-file/upload` + `POST /temp/evaluation-task-master/supplementMaterial` | `uploadSysFile` / `supplementEvaluationTaskMaterial` | 接口只收一个 `supplementFileId` |
| 报告/材料下载  | `GET /temp/sys-file/download`                       | `downloadSysFile`      | 列表字段 `deliverFileId` / `supplementFileId` |
| 模型 API 配置 | `GET /temp/depth-model/dropdown`                    | `fetchDepthModelDropdown` | |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 任务列表 / 筛选 / 分页 | `evaluation-task-master/page` | 已接 | 不再合并 `workflowStore` |
| 我的任务概览 | `overview/myTaskOverview` | 已接 | 顶部六卡中前五卡数字 |
| 补充材料 | `sys-file/upload` + `supplementMaterial` | 已接 | 多选时只用第一个文件 |
| 文件下载 | `sys-file/download` | 已接 | |
| 任务详情 VO / 沟通记录 | `getDetailById` / `listByMasterId` | 未挂 UI | 列表已有文件 id，详情未改走 DetailVo |
| 消息通知 | — | 无接口 | 仍读本地 `workflowStore` |

## 字段映射（列表 / 详情）

| UI    | 接口来源                                             | 状态      | 说明                                |
| ----- | ------------------------------------------------ | ------- | --------------------------------- |
| 任务编号  | `master:` + `id` | 已实现     | |
| 任务名称  | `name`       | 已实现     | 空则 `任务 #id` |
| 产品    | `productType`                                  | 已实现     | 筛选下拉传入对应枚举；智能体无枚举，前端空列表 |
| 被测对象  | `targetObject`               | 已实现     | |
| 提交方式  | `submitType`                                 | 已实现     | `LOCAL_PROJECT_FILE` / `USER_MODEL` |
| 状态    | `status`                                         | 已实现     | 见下方；筛选「已交付」传 `DELIVERED`，「已终止」传 `TERMINATED` |
| 提交时间  | `createdAt`                                      | 已实现     | |
| 评测诉求  | 总表无独立字段，暂用 `name` | 已实现 | 详情 VO 有 `evaluationRequirement`，本轮未挂 |
| 已提交材料 | `supplementFileId` | 已实现 | 名称暂为 `文件 #id`；原始评测材料在 DetailVo，未挂 |
| 报告下载  | `deliverFileId` | 已实现 | 走 `sys-file/download` |
| 补充材料  | `supplementMaterial` | 已实现 | 先 upload 再提交文件 id |

## 状态映射（evaluation-task-master）

| 后端                       | 资源中心展示            |
| ------------------------ | ----------------- |
| `PROCESSING` / `WAITING` | 处理中               |
| `AWAIT_SUPPLEMENT`       | 待用户补充             |
| `DELIVERED` / `COMPLETED` / `已推送` | 已交付 |
| `TERMINATED` / `FAILED` / `已终止` | 已终止 |
| 其它中文工作流态                 | 透传                |

## 待确认事项

### Q1：`page` 是否按 `entity.userId` 过滤

- **现状：** 前端传 `entity: { userId }`；若后端忽略，会看到他人任务。
- **方案：** 1) 后端确认按 userId 过滤 2) 服务端强制取当前登录用户、忽略 body 3) 前端二次 filter（不可靠）
- **建议（仅建议）：** 方案 2
- **状态：** 待确认

### Q2：智能体安全评测

- **现状：** 总表无 AGENT 产品类型；筛选「智能体安全评测」前端直接空列表，不请求接口。
- **方案：** 1) 沿用 `evaluation-task` + `type` 2) 新增专用表 3) 暂不展示
- **状态：** 待确认（当前方案 3）

### Q3：模型 API 配置是否改读 `depth-model`

- **现状：** **已选定方案 2 / 已实现** — 资源中心与创建弹窗均读 `GET /temp/depth-model/dropdown`。
- **状态：** 已实现

### Q4：消息通知

- **现状：** OpenAPI **无**通知接口；仍用 `workflowStore` localStorage。
- **方案：** 1) 等通知 API 2) 继续本地 3) 隐藏消息入口
- **状态：** 待确认（当前方案 2）

### Q5：已交付 / 已终止筛选枚举

- **现状：** 当前 OpenAPI 为 `DELIVERED` / `TERMINATED`；旧前端曾按 `COMPLETED` / `FAILED` 写入。筛选与统计按新枚举请求。
- **影响：** 若线上库仍是 `COMPLETED`/`FAILED`，「已交付」「已终止」卡片和筛选会为 0，但「全部任务」仍能看到并映射展示。
- **方案：** 1) 后端统一新枚举 2) 前端筛选同时打两次 page 再合并（破坏分页） 3) 筛选改回旧枚举
- **建议（仅建议）：** 方案 1
- **状态：** 待确认

### Q6：搜索是精确匹配还是模糊

- **现状：** 关键词写入 `entity.name`；`master:数字` 或纯数字写入 `entity.id`。无法同时按被测对象搜。
- **状态：** 待确认（按常见 MyBatis-Plus 字符串模糊处理，未擅自换字段）

## 后端缺口

| 缺口能力        | 现状     | 前端临时策略        |
| ----------- | ------ | ------------- |
| 通知消息        | 无      | 本地通知          |
| 智能体任务       | 无产品枚举     | 筛选该项空列表         |
| 详情评测诉求 / 原始材料名 | 在 `getDetailById` DetailVo | 本轮列表未挂详情接口 |
| 补充材料多文件 | `supplementFileId` 单值 | 只提交第一个文件 |

## 过时文案清理

| 文案位置          | 处理          | 说明         |
| ------------- | ----------- | ---------- |
| 材料空态「文件存储尚未接入」 | 改为「暂无已提交材料」 | 总表已有文件 id |
| 列表不再回退 localStorage | 已删除合并逻辑 | 失败时展示空列表 |

## 验收要点

- [ ] Network：打开资源中心可见 `POST /temp/evaluation-task-master/page`，body 含 `entity.userId`、`pageCurrent`、`pageSize`
- [ ] Network：同时可见 `GET /temp/overview/myTaskOverview`；顶部状态卡数字来自该接口
- [ ] 「全部任务」= 四态合计；「未读消息」仍为本地通知数
- [ ] 无 `xuanjian-workflow-tasks-v1` 任务混入列表（编号应为 `master:` 前缀）
- [ ] 翻页 / 改每页条数会重新请求对应页
- [ ] 产品 / 状态 / 搜索改变后回到第 1 页
- [ ] 补充材料后概览会刷新（再次请求 `myTaskOverview`）
- [ ] 补充材料 Network 可见 `sys-file/upload` 与 `supplementMaterial`
- [ ] 有 `deliverFileId` 的已交付任务可下载
- [ ] 消息通知仍可为本地数据
