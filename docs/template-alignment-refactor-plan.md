# 玄鉴 React 模板化迁移执行计划

> 工作分支：`refactor/template-alignment`
>
> 唯一工程基准：`SF-CHEN/react-ai-template`
>
> 业务与视觉来源：`SF-CHEN/kx_safe_team_react`

## 1. 最终目标

本次不再以“修补旧项目结构”为目标，而是直接把当前项目实现成 `react-ai-template` 的工程形态：

- **工程结构、代码规范、数据层、状态管理、Skills、工具链：以 `react-ai-template` 为标准。**
- **现有业务、路由地址、页面 DOM、className、CSS、动画与视觉效果：以当前玄鉴项目为标准。**
- **已有并能覆盖业务的接口继续使用真实 API；没有接口或接口能力不足的功能继续使用 mock。**
- **mock 必须显式放在 `src/mocks` 或页面私有 `*.mock.ts`，不能伪装成真实后端成功。**

最终结果可以概括为：

```text
react-ai-template 的骨架
+
kx_safe_team_react 的完整业务
+
kx_safe_team_react 的现有视觉
```

## 2. 不变项

迁移过程中以下内容默认冻结：

1. `createHashRouter` 与当前 URL；不切 BrowserRouter。
2. 当前页面 className、inline style、全局 CSS、动画、响应式表现。
3. 当前 Radix/shadcn UI 源码；不强制切换 Base UI。
4. 当前 Vite 的 Figma asset resolver、代理、base、manualChunks、assetsInclude。
5. 已接通的真实 API、鉴权头、上传下载、管理员交付等真实业务能力。
6. `newUI/` 继续作为只读视觉参考，不作为运行时业务数据源。

## 3. 目标目录

```text
src/
├── api/                 # 请求基础设施、真实后端 API、DTO
├── app/                 # App、Provider、Hash Router、路由元数据、守卫
├── pages/               # 路由页面与页面私有代码
├── components/
│   ├── ui/              # 当前 shadcn/Radix 基础组件源码
│   ├── common/          # 跨页面通用组件
│   └── charts/          # 图表公共封装
├── layouts/             # 页面布局
├── hooks/               # 跨页面通用 Hook
├── store/               # Zustand 客户端全局状态
├── mocks/               # 没有后端能力的明确 mock
├── styles/              # 当前视觉样式，迁移期不改
├── types/               # 真正跨业务共享类型
└── utils/               # 通用纯函数
```

禁止重新建立 `features/` / `modules/` 作为默认业务根目录。

## 4. 数据源规则

### 真实接口完整

```text
src/api
  ↓
TanStack Query
  ↓
page
```

服务端数据不再复制到 Zustand / UserContext / localStorage。

### 没有接口或接口覆盖不足

```text
src/mocks 或 page/*.mock.ts
  ↓
mock service / adapter
  ↓
page
```

后端以后补齐时，只替换数据源，页面视觉不重写。

### 全局客户端状态

使用 Zustand，例如会话客户端状态、跨页面 UI 状态。服务端任务列表、报告、模型列表不放 Zustand。

### 页面状态

筛选条件、Dialog 开关、Tab、展开状态等使用 React state。

### 表单

复杂表单统一 React Hook Form + Zod。字段和 API Input 一致时直接提交 `values`，不逐字段重复组装。

## 5. 迁移阶段

### Phase A：仓库标准化

- [x] 建立独立分支 `refactor/template-alignment`
- [x] 建立 `src/mocks` 边界
- [x] Axios client 复用，避免重复注册 interceptor
- [ ] 用模板规范重写 `AGENTS.md`
- [ ] 增加 `skills/react-app`、`react-data`、`react-ui`、`react-performance`
- [ ] 增加 ESLint / Prettier / Knip / Vitest / TypeScript 工具链
- [ ] 增加 TanStack Query / Zustand / Zod / auto-import / icons 依赖

### Phase B：应用基础设施

