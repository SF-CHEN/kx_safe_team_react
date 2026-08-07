# AGENTS.md — 玄鉴可信安全平台

面向 Cursor / Agent 的工作指引。细节以对应 Skill 与 `docs/` 为准，本文件只定方向与硬约束。

## 项目速览

| 项 | 说明 |
| --- | --- |
| 产品 | 玄鉴可信安全平台门户（营销页 + 在线体验 + 评测 + 后台） |
| 栈 | Vite 6 · React 18 · React Router 7 · Tailwind 4 · shadcn/ui · axios |
| 入口 | `src/main.tsx` → `src/app/App.tsx` → `src/app/routes.tsx` |
| 路由 | **`createHashRouter`（`/#/path`）**，禁止改成 BrowserRouter |
| 原型 | `newUI/` 为 Figma Make 视觉参考；**主站可运行代码在 `src/`** |
| 别名 | `@` → `src` |

常用命令：`npm i` · `npm run dev` · `npm run build`

## 接到任务先选 Skill

| 用户意图 | 必读 Skill | 要点 |
| --- | --- | --- |
| 对接接口 / 联调 / 换 mock | `.agents/skills/api-integration/SKILL.md` | **只改数据层，不改样式布局**；疑问写入 `docs/api-integration/` |
| 同步原型 / 对齐 newUI / 设计落地 | `.agents/skills/newui-prototype-sync/SKILL.md` | 先 diff 再改；保留 Hash、API、ScrollToTop、cursor、dialog 关闭钮 |
| 写/改 React 性能相关代码 | `.agents/skills/vercel-react-best-practices/SKILL.md` | 按规则选适用条目，勿整包照搬 Next 专属项 |

未命中上表时：先读本文件 + 相关 `docs/`，再动手。

## 硬约束（勿违背）

1. **Hash 路由**：站内用 `<Link to>` / `navigate()`；外链新开页用 `@/utils/hashRoute` 的 `openHashRoute` / `hashHref`。禁止把原型里的 `<a href="/path">`、`window.open('/path')` 原样拷进主站。
2. **双源边界**：`newUI/` 可抄视觉与结构；`src/api/`、`src/hooks/`、登录态/`UserContext` 以主站为准，禁止整文件被原型覆盖冲掉。
3. **接口对接默认零 UI 改动**：未点名改样式 = 不改 className / 布局 / 文案风格。
4. **前端守卫 ≠ 安全边界**：可加 `RequireAuth` / `RequireAdmin`；权限最终以服务端为准。
5. **改动最小化**：只改任务所需文件；不顺手大重构、不擅自扩 scope、不主动写无关 markdown。
6. **中文沟通**：对用户回复用简体中文。

## 目录心智模型

**当前（过渡中）**

```text
src/
  app/          # App、routes、pages、components、context
  api/          # 网络层（与 UI 解耦）
  hooks/ utils/ styles/ imports/
newUI/          # 原型（非生产入口）
docs/           # 结构规划、优化审查、接口对接纪要
.agents/skills/ # 可复用工作流
```

**目标结构**（按域拆分，尚未全面落地）：见 [`docs/project-structure.md`](docs/project-structure.md)。

依赖方向（迁移时遵守）：`app → features → shared / api`；features 之间尽量不互相 import。

放代码时：

| 改什么 | 放哪 |
| --- | --- |
| 页面 | `src/app/pages/`（迁移后 → `features/*/pages`） |
| 布局 / 通用 UI | `src/app/components/`（ui 属 shadcn） |
| 请求与 DTO | `src/api/`，不依赖 React |
| 纯函数 | `src/utils/` |
| 对接疑问 / 字段映射 | `docs/api-integration/YYYYMMDD-<模块>.md` |

## 常见工作流（摘要）

### A. 接口对接

1. 读 `api-integration` Skill + 复制 `_template.md` 写本轮纪要。
2. 明确字段直接接线；不清的写入「待确认」+ 2～3 方案，**不擅自猜字段顶替**。
3. 验收看 Network 路径与角色，不要靠改 UI「看起来像接上了」。

### B. 原型同步

1. 确认范围与接口页策略（默认：**样式对齐，保留主站 API**）。
2. 跑 `node .agents/skills/newui-prototype-sync/scripts/diff-newui.mjs`。
3. 按 Skill 清单同步；覆盖后核「主站必保留清单」（Hash / ScrollToTop / cursor / dialog `showCloseButton` / 换行 class）。
4. `npm run build` + 关键跳转与弹窗自测。

### C. 结构 / 性能治理

优先参考 [`docs/react-project-optimization-review.md`](docs/react-project-optimization-review.md)：

- P0：路由懒加载、Admin/Auth 守卫、生产 SEO
- P1：资源体积、大文件拆分、样式令牌
- 迁移按 `project-structure.md` 分阶段（M0→M5），每阶段可运行可回滚

## 编码约定

- 函数组件 + 现有项目模式；新 UI 优先复用 `src/app/components/ui/*`（shadcn）。
- 样式跟现有 Tailwind / CSS 变量；对接任务禁止借机换皮肤。
- 单文件过大（≳500 行）时，新改动优先按区块/hooks 拆，而不是继续堆。
- 静态大图/PDF 倾向 `public/`，避免再往 `src/imports/` 塞进 bundle。
- 不引入与任务无关的新依赖；需要时先说明理由。

## 不要做的事

- 不为「整齐」做一次性全站目录大挪移。
- 不把 shadcn `ui` 与业务弹窗/页面逻辑混成一团后整文件覆盖。
- 不提交密钥、`.env` 生产机密；不擅自 `git push` / 强推。
- 不在未要求时写测试/文档/重构周边代码。
- 不默默保留「演示版 / 待后端」类误导文案（真实接口已通则删掉或改准）。

## 文档索引

| 文档 | 用途 |
| --- | --- |
| [`docs/project-structure.md`](docs/project-structure.md) | 目标目录、分层、迁移阶段 |
| [`docs/react-project-optimization-review.md`](docs/react-project-optimization-review.md) | P0/P1/P2 优化清单 |
| [`docs/api-integration/`](docs/api-integration/) | 每轮接口对接纪要 |
| [`.agents/skills/`](.agents/skills/) | 可执行工作流 Skill |
