# 对接纪要：字段管理（维度 / 预设场景）

> **已迁移：** 2026-08-07 起维度/场景改走独立表，见 **[20260807-preset-scene-dimension.md](./20260807-preset-scene-dimension.md)**。下文保留 sys-dict 时代记录，勿再按此接线。

- **日期：** 2026-08-07
- **范围：** 管理后台「字段管理」；对接 `sys-dict` CRUD（含文档新增 `remark` / `icon`）；前台创建任务继续消费 `presetScene` / `dimensionDropdown`
- **相关路径：**
  - `src/app/pages/AdminDashboard.tsx`（菜单 `#/admin/fields`）
  - `src/app/components/AdminFieldDictPanel.tsx`
  - `src/api/dict/sysDict.ts`
  - `src/api/types.ts`（`SysDict`）
- **OpenAPI：** `src/api/docs/api.json`（`SysDict`、`/temp/sys-dict/`*）
- **UI 改动：** 表单/列表补齐文档新字段列（不重做布局）

## 变更记录


| 日期         | 说明                                               |
| ---------- | ------------------------------------------------ |
| 2026-08-07 | **迁移：** 改接 `/temp/preset-scene`、`/temp/evaluation-dimension`，详见新纪要 |
| 2026-08-07 | 初稿；补齐 dict CRUD；后台字段管理页；场景子维度挂 `pid`             |
| 2026-08-07 | 确认：`value` 为编码且必填；场景-维度 `pid` 约定保持方案 1           |
| 2026-08-07 | 文档更新后重对接：`SysDict` 新增 `remark`、`icon`；类型/表单/列表已接 |
| 2026-08-07 | `icon` 定为 Lucide 名；新增 `IconPicker` 选择组件          |
| 2026-08-07 | 预设场景 `value` = 子维度 id 集合（逗号分隔）；维度仍为编码            |
| 2026-08-07 | 子维度选项改 `dimensionDropdown`（`fetchDimensionOptions`），禁用 page 凑选项 |
| 2026-08-07 | 评测维度去掉「上级」选择与列表列 |


## 已对接（可联调）


| 能力        | 接口                                     | 前端封装                               | 备注                                           |
| --------- | -------------------------------------- | ---------------------------------- | -------------------------------------------- |
| 字典分页      | `POST /temp/sys-dict/page`             | `pageSysDict` / `fetchSysDictPage` | `entity.type` 区分维度/场景；**仅列表**               |
| 新增        | `POST /temp/sys-dict/add`              | `addSysDict`                       | 含 `remark` / `icon`                          |
| 修改        | `PUT /temp/sys-dict/update`            | `updateSysDict`                    | 更新时显式回传 `remark` / `icon`（可空串清空）             |
| 详情        | `GET /temp/sys-dict/getDetailById`     | `getSysDictById`                   | 已封装，面板暂未单独用                                  |
| 删除        | `DELETE /temp/sys-dict/deleteOne`      | `deleteSysDict`                    |                                              |
| 批量删除      | `DELETE /temp/sys-dict/batchDel`       | `batchDeleteSysDict`               | 已封装，面板暂未用                                    |
| 预置场景（前台）  | `GET /temp/sys-dict/presetScene`       | `fetchPresetScenes`                | `TaskCreationModal` 已接；VO 仍无 `icon`/`remark` |
| 维度选项（管理端） | `GET /temp/sys-dict/dimensionDropdown` | `fetchDimensionOptions`            | 场景勾子维度；展平树节点；**维度表单不选上级**              |
| 维度下拉树（前台） | `GET /temp/sys-dict/dimensionDropdown` | `fetchDimensionDropdown`           | 封装保留；创建页原型无自定义维度区                            |


## 关联接口清单


| 依赖能力    | 接口                                                      | 状态     | 说明                           |
| ------- | ------------------------------------------------------- | ------ | ---------------------------- |
| 列表按类型过滤 | `page` + `entity.type`                                  | 已接     | `DIMENSION` / `PRESET_SCENE` |
| 场景勾选子维度 | `GET /temp/sys-dict/dimensionDropdown`                  | 已接     | `fetchDimensionOptions`；**禁止 page 凑选项** |
| 前台场景卡片  | `presetScene`                                           | 已接     | 管理端增删改后前台刷新可见                |
| 前台维度树   | `dimensionDropdown`                                     | 已接（封装） | 本轮创建页不展示多选                   |


## 字段映射


| UI 列 / 能力  | 接口字段                                 | 状态                 | 说明                                      |
| ---------- | ------------------------------------ | ------------------ | --------------------------------------- |
| 名称         | `name`                               | 已确认                | 必填                                      |
| 编码 / 子维度集合 | `value`                              | 已实现                | **维度**：编码必填；**预设场景**：子维度 id 集合如 `1,2,3` |
| 图标         | `icon`                               | 已选定：Lucide 名 / 已实现 | **仅预设场景**；维度表单不展示                       |
| 备注         | `remark`                             | 已实现                | 可选                                      |
| 类型 Tab     | `type`                               | 已确认                | `DIMENSION` / `PRESET_SCENE`            |
| 上级（维度）     | `pid`                                | 不做 UI              | 维度表单不选上级；仅场景勾选子维度时后台同步 `pid`           |
| 场景下维度      | `PRESET_SCENE.value` + 维度 `pid=场景id` | 已实现                | 表单多选写 value，并同步 pid                     |
| 创建时间       | `createdAt`                          | 已确认                |                                         |


## 待确认事项（不阻塞其余对接）

### Q1：`value` 字段用途

- **状态：** 已选定 / 已实现 — 维度=编码；预设场景=子维度 id 集合（逗号分隔）

### Q2：场景与维度的父子约定

- **状态：** 已选定：方案 1 / 已实现

### Q3：`page` 的 `entity.name` 是否模糊搜索

- **现状：** 前端传 `entity.name` 做查询；若后端等值匹配，体验偏严。
- **方案：** 1) 后端模糊 2) 前端本地过滤 3) 去掉搜索
- **建议（仅建议）：** 方案 1
- **状态：** 待确认

### Q4：`icon` 字段格式

- **现状：** 管理端用 `IconPicker` 存 **Lucide 组件名**（如 `Shield`）。`PresetSceneVo` 尚未返回 `icon`，前台创建页仍本地轮换图标。
- **状态：** 已选定：方案 1（Lucide 名）/ 管理端已实现；前台待 VO 带字段后再接

## 后端缺口


| 缺口能力                          | 现状           | 建议         | 前端临时策略     |
| ----------------------------- | ------------ | ---------- | ---------- |
| `PresetSceneVo` 带 icon/remark | 无            | VO 增字段     | 前台继续本地图标轮换 |
| 场景-维度多对多                      | 仅单 `pid`     | 若需共用维度用关联表 | 单父挂接       |
| 批量删除 UI                       | 有 `batchDel` | —          | 暂单条删除      |


## 过时文案清理


| 文案位置 | 处理  | 说明  |
| ---- | --- | --- |
| —    | 无   |     |


## 验收要点

- [x] `#/admin/fields` 列表可见「图标」「备注」列
- [x] 新增/编辑提交 body 含 `remark`、`icon`（可空）
- [x] Network：`POST /temp/sys-dict/page` + add/update/deleteOne
- [x] 预设场景「管理维度」仍按 `pid` 挂子维度
- [x] 前台创建页布局未改；场景图标仍本地轮换（VO 未带 icon）