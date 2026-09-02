# 玄鉴 React 项目模板规范迁移与业务代码整改方案

> 目标分支：`refactor/template-alignment`
>
> 基准项目：`SF-CHEN/react-ai-template`
>
> 当前项目：`SF-CHEN/kx_safe_team_react`

## 1. 改造目标

本次改造不以“把当前项目搬进模板”为目标，而是保留当前项目已经完成的产品页面、视觉样式、路由与业务能力，将 `react-ai-template` 中更适合 AI 协作和长期维护的工程规范逐步应用到当前项目。

核心原则：

1. **页面视觉完全以当前项目为准**：不主动修改现有 DOM 结构、className、颜色、间距、动画、响应式表现和组件视觉。
2. **真实接口优先**：已经存在且能覆盖当前业务语义的接口，页面必须使用真实接口。
3. **没有真实接口时允许继续使用假数据**：但 mock 必须有明确边界，集中放到 mock/data adapter 中，不能散落在页面 JSX 和事件处理器里。
4. **接口存在但能力不完整时不强接**：先判断接口字段是否真正覆盖页面当前交互；不匹配时保留 mock，并在代码与文档中记录缺失能力。
5. **不能用 mock 伪装真实接口成功**：例如真实接口调用失败后，不应偷偷写一份本地数据再显示为“后端创建成功”。如果该功能本身就是 mock 模式，则应从 mock service 完整模拟，而不是和真实数据混写。
6. **同一份正式业务数据只保留一个真实来源**：正式任务、模型、报告、用户资料等一旦已有后端来源，不再同时使用 localStorage/workflowStore 作为另一套正式数据源。
7. **渐进式迁移**：先修业务正确性与数据边界，再做目录迁移、TanStack Query、Zustand、strict TypeScript 等工程升级。

---

## 2. 数据源判定规则

每个页面功能在整改前先归入以下四类之一。

### A. 已有完整真实接口

条件：

- 已有后端接口；
- 请求/返回字段能覆盖当前页面真实业务；
- 能完成创建、查询、更新或删除所需闭环。

处理：

- 使用真实 API；
- 页面不再维护重复 mock 数据；
- 服务端状态后续统一交给 TanStack Query；
- 页面仅保留筛选、弹窗开关等局部 UI state。

### B. 已有接口，但与当前 UI 业务不完全匹配

例如接口只接受 `fileId + evaluationRequirement`，而当前 UI 是“模型 + 算法指标 + API 接入配置”。

处理：

- 不因为“接口名字看起来类似”就强行接入；
- 在本方案的接口缺口清单中记录缺失字段；
- 当前页面可以继续走 mock；
- 等后端契约确认后再切真实接口。

### C. 完全没有接口

处理：

- 保留假数据和模拟交互；
- 假数据放在 `src/mocks/**` 或页面私有 `*.mock.ts`；
- 页面通过 mock service / adapter 获取数据，避免 JSX 内写大段业务假数据；
- 将来有接口时只替换 data source，不改页面视觉。

### D. 纯展示 / 官网演示区域

例如能力介绍、场景示意图、演示雷达图、行业 mock dashboard。

处理：

- 可以长期保留静态数据；
- 静态数据应与真实任务、真实报告、真实用户数据明显分层；
- 不需要为了“全接口化”把营销展示内容也改成请求后端。

---

## 3. 当前项目已发现的重点问题

### P0-1 `TaskDetailNew` 真实任务与假结果混在一个页面

当前任务本身来自 `UserContext.myTasks`，评测问答、风险、系统环境等结果使用硬编码数据。

整改目标：

- 保留当前页面样式；
- 将 `QA_SAMPLES`、环境信息、统计数据移动到 `src/mocks/evaluation/` 或页面私有 mock 文件；
- 如果后端后续提供真实评测结果详情接口，新增 adapter 将真实结果转换为同一个 ViewModel；
- 页面只消费 `TaskDetailViewModel`，不关心数据来自真实 API 还是 mock。

建议结构：

```text
src/pages/TaskDetail/
├── index.tsx
├── taskDetail.types.ts
├── taskDetail.mapper.ts
└── taskDetail.mock.ts
```

当前阶段如果没有结果详情接口，则继续使用 mock，不删除现有展示效果。

### P0-2 `DeepModelEval` 创建成功逻辑需要重新判定接口能力

项目中已经存在 `model-trust-evaluation-task` 接口，但当前 DTO 主要是：

- `userId`
- `fileId`
- `evaluationRequirement`
- `status`
- `emailStatus`

而当前 `DeepModelEval` UI 包含：

- 目标模型；
- 白盒 / 黑盒；
- 多组评测指标；
- API 接入模型；
- 邮箱；
- 配置文件等。

