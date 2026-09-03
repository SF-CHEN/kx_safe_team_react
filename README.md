# 玄鉴可信安全平台

玄鉴可信安全平台前端，基于 React + TypeScript + Vite。当前工程已按 `react-ai-template` 的工程规范整理，同时保留原项目的 Hash 路由、业务流程、Radix/shadcn 组件源码和现有视觉样式。

## 环境要求

- Node.js >= 22
- npm 10+

## 本地运行

```bash
npm ci
npm run dev
```

生产构建：

```bash
npm run typecheck
npm run build
```

常用质量命令：

```bash
npm run lint
npm run format:check
npm run test:run
npm run check:deadcode
```

> AI 不应在没有明确要求时主动运行 lint / typecheck / build / test / deadcode；具体约束见 `AGENTS.md`。

## 工程结构

```text
src/
├── api/          # Axios 请求基础设施、真实后端 API、DTO 与 adapter
├── app/          # App、Providers、ErrorBoundary、Hash Router、路由定义
├── pages/        # 路由页面
├── components/   # UI 基础组件与跨页面组件
├── layouts/      # 页面布局
├── hooks/        # 通用 Hooks
├── store/        # Zustand 客户端状态
├── mocks/        # 后端暂未覆盖能力的显式 mock
├── context/      # 迁移期会话兼容层
├── data/         # 静态展示数据与兼容数据
├── styles/       # 保留现有视觉样式
├── imports/      # Figma/历史导入资源
└── utils/        # 通用纯函数
```

## 数据与状态约定

- 服务端数据：优先 TanStack Query。
- 全局客户端状态：Zustand。
- 页面筛选、Dialog、Tab 等：React state。
- 表单：React Hook Form + Zod（适合复杂表单时）。
- Axios 只允许出现在 `src/api` 请求层。
- 正式服务端任务、模型和报告不能复制到 localStorage 伪装成远端数据。
- 暂无后端能力的功能必须显式放入 `src/mocks`，不能在接口失败后显示“提交成功”。

## 路由与视觉约束

- 继续使用 `createHashRouter`，线上地址保持 `/#/path` 形式。
- 不切换 BrowserRouter。
- 现有 DOM、className、CSS、动画和响应式表现以当前项目为准。
- 现有 Radix/shadcn UI 源码继续保留，不为追求模板一致性强制替换 Base UI。
- `newUI/` 只作为视觉参考，不作为运行时业务数据源。

## AI 开发规范

AI 修改代码前先阅读：

- `AGENTS.md`
- `skills/react-app/SKILL.md`
- `skills/react-data/SKILL.md`
- `skills/react-ui/SKILL.md`
- `skills/react-performance/SKILL.md`

核心原则：**清晰 > 易找 > 可维护 > 一致 > 简洁 > 炫技式抽象**。

非显而易见的业务规则、第三方约束、数据转换和性能取舍应写简洁的 Why 注释；不要逐行翻译代码。
