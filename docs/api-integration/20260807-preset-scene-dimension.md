# 对接纪要：预制场景 / 评测维度（独立表）

- **日期：** 2026-08-07
- **范围：** 管理后台「字段管理」+ 前台创建任务预置场景；由 `sys-dict` 迁至独立资源
- **相关路径：**
  - `src/api/presetScene/`
  - `src/api/evaluationDimension/`
  - `src/app/components/AdminFieldDictPanel.tsx`
  - `src/app/components/TaskCreationModal.tsx`
  - `src/api/types.ts`
- **OpenAPI：** `src/api/docs/api.json` → `/temp/preset-scene/*`、`/temp/evaluation-dimension/*`
- **UI 改动：** 否（仅字段映射与必选 query；表头文案随新字段微调；去掉已无后端字段的编码/图标/备注录入）
- **关联旧纪要：** [20260807-field-dict.md](./20260807-field-dict.md)（sys-dict 时代）

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-07 | 迁至 `preset-scene` / `evaluation-dimension`；`presetScene`/`dimensionDropdown` 必传 `evaluationTaskType` |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 前台预置场景 | `GET /temp/preset-scene/presetScene?evaluationTaskType=` | `fetchPresetScenes` | llm→`PERFORMANCE`；安全→`SAFETY` |
| 维度下拉树 | `GET /temp/evaluation-dimension/dimensionDropdown?evaluationTaskType=` | `fetchDimensionDropdown` / `fetchDimensionOptions` | 场景勾子维度 |
| 场景分页 | `POST /temp/preset-scene/page` | `fetchPresetScenePage` | 管理端列表 |
| 场景增删改 | `add` / `update` / `deleteOne` | `addPresetScene` 等 | |
| 维度分页 | `POST /temp/evaluation-dimension/page` | `fetchEvaluationDimensionPage` | 管理端列表 |
| 维度增删改 | `add` / `update` / `deleteOne` | `addEvaluationDimension` 等 | `parentId` 默认 `0`（不做上级 UI） |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 场景卡片 | `preset-scene/presetScene` | 已接 | `TaskCreationModal` |
| 场景子维度多选 | `evaluation-dimension/dimensionDropdown` | 已接 | **禁止 page 凑选项** |
| 列表按任务类型 | `page` + `entity.evaluationTaskType` | 已接 | 管理端 PERFORMANCE / SAFETY 筛选 |

## 字段映射

| UI / 能力 | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 名称 | `name` | 已实现 | |
| 子维度集合（场景） | `dimensionIds` | 已实现 | 原 `SysDict.value`；逗号分隔 |
| 排序 | `sortOrder` | 已实现 | 可选 |
| 任务类型 | `evaluationTaskType` | 已实现 | `PERFORMANCE` \| `SAFETY`；管理端筛选 + 提交 |
| 父维度 | `parentId` | 已实现（默认 0） | 不做上级选择 UI（与旧约定一致） |
| 编码 value（维度） | — | 不做 | 新表无此字段 |
| 图标 icon | — | 不做 | 新表无此字段；前台场景图标仍本地轮换 |
| 备注 remark | — | 不做 | 新表无此字段 |
| 场景-维度 pid 同步 | — | 不做 | 关系改由场景 `dimensionIds` 承载，不再改维度 `parentId` |

## 待确认事项

### Q1：`page` 的 `entity.name` 是否模糊搜索

- **现状：** 前端传 `entity.name`；若后端等值匹配，体验偏严。
- **方案：** 1) 后端模糊 2) 前端本地过滤 3) 去掉搜索
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（沿用旧纪要）

### Q2：维度树 `parentId` 是否开放管理端配置

- **现状：** 新增维度固定 `parentId=0`；下拉树依赖后端已有父子。
- **方案：** 1) 继续顶级-only 2) 恢复上级选择 UI 3) 仅允许编辑时改 parentId
- **建议（仅建议）：** 方案 1，除非产品要多层维度
- **状态：** 待确认

### Q3：多模态安全评测用 `SAFETY` 场景是否正确

- **现状：** `pageType !== 'llm'` 一律传 `SAFETY`（含多模态）。
- **方案：** 1) 维持 SAFETY 2) 多模态另增枚举 3) 后端忽略类型返回全量
- **建议（仅建议）：** 方案 1
- **状态：** 待确认

## 后端缺口

| 缺口能力 | 现状 | 前端临时策略 |
| --- | --- | --- |
| `PresetSceneVo` 带 icon | 无 | 前台本地图标轮换 |
| 批量删除 UI | 有 `batchDel` | 暂单条删除 |

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 表单「value / 编码 / 图标 / 备注」 | 已改为新字段文案 | 与新表结构一致 |
| 旧 `sys-dict` 路径 | 前台/管理端不再请求 | OpenAPI 仍可能保留旧路径，勿再用 |

## 验收要点

- [ ] Network：管理端 `#/admin/fields` 可见 `preset-scene/page` 或 `evaluation-dimension/page`，body 含 `evaluationTaskType`
- [ ] Network：创建任务弹窗可见 `GET .../preset-scene/presetScene?evaluationTaskType=PERFORMANCE|SAFETY`
- [ ] 场景勾子维度走 `dimensionDropdown`，不走 `page`
- [ ] 不再请求 `/temp/sys-dict/*`（字段管理相关）
- [ ] 布局骨架未重做；样式未借机换皮