两者业务字段当前并不完全一致，因此不能直接为了“去 mock”强接该接口。

整改策略：

1. 先把当前提交逻辑抽到 `deepModelEval.service.ts`；
2. 在 service 中明确当前实现为 mock；
3. 不在页面组件中直接构造 `Date.now()` 本地任务；
4. 后端接口补齐模型/指标等字段后，只替换 service；
5. UI 不改。

### P0-3 正式任务存在多套数据源

当前同时存在：

- 后端评测任务 / 任务总表；
- `UserContext.myTasks`；
- localStorage workspace；
- `workflowStore`。

整改原则：

- 后端已存在的正式任务：以后端为唯一数据源；
- `workflowStore` 仅保留真正没有接口的模拟工作流；
- mock 任务与正式任务不能混成同一个持久化列表；
- ResourceCenter / Admin / TaskDetail 最终统一围绕任务总表和详情 API。

### P0-4 注册登录账号规则需要和后端保持一致

当前注册页面允许“手机号或邮箱”，但注册 API 实际只提交 `username + password`；邮箱注册时页面会将 `xxx@example.com` 截成 `xxx` 作为 username，而登录又直接把用户输入的完整邮箱作为 username 提交。

整改前必须确认后端真实规则：

- 如果后端只支持 username：前端不能继续宣称支持邮箱直接登录；
- 如果产品必须支持邮箱登录：后端需要提供 account/email 登录能力；
- 在后端规则未确认前，不通过前端字符串截断制造“伪邮箱账号”。

### P0-5 忘记密码当前属于 mock 功能

当前没有重置申请真实接口，但页面会显示“申请已提交”。

按用户要求，本功能可以继续保留 mock，但必须：

- 抽到 mock service；
- 不与真实用户 API 混写；
- 后续出现真实接口时替换 data source。

### P1-1 `TaskCreationModal` 模型保存失败后仍写入本地模型

当前 `addDepthModel()` 失败会被吞掉，但随后仍执行本地 `addModel()`。

应调整为：

- 保存后端成功：才加入真实“我的模型”；
- 后端保存失败但允许以 CUSTOM 创建任务：只用于当前任务，不写入正式模型列表；
- 避免刷新后模型消失造成数据不一致。

### P1-2 ResourceCenter 手写了大量请求状态与竞态控制

当前页面自行维护：

- loading；
- request sequence；
- total；
- 列表；
- overview；
- models loading；
- 多组 useEffect。

后续引入 TanStack Query 后：

- Query 管服务端状态、请求去重、缓存、错误和失效；
- 页面仅保留 page/pageSize/search/product/status 等 UI 查询条件。

### P1-3 API 层存在手写请求去重 / 失败冷却

`evaluationTaskMaster.ts` 当前存在 `pageInflight`、`pageFailAt`、4 秒失败冷却。

后续由 TanStack Query 负责服务端缓存后应删除该逻辑，避免用户点击“重试”时 4 秒内根本没有再次访问服务器。

### P1-4 Axios client 重复创建

当前大量 API 函数都会调用 `createTempClient()`，每次创建 axios instance 并注册 interceptor。

第一批整改先保持调用方式不变，但让相同 timeout 的 client 复用，避免重复创建 interceptor；后续再逐步统一为命名 client。

### P1-5 API DTO 需要拆 Input / Response

例如 `EvaluationTask` 当前大量字段都是可选，既作为创建输入又作为返回类型，类型约束过弱。

后续逐模块拆分：

```ts
CreateEvaluationTaskInput
EvaluationTask
UpdateEvaluationTaskInput
EvaluationTaskQuery
```

先从修改频率最高的 evaluation / model / auth 模块开始。

---

## 4. 页面整改方法

每个业务页面按以下顺序处理，禁止一上来大规模拆组件。

### Step 1：确认页面现状

记录：

- 页面路由；
- 真实 API；
- mock 数据；
- localStorage/workflowStore；
- 表单提交；
- loading/error/empty；
- 跳转；
- 下载/上传；
- 是否有假成功按钮。

### Step 2：建立数据源表

示例：

| 功能 | 当前来源 | 是否有真实接口 | 本轮策略 |
|---|---|---:|---|
| 任务列表 | 后端总表 | 是 | 保留真实 API |
| 任务结果详情 | QA_SAMPLES | 否/未发现 | mock service |
| 管理员交付 | 后端 | 是 | 保留真实 API |
| 忘记密码申请 | 本地 state | 否 | mock service |

### Step 3：先抽数据，再拆 UI

优先抽：

- API service；
- mapper；
- mock；
- query；
- form schema / submit handler。

视觉 JSX 在第一轮尽量原样保留。

### Step 4：确认稳定后再拆大页面