- [ ] 建立 `src/app/AppProviders.tsx`
- [ ] QueryClientProvider 进入 AppProviders
- [ ] 保留 UserProvider 作为兼容会话 Provider，逐步缩减职责
- [ ] 将 Router 创建与路由元数据职责拆清，继续使用 Hash Router
- [ ] 建立 app 级 ErrorBoundary

### Phase C：目录迁移

- [ ] `src/app/pages` → `src/pages`
- [ ] `src/app/components/ui` → `src/components/ui`
- [ ] 跨页面组件 → `src/components/common`
- [ ] `Layout.tsx` → `src/layouts`
- [ ] 页面私有组件就近放入对应 page
- [ ] 更新 import，移除旧目录兼容层

迁移只改变文件归属与 import；不改变视觉 JSX。

### Phase D：真实业务数据层

优先处理真实接口已经存在的页面：

1. ResourceCenter
2. AdminDashboard / AdminWorkflowWorkbench
3. TaskCreationModal
4. 登录 / 注册
5. AIGC 在线体验
6. 各类评测任务创建与查询

原则：

- 服务端状态改为 TanStack Query。
- 删除页面中手写的 request sequence、请求去重、失败冷却等 Query 已提供的能力。
- API DTO 按 Create/Input、Response、Query 拆分，不再一个全 optional 类型复用所有场景。
- 状态/产品映射集中在 adapter，不在多个页面重复维护。

### Phase E：没有接口的业务

当前没有完整后端能力的功能保留 mock，例如部分评测结果详情、纯演示结果、暂未开放的用户功能。

要求：

- mock 文件名明确带 `mock`。
- 页面不直接维护大段业务假数据。
- mock 与真实正式任务不写入同一持久化数据源。
- 不出现“真实接口失败后偷偷落 localStorage 然后显示成功”的行为。

### Phase F：大页面整理

按真实职责拆分 50KB~100KB 页面，优先：

- DeveloperCenter
- DeepModelEval
- OnlineExperience
- AigcContent
- CodeVulnerabilityAudit
- LLMEvaluation

只在存在清晰 UI/业务边界时拆组件，不建立目录全家桶。

### Phase G：类型收口

- [ ] 清理 `any`
- [ ] API 输入/输出边界收紧
- [ ] 将 `strict` 最终切为 true
- [ ] 清理迁移兼容文件、死代码和旧 mock 数据源

## 6. 当前业务的明确处理策略

| 模块 | 数据策略 |
|---|---|
| ResourceCenter 任务列表/概览 | 真实 API + TanStack Query |
| 管理端任务/交付/补件 | 真实 API + TanStack Query |
| TaskCreationModal | 真实 API；模型保存失败不得伪造本地真实模型 |
| TaskDetailNew 评测结果 | 当前无完整结果接口时使用明确 mock |
| DeepModelEval | 接口字段不能覆盖当前 UI 时使用 mock service；能覆盖部分能力时不要混合伪成功 |
| AIGC analyze / samples / reports | 保留现有真实 AIGC API |
| 忘记密码 | 无接口时使用明确 mock service |
| 营销页雷达图/场景示意 | 允许静态展示数据 |
| 用户资料 | 后端支持的字段走 API；未支持字段不得假装已远端保存 |

## 7. 完成定义

本轮迁移完成必须同时满足：

- 运行时页面与迁移前视觉一致。
- 所有路由仍走 Hash Router。
- 页面代码不直接使用 Axios。
- 服务端数据默认由 TanStack Query 管理。
- 客户端全局状态归 Zustand；不把服务端列表复制进去。
- mock 与真实 API 有清晰代码边界。
- 页面、组件、layout 已归入模板目录。
- `AGENTS.md` 与四个 Skills 可直接指导后续 AI 生成代码。
- ESLint、Prettier、TypeScript、Vitest、Knip 配置存在且与项目结构一致。
- 不再以旧 `app/pages + app/components` 作为业务代码默认落点。

## 8. Git 约束

本轮全部修改只提交到：

```text
refactor/template-alignment
```

用户没有要求前，不创建其他分支、不创建 PR、不改默认分支。
