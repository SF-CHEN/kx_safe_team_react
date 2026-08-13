# 对接纪要：资源中心

- **日期：** 2026-08-07
- **范围：** 资源中心「我的任务与报告」列表 / 详情只读；模型配置与消息暂维持本地
- **相关路径：**
  - `src/app/pages/ResourceCenter.tsx`
  - `src/api/evaluation/myList.ts`
- **OpenAPI：** `src/api/docs/api.json` → `/temp/evaluation-task-master/page`（见 [20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)）
- **UI 改动：** 否（仅 loading / 空态说明文案）
- **关联：**
  - `[20260807-eval-tasks.md](./20260807-eval-tasks.md)`
  - `[20260807-llm-eval-tasks.md](./20260807-llm-eval-tasks.md)`

## 变更记录


| 日期         | 说明                                            |
| ---------- | --------------------------------------------- |
| 2026-08-13 | **列表改走总表**：见 [20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)；不再并行三类 `page` |
| 2026-08-07 | 大模型任务映射：`type` 枚举 PERFORMANCE/SAFETY；诉求读 `demandSupplement` |
| 2026-08-07 | 初稿；列表改读三类 `page` + `entity.userId`；附件/报告/消息未接 |


## 已对接（可联调）


| 能力        | 接口                                                  | 前端封装                   | 备注                    |
| --------- | --------------------------------------------------- | ---------------------- | --------------------- |
| 我的可信任务    | `POST /temp/model-trust-evaluation-task/page`       | `fetchMyResourceTasks` | `entity.userId`       |
| 我的数据安全任务  | `POST /temp/model-data-safety-evaluation-task/page` | 同上                     |                       |
| 我的大模型评测任务 | `POST /temp/evaluation-task/page`                   | 同上                     | 性能 / 安全 / 多模态靠 `type` |




## 字段映射（列表 / 详情）


| UI    | 接口来源                                             | 状态      | 说明                                |
| ----- | ------------------------------------------------ | ------- | --------------------------------- |
| 任务编号  | `trust:` / `data-safety:` / `evaluation:` + `id` | 已实现     | 加前缀防三表 id 冲突                      |
| 任务名称  | 可信/数据安全：`evaluationRequirement`；大模型：`name`       | 已实现     |                                   |
| 产品    | 按来源 / `type` 映射                                  | 已实现     | `PERFORMANCE`→性能；`SAFETY`→安全；兼容旧中文 type |
| 被测对象  | 大模型解析 `customModelConfig`；其它写死工程文案               | 已实现     |                                   |
| 提交方式  | 由 `modelType` 推导                                 | 已实现     | 无附件时「本地工程文件」或「模型 API 配置」          |
| 状态    | `status`                                         | 已实现     | 英文枚举映射中文；中文透传                     |
| 提交时间  | `createdAt`                                      | 已实现     |                                   |
| 评测诉求  | 可信/数据安全：`evaluationRequirement`；大模型：`demandSupplement` | 已实现 | |

| 已提交材料 | —                                                | 空态      | 无文件接口；有 `fileId` 仅进 configSummary |
| 报告下载  | —                                                | 空态      | 无推送 / 文件下载接口                      |
| 补充材料  | —                                                | toast   | 上传未开放，不再写 localStorage            |




## 状态映射（evaluation-task）


| 后端                       | 资源中心展示            |
| ------------------------ | ----------------- |
| `PENDING` / `QUEUED` / 空 | 待受理               |
| `RUNNING`                | 处理中               |
| `SUCCESS`                | 已推送（UI 文案「报告已交付」） |
| `FAILED`                 | 处理异常              |
| 已是中文工作流态                 | 透传                |


可信 / 数据安全的 `status` 为自由字符串，与管理端写入一致时透传。

## 待确认事项



### Q1：`page` 是否按 `entity.userId` 过滤

- **现状：** 前端传 `entity: { userId }`；若后端忽略，会看到他人任务。
- **方案：** 1) 后端确认按 userId 过滤 2) 服务端强制取当前登录用户、忽略 body 3) 前端二次 filter（不可靠）
- **建议（仅建议）：** 方案 2
- **状态：** 待确认



### Q2：智能体安全评测

- **现状：** 无专用任务表；本轮列表**不包含**智能体任务。
- **方案：** 1) 沿用 `evaluation-task` + `type` 2) 新增专用表 3) 暂不展示
- **状态：** 待确认（当前方案 3）



### Q3：模型 API 配置是否改读 `depth-model`

- **现状：** **已选定方案 2 / 已实现** — 资源中心与创建弹窗均读 `GET /temp/depth-model/dropdown`。
- **状态：** 已实现



### Q4：消息通知

- **现状：** OpenAPI **无**通知接口；仍用 `workflowStore` localStorage。
- **方案：** 1) 等通知 API 2) 继续本地 3) 隐藏消息入口
- **状态：** 待确认（当前方案 2）



## 后端缺口


| 缺口能力        | 现状     | 前端临时策略        |
| ----------- | ------ | ------------- |
| 文件上传 / 补充材料 | 无      | toast「上传尚未开放」 |
| 报告推送 / 下载   | 无      | 报告区空态说明       |
| 通知消息        | 无      | 本地通知          |
| 智能体任务       | 无表     | 列表不展示         |
| 列表分页 UI     | 单次 200 | 同管理端          |




## 过时文案清理


| 文案位置          | 处理          | 说明         |
| ------------- | ----------- | ---------- |
| 列表副标题「5类正式产品」 | 改为已对接后端三类说明 | 智能体未接，避免误导 |
| 材料 / 报告空态     | 标明文件接口未接入   | 与实际上传暂缓一致  |




## 验收要点

- [x] Network：资源中心打开可见三类 `page`，body 含 `entity.userId`
- [x] 仅当前用户任务（若后端过滤生效）
- [x] 布局未改；补充材料点击仅 toast
- [x] 无附件 / 报告时为空态，未伪造下载
- [x] 模型配置、消息仍可为本地数据