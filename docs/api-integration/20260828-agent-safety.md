# 对接纪要：智能体安全评测任务

- **日期：** 2026-08-28
- **范围：** 智能体安全评测创建（工程文件 + 评测诉求）、资源中心/管理端总表产品类型 `AGENT_SAFETY`
- **相关路径：**
  - `src/app/pages/AgentSafety.tsx`
  - `src/app/components/LightweightUploadTaskModal.tsx`
  - `src/app/pages/ResourceCenter.tsx`
  - `src/api/evaluation/agentSafety.ts`（本轮新增）
  - `src/api/evaluation/evaluationTaskMaster.ts`、`myList.ts`
- **OpenAPI：** `src/api/docs/api.json` → `/temp/agent-safety-evaluation-task/*`
- **UI 改动：** 否（仅数据源；删除「创建接口尚未开放」拦截）
- **关联：**
  - [20260807-eval-tasks.md](./20260807-eval-tasks.md)（可信 / 数据安全同形态创建）
  - [20260813-evaluation-task-master.md](./20260813-evaluation-task-master.md)（总表列表；旧文「智能体无枚举」已过时）

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-28 | 初稿；创建走 `add` + `sys-file/upload`；总表映射 `AGENT_SAFETY` |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 文件上传 | `POST /temp/sys-file/upload` | `uploadSysFile` | 创建前置，复用已有封装 |
| 新增智能体安全评测任务 | `POST /temp/agent-safety-evaluation-task/add` | `addAgentSafetyEvaluationTask` | body：`userId` / `fileId` / `evaluationRequirement` |
| 资源中心筛选「智能体安全评测」 | `POST /temp/evaluation-task-master/page` | `fetchMyResourceTasks` | `entity.productType=AGENT_SAFETY` |
| 管理端产品标签 | 同上总表 | `mapMasterProductLabel` | `AGENT_SAFETY` → 智能体安全评测 |

分表 `page` / `getDetailById` / `update` / `deleteOne` / `batchDel` 已封装，管理端列表仍走总表，本轮 UI 未挂分表分页。

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 用户提交材料 | `POST /temp/sys-file/upload` | 已接 | DTO `fileId` 前置 |
| 资源中心 / 管理端列表 | `POST /temp/evaluation-task-master/page` | 已接 | 依赖后端 add 后写入总表且 `productType=AGENT_SAFETY` |
| 预置场景 / 维度下拉 | — | 无接口 | DTO 无场景、维度字段；创建页也无该选项 |
| 模型下拉 | — | 无接口 | DTO 无 `modelId`；创建页为本地工程文件，不是 API 模型 |
| 智能体类型 / 评测模块 | — | 无字段 | 见 Q1；未接到 `AgentEvalModal` |

> DTO 仅 `userId` / `fileId` / `evaluationRequirement` / `status` / `emailStatus`。OpenAPI 无对应 dropdown/dict。创建页与可信/数据安全同为「上传文件 + 评测诉求」。

## 字段映射

| UI 列 / 能力 | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 本地工程文件 | `fileId`（经 upload 返回 `SysFile.id`） | 已实现 | |
| 评测诉求 | `evaluationRequirement` | 已实现 | |
| 当前用户 | `userId` | 已实现 | |
| 任务状态（分表） | `status` | 透传 | 门户提交后本地展示「待受理」；列表以总表为准 |
| 资源中心产品 | 总表 `productType=AGENT_SAFETY` | 已实现 | |
| 被测对象 | 总表 `targetObject` | 已实现（空态 `—`） | 分表无模型名 |
| 智能体类型（单/多） | — | 不做 | 见 Q1 |
| 评测模块多选 | — | 不做 | 见 Q1 |
| Agent API / 我的模型 | — | 不做 | 见 Q1 |

## 待确认事项（不阻塞其余对接）

### Q1：`AgentEvalModal` 是否还要用？

- **现状：** `src/app/components/AgentEvalModal.tsx` 未被任何页面引用。产品页 `AgentSafety.tsx` 创建入口是 `LightweightUploadTaskModal`（文件 + 诉求）。分表 DTO 没有智能体类型、评测模块、API Base / Key、任务名称等字段。
- **影响：** 若产品仍希望「选模块 / 配 Agent API」提交，当前接口接不上。
- **方案：**
  1. 维持现状：只接上传弹窗（本轮）
  2. 后端扩展 DTO（类型、模块 id、自定义模型配置等）后再接 `AgentEvalModal`
  3. 允许改 UI，把 `AgentEvalModal` 改成上传表单（与现网入口重复）
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（本轮按方案 1，未改 `AgentEvalModal`）

### Q2：`add` 后总表是否自动出现 `AGENT_SAFETY` 行？

- **现状：** 可信 / 数据安全此前按「分表 add → 后端写总表」工作。智能体分表同样只有 `fileId`，无总表写入接口。
- **影响：** 资源中心 / 管理端筛「智能体安全评测」是否能看到刚提交的任务。
- **方案：**
  1. 后端 add 时同步总表（与可信/数据安全一致）
  2. 前端额外调总表接口（OpenAPI 无用户侧 create master）
  3. 仅分表落库，列表暂不可见
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（联调看总表 page 是否出现新任务）

### Q3：上传文件类型

- **现状：** `sys-file/upload` summary 写 zip/rar/7z/tar/csv/json/jsonl，最大 50MB；门户 `accept` 另含 yaml/yml/txt/md（未改 UI）。
- **方案：** 1) 后端放宽 2) 允许改 UI 收窄 accept 3) 维持现状，联调看拒收
- **建议（仅建议）：** 方案 1
- **状态：** 待确认

### Q4：分表 `status` / `emailStatus` 枚举

- **现状：** OpenAPI 写 PENDING/QUEUED/RUNNING/SUCCESS/FAILED；总表另有 PROCESSING 等。门户提交成功后本地写「待受理」，列表映射走总表。
- **状态：** 待确认（与可信/数据安全同一问，不阻塞）

## 后端缺口

| 缺口能力 | 现状 | 建议接口 / 字段 | 前端临时策略 |
| --- | --- | --- | --- |
| 智能体类型 / 评测模块 | DTO 无 | 扩展分表字段或配置 JSON | 不展示、不提交 |
| 用户侧创建总表 | 无独立接口 | 分表 add 时后端写入 master | 不擅自调 update 拼总表 |
| 报告独立文件 | 分表仅单一 `fileId` | 总表 `deliverFileId`（管理端已有交付） | 创建侧不涉及 |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| `LightweightUploadTaskModal`「创建接口尚未开放」 | 已删除 | 已接 `add` |
| `myList.ts`「智能体安全等尚无专用产品类型」 | 已删除 | 总表已有 `AGENT_SAFETY` |
| `AgentEvalModal` 本地提交成功 toast | 保留 | 组件未被引用，本轮未改 |

## 验收要点

- [ ] 登录后在 `/#/agent-safety` 打开创建弹窗，提交时 Network：先 `POST /temp/sys-file/upload`，再 `POST /temp/agent-safety-evaluation-task/add`，body 含 `fileId`、`evaluationRequirement`
- [ ] 不再出现「智能体安全评测创建接口尚未开放」
- [ ] 资源中心筛选「智能体安全评测」可见 `entity.productType=AGENT_SAFETY`（若 Q2 后端已写总表，列表应有新任务）
- [ ] 管理端产品筛选项「智能体安全评测」能匹配总表标签
- [ ] 页面布局 / className 未改
- [ ] 未把 `AgentEvalModal` 的模块/API 字段擅自写入 add body
