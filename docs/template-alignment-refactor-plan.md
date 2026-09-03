# 玄鉴 React 模板化迁移完成记录

> 工作分支：`refactor/template-alignment`
>
> 工程规范基准：`SF-CHEN/react-ai-template`
>
> 业务与视觉来源：`SF-CHEN/kx_safe_team_react`

## 1. 本轮目标

本轮迁移已经完成“模板工程能力 + 现有玄鉴业务 + 现有玄鉴视觉”的合并：

```text
react-ai-template 的工程规范
+
kx_safe_team_react 的业务实现
+
kx_safe_team_react 的现有视觉
```

迁移过程中没有强制把现有 Radix/shadcn UI 替换成 Base UI，也没有为了追求模板版本号而直接升级 React 19 / Vite 8；这两项会扩大视觉和运行时回归面，不属于本轮必要改动。

## 2. 已完成的工程标准化

- [x] `AGENTS.md` 按模板原则重写并加入玄鉴项目覆盖规则。
- [x] 增加 `skills/react-app`、`react-data`、`react-ui`、`react-performance`。
- [x] 增加 ESLint、Prettier、Vitest、Knip、TypeScript 工具链与脚本。
- [x] 增加 TanStack Query、Zustand、Zod、auto-import、icons 等工程依赖。
- [x] Axios 请求客户端统一复用，避免业务 API 重复创建 interceptor。
- [x] 新增 `package-lock.json`，正式 CI 使用 `npm ci` 和 npm cache。
- [x] TypeScript 已开启 `strict: true`。

## 3. 已完成的应用基础设施

- [x] 建立 `src/app/AppProviders.tsx`。
- [x] QueryClientProvider 进入应用 Provider 层。
- [x] 建立 app 级 `ErrorBoundary`。
- [x] Router / routes 职责拆分，同时保留 `createHashRouter`。
- [x] 会话客户端状态进入 Zustand；`UserContext` 仅保留迁移兼容职责。

## 4. 已完成的目录迁移

当前主要运行时代码已经按页面优先的模板结构整理：

```text
src/
├── api/
├── app/
├── pages/
├── components/
├── layouts/
├── hooks/
├── store/
├── mocks/
├── context/
├── data/
├── styles/
├── imports/
└── utils/
```

具体完成项：

- [x] `src/app/pages` → `src/pages`。
- [x] `src/app/components` → `src/components`。
- [x] Layout → `src/layouts`。
- [x] App / Providers / ErrorBoundary / Router → `src/app`。
- [x] 建立 `src/store` 与 `src/mocks`。
- [x] 修复目录迁移导致的 11 处相对资源引用错误。
- [x] 运行时不再以旧 `src/app/pages + src/app/components` 作为默认业务目录。

跨页面组件目前保留在 `src/components` 根目录和 `ui/` 中，没有机械地为每个组件创建 `common/xxx` 单文件目录；后续只有出现真实复用边界时再继续分层。

## 5. 已完成的数据层与真实接口整改

### ResourceCenter / Admin

- [x] 服务端任务、概览、模型等数据迁入 TanStack Query。
- [x] 删除/替代页面层手写 request sequence、请求去重、失败冷却等重复能力。
- [x] 管理端任务、沟通、文件、交付等真实 API 统一进入请求层。
- [x] 状态、产品等映射集中整理，减少页面间重复映射。

### TaskCreationModal

- [x] 正式任务只以真实后端提交成功为准。
- [x] 模型保存失败时不再向 UserContext/localStorage 伪造“已保存模型”。
- [x] 不再向本地任务系统复制正式服务端任务。
- [x] 创建参数直接使用 `CreateEvaluationTaskInput`，不再复用全 optional 的响应 DTO。

### DeepModelEval

- [x] 删除未被使用的 `Date.now() + addTask()` 假任务提交死代码。
- [x] 当前实际交互继续使用真实 `model-trust-evaluation-task` 上传任务流程。

