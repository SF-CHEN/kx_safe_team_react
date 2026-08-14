# 对接纪要：管理后台 · 运营总览

- **日期：** 2026-08-14
- **范围：** 管理后台「运营总览」四张 KPI 卡 + 任务状态概览部分计数
- **相关路径：**
  - `src/app/pages/AdminDashboard.tsx`
  - `src/api/overview/operationalOverview.ts`
- **OpenAPI：** `GET /temp/overview/operationalOverview` → `OverviewVo`
- **UI 改动：** 仅第三张卡标题由「近 7 天活跃」改为「近 7 天新增任务」（对齐后端字段，见 Q1）
- **关联：** [20260814-admin-task-ops.md](./20260814-admin-task-ops.md)

## 变更记录

| 日期 | 说明 |
| --- | --- |
| 2026-08-14 | 接入 `operationalOverview`；最近任务 / 已交付·已终止拆分仍走任务列表 |
| 2026-08-14 | 侧栏徽章改用 OverviewVo；去掉 `sys-user/page` 200；最近任务 `pageSize=10` |

## 已对接（可联调）

| 能力 | 接口 | 前端封装 | 备注 |
| --- | --- | --- | --- |
| 运营 KPI / 侧栏徽章 | `GET /temp/overview/operationalOverview` | `fetchOperationalOverview` | 用户数=`totalUserCount`；进行中=`processingTaskCount` |
| 最近任务 | `POST .../evaluation-task-master/page` | `fetchAdminEvaluationTasks({ pageSize: 10 })` | 仅总览明细，不再拉 200 |

## 关联接口清单

| 依赖能力 | 接口 | 状态 | 说明 |
| --- | --- | --- | --- |
| 总览统计 | `operationalOverview` | 已接 | 主接口 + 侧栏数字 |
| 最近任务 | `evaluation-task-master/page` pageSize=10 | 已接 | OverviewVo 无任务明细 |
| 侧栏用户数 | ~~`sys-user/page`~~ | 已停用 | 改用 `totalUserCount` |
| 活跃用户 | — | 无接口 | 见 Q1 |

## 字段映射

| UI | 接口字段 | 状态 | 说明 |
| --- | --- | --- | --- |
| 平台注册用户 | `totalUserCount` | 已实现 | 副文案 `weeklyNewUserCount` |
| 进行中任务 | `processingTaskCount` | 已实现 | 副文案 `inProcessingTaskCount` |
| 近 7 天新增任务 | `recent7DaysNewTaskCount` | 已实现 | 原「近 7 天活跃」无对应字段 |
| 累计完成交付 | `totalDeliveredCount` | 已实现 | 后端语义为已交付+已终止；副文案 `weeklyDeliveredCount` |
| 状态概览·处理中 | `inProcessingTaskCount` | 已实现 | |
| 状态概览·待用户补充 | `processingTaskCount - inProcessingTaskCount` | 已实现 | 推导 |
| 状态概览·已交付 / 已终止 | 任务列表聚合 | 已实现 | OverviewVo 无法拆分 |
| Sparkline | — | 列表样本 | 用户卡无按日序列（已停拉用户 page）；任务卡用最近 10 条示意 |

## 待确认事项

### Q1：第三张卡原「近 7 天活跃」

- **现状：** OverviewVo 无活跃用户字段，仅有 `recent7DaysNewTaskCount`。
- **方案：**
  1. 改文案为「近 7 天新增任务」并对应该字段（本轮已做）
  2. 等后端增加活跃用户字段，恢复原标题
  3. 继续用 localStorage `getPlatformActivities` 假活跃
- **建议（仅建议）：** 方案 1
- **状态：** 已选定：方案 1

### Q2：`totalDeliveredCount` 含已终止

- **现状：** 文档写「已交付+已终止」，UI 标题仍为「累计完成交付」。
- **方案：** 1) 维持标题、按接口数字 2) 改标题为「累计完结」 3) 后端拆成已交付/已终止两个字段
- **建议（仅建议）：** 方案 1
- **状态：** 待确认（本轮按方案 1）

### Q3：已交付 / 已终止拆分

- **现状：** 状态概览后两格仍用最近 10 条列表聚合，可能与 KPI 不一致。
- **方案：** 1) 维持 2) OverviewVo 增加分项计数
- **状态：** 待确认

## 过时文案清理

| 文案位置 | 处理 | 说明 |
| --- | --- | --- |
| 「近 7 天活跃」/「登录、体验或提交任务」 | 已改为「近 7 天新增任务」 | 对齐 OverviewVo |

## 验收要点

- [ ] 打开管理后台 Network：**不应**出现侧栏用途的 `sys-user/page` pageSize=200
- [ ] 可见 `GET /temp/overview/operationalOverview`；侧栏用户/进行中徽章与 OverviewVo 一致
- [ ] 最近任务请求 `evaluation-task-master/page` 且 `pageSize=10`
- [ ] 布局未改；第三张卡标题已按 Q1 对齐
