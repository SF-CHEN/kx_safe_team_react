# 玄鉴 React 项目 AI / Agent 开发规范

本仓库以 `SF-CHEN/react-ai-template` 为唯一工程规范基准，用于 **AI 辅助开发 + 人工长期维护**。

默认优先级：

> **清晰 > 易找 > 可维护 > 一致 > 简洁 > 炫技式抽象**

## 1. 项目级不可破坏约束

- 产品：玄鉴可信安全平台门户（营销页 + 在线体验 + 评测 + 资源中心 + 管理后台）。
- 运行时框架当前保留 React 18 + Vite 6，工程规范按模板执行；不要为了普通业务改动顺手升级 React/Vite。
- 路由必须继续使用 **`createHashRouter`**，保留现有 `/#/path` URL，不切 BrowserRouter。
- 当前页面 DOM、className、CSS、inline style、动画和响应式效果是视觉真源；未明确要求改 UI 时禁止借重构改样式。
- `src/components/ui/**` 使用当前 Radix/shadcn 源码，迁移期间不要用 Base UI 或 shadcn CLI 批量覆盖。
- `newUI/` 仅为视觉参考；运行时代码在 `src/`。可以参考视觉，不得用 newUI 的 mock/localStorage 覆盖已经接通的真实 API。
- 当前 Vite 中的 Figma asset resolver、API proxy、base、manualChunks、assetsInclude 必须保留。
- 默认继续当前分支。除非用户明确要求，不创建新分支或 PR。

## 2. 技术栈与目标能力

- React + TypeScript + Vite
- React Router（Hash Router）
- Tailwind CSS
- 当前 Radix/shadcn UI 源码
- TanStack Query
- Zustand
- React Hook Form + Zod
- Axios
- Recharts（现有页面继续使用）；新增通用复杂图表可按模板使用 ECharts
- Day.js / date-fns 按现有模块需要使用，不为了统一强制重写
- unplugin-auto-import
- unplugin-icons + Lucide Iconify
- lucide-react（现有 UI 源码兼容）
- ESLint + Prettier
- Vitest
- Knip

没有明确需求时，不引入职责重复的第二套 UI、状态、请求或表单方案。

## 3. Skill 路由

| 场景 | 必读 Skill |
|---|---|
| 页面、组件、路由、表单、TypeScript、目录调整 | `skills/react-app/SKILL.md` |
| API、CRUD、TanStack Query、Zustand、Mock、OpenAPI | `skills/react-data/SKILL.md` |
| 页面视觉、shadcn/ui、状态、响应式、可访问性 | `skills/react-ui/SKILL.md` |
| 网络瀑布、重渲染、大列表、Bundle、昂贵计算 | `skills/react-performance/SKILL.md` |

## 4. 目录原则

项目采用 **页面优先 + 渐进式分层**：

```text
src/
├── api/              后端接口、请求模型、HTTP 基础设施
├── app/              Provider、Hash Router、路由元数据、守卫、应用基础设施
├── pages/            路由页面和页面私有代码
├── components/
│   ├── ui/           当前 shadcn/Radix 基础组件源码
│   ├── common/       跨页面通用组件
│   └── charts/       图表基础封装
├── layouts/          页面布局
├── hooks/            真正跨页面通用 Hook
├── store/            全局客户端状态
├── mocks/            明确没有真实接口能力的 Mock
├── styles/           全局样式
├── types/            真正跨业务公共类型
└── utils/            通用纯函数
```

规则：

- 不使用 `features/`、`modules/` 作为默认业务根目录。
- 所有后端 API 统一放 `src/api`。
- 简单页面保持扁平，不预先创建 components/hooks/query/types/schema 全家桶。
- 页面私有代码优先就近放；真实跨页面复用后再提升。
- 不为了“架构完整”创建只有一个文件的目录。
- 路由页面和导航元数据以 `src/app/routes.tsx` 为单一来源。

## 5. 数据源硬规则

同一份状态只保留一个真实来源：

- 服务端状态：TanStack Query
- 全局客户端状态：Zustand
- 局部 UI / 普通筛选：React state
- 表单：React Hook Form
- 没有完整后端能力：明确 Mock

### 真实 API