### 登录 / 注册 / 用户状态

- [x] 修正注册与登录“邮箱/用户名”契约不一致问题。
- [x] 忘记密码在无真实后端接口时走显式 mock，不再伪装真实远端成功。
- [x] 去掉前端自行发明的 1 天 / 15 天 token 有效期；“记住登录”只表达存储策略。
- [x] 服务端正式任务不再依赖 UserContext/localStorage 作为事实来源。

### API 边界

- [x] 引入 Input / Response 分离的严格创建类型。
- [x] 页面代码不直接创建 Axios client。
- [x] AIGC、文件、概览、模型、任务等 API 使用统一请求基础设施。

## 6. Mock 边界

后端暂未覆盖的能力已显式放入：

```text
src/mocks/auth/
src/mocks/evaluation/
```

约束：

- mock 不和正式服务端任务写入同一事实数据源。
- 接口失败时不能偷偷回退 localStorage 并显示成功。
- 营销页、效果示意、雷达图等纯展示数据可以保留静态数据。
- 后端能力补齐后只替换 mock service / adapter，不要求重写页面视觉。

## 7. 保留不动的项目特性

以下内容是有意保留，而不是迁移遗漏：

1. `createHashRouter` 与现有 `/#/path` URL。
2. 当前 DOM、className、CSS、动画和响应式表现。
3. 当前 Radix/shadcn UI 源码。
4. 当前 Vite 的 Figma asset resolver、代理、base、manualChunks、assetsInclude。
5. `newUI/` 继续作为只读视觉参考。
6. React 18 / Vite 6 暂不为了版本对齐而强制升级。

## 8. 类型与构建验证

本轮已经完成：

- [x] `strict: true`。
- [x] strict 模式下 TypeScript typecheck 通过。
- [x] Vite production build 通过。
- [x] 目录迁移后的资源解析通过生产构建验证。
- [x] 正式 GitHub Actions 校验保留为 `.github/workflows/template-alignment-check.yml`。
- [x] 所有用于迁移的一次性 autofix workflow / trigger / patch script 已删除。

正式 CI 使用：

```text
Node 22
→ npm ci
→ npm run typecheck
→ npm run build
```

## 9. 后续可选优化

以下不再是“本轮迁移阻塞项”，建议按实际维护成本逐步做，不要一次性大拆：

- DeveloperCenter、OnlineExperience、AigcContent、CodeVulnerabilityAudit、LLMEvaluation 等超大页面按真实职责拆分。
- 当 `src/context` / `src/data/workflowStore` 不再被兼容功能使用后，再彻底删除对应兼容代码。
- 根据真实需求升级 React 19 / Vite 8 / Recharts 3，而不是仅为版本号对齐升级。
- 开始新增复杂表单时，优先 RHF + Zod；不要为了重构旧表单而无收益地全量替换。

## 10. 完成定义

本轮模板化迁移完成标准：

- [x] 页面视觉与迁移前保持同一实现来源。
- [x] 所有路由继续走 Hash Router。
- [x] 页面不直接使用 Axios client。
- [x] 服务端列表/详情默认由 TanStack Query 管理。
- [x] 正式任务不复制进 localStorage 作为第二事实来源。
- [x] mock 与真实 API 有明确代码边界。
- [x] 页面、组件、layout 已归入模板化目录。
- [x] `AGENTS.md` 与四个 Skills 可直接指导后续 AI 生成代码。
- [x] ESLint、Prettier、TypeScript、Vitest、Knip 配置存在。
- [x] TypeScript strict、production build 已通过。
- [x] npm lockfile 与可重复 CI 安装链路已建立。
- [x] 仓库不保留一次性迁移脚本或自动改源码 workflow。

## 11. Git 约束

本轮修改全部位于：

```text
refactor/template-alignment
```

未创建额外业务分支，未创建 PR，未修改默认分支。