只拆真正有独立职责的区域，例如：

```text
DeepModelEval/
├── index.tsx
├── DeepModelTaskModal.tsx
├── deepModelEval.mock.ts
└── deepModelEval.types.ts
```

不为了目录完整强制创建 `components/hooks/query/schema/types/constants/utils` 全家桶。

---

## 5. 最终工程结构

```text
src/
├── api/
│   ├── request.ts
│   ├── auth.ts
│   ├── evaluation/
│   ├── model/
│   └── ...
├── app/
│   ├── App.tsx
│   ├── AppProviders.tsx
│   ├── ErrorBoundary.tsx
│   ├── router.tsx
│   ├── routes.tsx
│   └── guards/
├── pages/
├── components/
│   ├── ui/
│   ├── common/
│   └── charts/
├── layouts/
├── hooks/
├── store/
├── mocks/
│   ├── auth/
│   └── evaluation/
├── styles/
├── types/
└── utils/
```

`newUI/` 继续保留为只读视觉参考，不作为运行时业务数据源。

---

## 6. Mock 代码规范

### 允许

```ts
export async function getMockTaskDetail(id: string): Promise<TaskDetailViewModel> {
  return MOCK_TASK_DETAIL[id] ?? createDefaultMockTaskDetail(id);
}
```

页面：

```ts
const detail = await getMockTaskDetail(taskId);
```

### 不允许

在页面事件中直接制造“真实成功”：

```ts
setTasks(prev => [{ id: Date.now(), status: '评测中' }, ...prev]);
setSuccess(true);
```

尤其当同一个产品已经存在真实任务中心时，这种写法容易制造两套数据。

### Mock 命名

优先：

```text
*.mock.ts
src/mocks/**
mockXxxService
getMockXxx
```

避免使用看起来像真实 API 的名字隐藏 mock 行为。

---

## 7. 实施批次

### Batch 1：零样式风险基础整改

- [x] 创建独立整改分支；
- [x] 增加本方案文档；
- [x] 优化 temp axios client，避免相同 timeout 重复创建实例和 interceptor；
- [ ] 建立 `src/mocks/` 边界；
- [ ] 梳理所有页面真实接口完成度。

### Batch 2：任务链路

按顺序：

1. ResourceCenter；
2. TaskDetail / TaskDetailNew；
3. TaskCreationModal；
4. DeepModelEval；
5. AdminWorkflowWorkbench / AdminDashboard。

目标：

- 正式任务统一后端；
- 没有结果 API 的区域继续 mock；
- mock 与正式数据彻底分层。

### Batch 3：认证与用户

- Login；
- Register；
- Forgot Password；
- UserContext；
- 用户资料修改；
- 模型列表。

目标：确认账号真实规则并减少 localStorage 正式数据。

### Batch 4：数据层模板化

- 接入 TanStack Query；
- API request 统一；
- DTO Input/Response 拆分；
- 状态 mapper 集中；
- 页面删除手写 request sequence / cache。

### Batch 5：工程目录迁移

在业务数据边界稳定之后再做：

- `src/app/pages` → `src/pages`；
- `src/app/components/ui` → `src/components/ui`；
- `Layout` → `src/layouts`；
- `AppProviders`；
- skills / AGENTS 对齐；
- ESLint / Prettier / knip；
- strict TS 分阶段开启。

### Batch 6：依赖升级

最后再考虑：

- React 18 → 19；
- Vite 6 → 8；
- 其他基础依赖升级。

**暂不执行 Radix → Base UI 替换**，因为当前要求页面样式完全一致。

---

## 8. 每次提交验收标准

每批代码改动必须满足：

1. 不主动改变页面视觉；
2. 不改变现有 HashRouter URL；
3. 有真实接口的功能不能退化为 mock；
4. 没有接口的功能允许 mock，但 mock 来源清晰；
5. 不在真实 API 失败后偷偷写本地成功数据；
6. 页面不直接拼装复杂后端协议，使用 API/service/mapper；
7. 不为“架构完整”提前创建无用层；
8. 重要非直观逻辑用中文 Why 注释；
9. 一个提交只处理一个可说明的逻辑改动；
10. 在用户未明确要求前，不主动进行大版本 React/Vite/UI 库升级。

---

## 9. 本分支下一步

下一步从“任务链路”开始逐页面整改：

1. 建立 `src/mocks/evaluation`；
2. 把 TaskDetailNew 的固定结果迁出页面；
3. 判断 TaskDetail 可用的真实详情接口范围；
4. 修 TaskCreationModal 的“模型后端保存失败仍写本地”问题；
5. 将 DeepModelEval 的模拟提交抽离页面；
6. 保持当前 UI 完全不变。