- Axios 只允许在 `src/api` 使用。
- 请求基础设施统一收口到 `src/api/request.ts`；AIGC 独立网关基础设施放 `src/api/aigc/request.ts`。
- **除明确例外外，普通业务 HTTP 不手写 URL / method / Axios 调用。** 后端 OpenAPI 先用模板脚本生成到 `src/api/generated/**`，业务代码直接引用 generated 函数。
- `src/api/generated/**` 是生成产物，**禁止手工修改**。接口变化时运行 `npm run api:generate`，需要同时更新接口文档时运行 `npm run api:all`。
- 生成脚本以 `script/generate-api.cjs`、`script/load-swagger.cjs`、`script/sync-options.cjs` 为准，与 `react-ai-template` 保持一致。
- `src/api/<domain>/**` 只允许做真正的业务输入约束、`Result<T>` 解包、DTO → ViewModel 映射、跨接口组合；不得重复声明 generated 已有的 URL、method 和请求实现。
- 页面如果不需要业务适配，可以直接 import `@/api/generated/*`；需要适配时 import `src/api/<domain>` 的业务封装。
- AIGC 网关未进入当前 OpenAPI，因此 `src/api/aigc/**` 是明确的手写 API 例外，但必须复用 `aigc/request.ts`，不得在页面或 Hook 中直接 Axios。
- 二进制下载等 Swagger 无法表达 `responseType: 'blob'` 的接口可保留最小手写传输例外，并必须写 Why 注释说明生成器限制；不要手改 generated 文件。
- 页面不在 `useEffect` 中手写 TanStack Query 已提供的请求、缓存、竞态控制、去重和刷新。
- 服务端任务、模型、报告、用户列表不得复制到 Zustand / localStorage 作为第二份正式数据。

### Mock

允许在没有接口或接口不能覆盖当前 UI 业务时继续使用假数据，但必须：

- 放 `src/mocks/**` 或页面私有 `*.mock.ts`；
- 命名明确包含 `mock`；
- 通过 mock service / adapter 给页面；
- 不在真实 API 失败后偷偷写本地数据并显示为真实成功；
- 纯营销演示、雷达图、场景示意可以长期使用静态数据。

## 6. React / TypeScript / 表单

- 页面入口负责布局、筛选、业务流程和组件组合，不把大型表单、表格列、重型图表全部继续堆进去。
- 派生值直接计算，不用 `useEffect + useState` 保存第二份状态。
- 用户交互逻辑优先放事件处理函数。
- 不机械添加 memo / useMemo / useCallback / useRef。
- 不在组件内部定义 React 组件。
- 动态列表有稳定 ID 时不用数组索引 key。
- 不直接修改 props / state。
- 禁止新增 `any` 绕过类型问题；未知外部数据用 `unknown` 后收窄。
- API Input 与 Response 分开建模，不用一个“所有字段可选”的 DTO 同时承担创建、查询和返回。
- 表单字段与 API Input 一致时直接复用 Input 类型并提交整个 `values`。
- 只有字段改名、转换、过滤或 DTO 结构不同时才构造 payload。
- 优先字面量联合、`as const`、`satisfies`，无运行时需求不滥用 enum。

## 7. UI 规则

- 现有视觉优先级高于模板默认视觉。
- 基础 UI 优先复用 `src/components/ui`；已有 Button/Dialog/Select/AlertDialog 等能力时不要维护第二套。
- 迁移目录时移动源码而不是重新生成 UI 组件。
- Loading / Empty / Error 必须明确处理；不只实现成功态。
- 危险操作优先统一 AlertDialog，不使用 `window.confirm` 作为正式实现。
- 图标按钮提供 aria-label；Dialog 保留语义标题。
- 动画只用于状态表达；已有营销动画可以保留。

## 8. 注释

复杂公共基础设施可使用精简 L3：

```ts
/**
 * [INPUT]: 依赖什么
 * [OUTPUT]: 对外提供什么
 * [POS]: 项目中的职责
 */
```

普通页面、简单 Hook、页面私有组件不机械加 L3。

正文注释使用简体中文，解释 Why、业务流程、特殊状态、数据转换、第三方限制和性能取舍；不要逐行翻译代码。

## 9. Git 与校验

- commit message 默认简体中文，简短描述真实修改目的。
- 一个提交尽量对应一个逻辑修改。
- 不提交密钥和真实敏感环境变量。
- 不修改 Git 全局配置，不 force push / hard reset。
- 暂不引入 Husky / lint-staged。

默认 AI 不主动执行 build / lint / typecheck / test / knip，除非用户明确要求。若未执行，最终回复说明。

## 10. 禁止模式

不要生成：

- 页面直接调用 Axios；
- 普通业务模块重新手写 generated 已有的 URL / method / HTTP 请求；
- 手工编辑 `src/api/generated/**`；
- 服务端列表放进 Zustand；
- 真实 API 失败后落 localStorage 并假装成功；
- 没有接口的 mock 散落在页面 JSX；
- 可派生状态使用 effect 同步；
- 无意义 memo；
- 一个简单页面拆七八层目录；
- 重复定义 API DTO / FormData；
- 表单字段完全一致却逐字段重新组装 payload；
- 为了迁移目录改动现有视觉；
- 批量重生成当前 shadcn/Radix UI；
- 将 Hash Router 改成 Browser Router；
- 把 `newUI/` 当运行时数据源；
- 未经用户要求创建新分支或 PR。
