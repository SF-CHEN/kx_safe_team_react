# 对接纪要：大模型性能 / 安全评测（evaluation-task）

- **日期：** 2026-08-07
- **范围：** 大模型性能评测、大模型安全评测（用户创建 + 管理端/资源中心列表映射）
- **相关路径：**
  - `src/app/components/TaskCreationModal.tsx`
  - `src/app/pages/LLMEvaluation.tsx`、`SafetyEvaluation.tsx`
  - `src/api/evaluation/evaluationTask.ts`、`myList.ts`、`adminList.ts`、`types.ts`
- **OpenAPI：** `src/api/docs/api.json` → `/temp/evaluation-task/*`
- **UI 改动：** 否
- **关联：**
  - 场景/维度：[20260807-preset-scene-dimension.md](./20260807-preset-scene-dimension.md)
  - 模型可信/数据安全：[20260807-eval-tasks.md](./20260807-eval-tasks.md)

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-07 | **重对接创建任务：** `type`→`PERFORMANCE`/`SAFETY`；补充需求→`demandSupplement`；场景走 `preset-scene` |
| 2026-08-07 | 迁场景/维度：`presetScene`→`/temp/preset-scene/presetScene`（必传 `evaluationTaskType`） |
| 2026-08-07 | 初稿；创建任务对接 `add`；管理端 `page` 合并；无 update |
| 2026-08-07 | 接入 `presetScene` / `dimensionDropdown` / `depth-model/dropdown`；提交写入维度与模型字段 |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 新增评测任务 | `POST /temp/evaluation-task/add` | `addEvaluationTask` | `TaskCreationModal` |
| 预置场景 | `GET /temp/preset-scene/presetScene` | `fetchPresetScenes` | llm→`PERFORMANCE`；安全→`SAFETY` |
| 模型下拉 | `GET /temp/depth-model/dropdown` | `fetchDepthModelDropdown` | 「我的模型」 |
| 保存自定义模型 | `POST /temp/depth-model/add` | `addDepthModel` | 成功后优先 `USER_MODEL`+`modelId` |
| 维度下拉树 | `GET /temp/evaluation-dimension/dimensionDropdown` | `fetchDimensionDropdown` | **本页未用**（无自定义维度 UI） |
| 分页查询 | `POST /temp/evaluation-task/page` | `pageEvaluationTasks` | 管理端 / 资源中心 |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 场景卡片 | `preset-scene/presetScene` | 已接 | 与任务 `type` 同用 `PERFORMANCE`/`SAFETY` |
| 我的模型 | `depth-model/dropdown` + `add` | 已接 | |
| 自定义维度多选 | `dimensionDropdown` | 不做 | 原型无 UI |

## 字段映射（创建任务）

| UI | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 任务名称 | `name` | 已实现 | |
| 产品线（性能/安全页） | `type` | 已实现 | `PERFORMANCE` / `SAFETY`（**不再传中文**） |
| 安全页·多模态选项 | `type=SAFETY` | 已实现 | 枚举无独立多模态值；本地展示仍可标多模态 |
| 自定义模型 | `CUSTOM` + `customModelConfig`；优先 `add` 后改 `USER_MODEL` | 已实现 | |
| 下拉模型 | `BUILT_IN`/`USER_MODEL` + `modelId` | 已实现 | |
| 预设场景卡片 | `PRESET_SCENE` + `presumedSceneDimensionId` | 已实现 | `sceneId` |
| 补充测试需求 | `demandSupplement` | 已实现 | 有内容才传 |
| 自定义维度勾选 | `CUSTOM` + `customDimensionIds` | **不做** | 原型无此 UI |
| 邮件通知 | `needSendEmail` + `email` | 已实现 | |
| 当前用户 | `userId` | 已实现 | |

## 待确认事项

### Q1：`type` 枚举取值

- **现状：** OpenAPI 明确为 `PERFORMANCE` \| `SAFETY`；前端已按此提交。
- **状态：** 已选定 / 已实现

### Q2：`customDimensionIds` / 自定义评测维度 UI

- **状态：** 不做（对齐原型）

### Q3：补充测试需求文本

- **现状：** 已映射 `demandSupplement`。
- **状态：** 已实现

### Q4：`customModelConfig` JSON 键名

- **现状：** `{ name, baseUrl, apiKey }`
- **状态：** 待确认（若仅走 USER_MODEL 则较少用到）

### Q5：多模态是否单独 type

- **现状：** 枚举仅 PERFORMANCE/SAFETY；多模态提交 `SAFETY`。
- **方案：** 1) 维持 SAFETY 2) 后端增枚举 3) 用 `demandSupplement` 标注
- **建议（仅建议）：** 方案 1
- **状态：** 待确认

## 后端缺口

| 缺口能力 | 现状 | 前端临时策略 |
| --- | --- | --- |
| 修改评测任务 / 改状态 | **无** `PUT .../evaluation-task/update` | 管理端 toast |
| 列表分页 UI | 单次拉 200 | 同其他评测 |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 「补充需求仅本地备注」 | 已不适用 | 字段已入库，旁注保持「可与预设场景同时填写」 |
| 创建任务传中文 `type` | 已改为枚举码 | |

## 验收要点

- [ ] 打开创建弹窗 Network：`GET .../preset-scene/presetScene?evaluationTaskType=PERFORMANCE|SAFETY` + `depth-model/dropdown`
- [ ] 提交 body：`type` 为 `PERFORMANCE` 或 `SAFETY`（非中文）
- [ ] 填写补充需求时 body 含 `demandSupplement`
- [ ] 选预设场景：`evaluationDimensionType=PRESET_SCENE` + `presumedSceneDimensionId`
- [ ] 无「自定义评测维度」勾选区
- [ ] 样式布局未改
