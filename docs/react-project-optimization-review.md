# 玄鉴可信安全平台 React 项目优化建议

**审查日期：** 2026 年 8 月 4 日  
**审查范围：** 当前 React 归档目录  
**审查性质：** 静态代码、性能、UI/UX 与安全检查

## 结论摘要

项目功能覆盖面较完整，但当前存在同步加载页面过多、资源体积偏大、权限路由缺少前端守卫、样式令牌不统一和组件文件过大的问题。

建议先完成 P0，再推进 P1 的性能和可维护性治理，最后补齐 TypeScript、测试和无障碍体系。

| 优先级 | 重点问题 | 主要影响 |
| --- | --- | --- |
| P0 | 路由同步导入、管理员路由无守卫 | 首屏加载慢；后台访问边界不清晰 |
| P0 | 生产 SEO 基础配置不正确 | 搜索引擎无法正常收录，页面描述不准确 |
| P1 | 静态资源已清理（当前约 18MB；仍可继续压 scenarios-v2 等） | 下载耗时与 LCP；同步原型时易回退 |
| P1 | 27 个源码文件超过 500 行 | 组件复用和维护成本高 |
| P1 | 内联样式与硬编码颜色较多 | 视觉规范难以统一，改版成本高 |
| P2 | strict 关闭、缺少质量脚本 | 类型风险和回归风险较高 |

## 一、P0：优先处理事项

### 1. 路由页面改为懒加载

**证据：** [src/app/routes.tsx](../src/app/routes.tsx) 顶层同步导入了 30 多个页面，包括后台、开发者中心和多个大型产品页面。多个页面超过 1,000 行，单文件约 45–100KB。

**建议：**

- 使用 `React.lazy` + `Suspense` 做路由级拆包。
- 首页、产品详情、登录、后台和开发者中心分别形成独立 chunk。
- 为慢网络提供页面骨架或轻量加载提示。
- 验收标准：首页请求不再包含后台和非当前页面代码。

### 2. 增加认证与管理员路由守卫

**证据：** `/admin` 在 routes 中直接指向 `AdminDashboard`，未检查 `sessionReady`、登录状态或 `admin` 角色。现有 `GuestGuard` 只处理用户点击操作时的登录提示，不能替代路由守卫。

**建议：**

- 增加 `RequireAuth` 和 `RequireAdmin`。
- 会话恢复期间显示 loading 状态。
- 未登录跳转登录页，非管理员跳转 403 或首页。
- 服务端 API 仍需独立校验权限，前端判断不能作为安全边界。

### 3. 修正生产环境 SEO 配置

**证据：** [index.html](../index.html) 使用 `lang="en"`，description 仍是通用代码生成工具文案，并设置了 `noindex, nofollow`。只有少数页面运行时修改 `document.title`。

**建议：**

- 生产环境改为 `lang="zh-CN"`。
- 按首页、产品、解决方案和帮助文档设置独立 title、description 和 OG 标签。
- 开发环境可以保留 `noindex`，生产环境应由发布配置决定。
- 如果门户需要搜索收录，评估 `BrowserRouter` 与服务器 history fallback。

## 二、P1：性能与可维护性

### 4. 压缩和分层加载静态资源

**证据（2026-08-07 复核）：**

- 清理后 `src/imports` + `public` 约 **18MB** 量级（此前峰值约 54MB）。
- Hero / scenario 已切到 **WebP**；同名大 PNG 与未引用旧图（`login.png`、课程页旧素材、`hero.png` 等）已删除。
- 白皮书 PDF 走 `public/whitepapers/` + URL 下载（符合「勿进模块依赖」）。
- 部分页面已补 `loading="lazy"` / `fetchPriority="high"`；`ImageWithFallback` 默认懒加载。仍缺系统的 `srcSet` / `sizes`；部分 Hero 仍用 CSS `background-image`（已指向 webp）。

**建议（按优先级）：**

1. **同步原型时守门**：`newUI` → `src` 拷图前检查体积；已有 WebP 时不要再拷同名大 PNG/JPG；PDF 只放 `public/`（或 CDN）。可用 `node .agents/skills/newui-prototype-sync/scripts/find-unused-assets.mjs` 扫死资源。详见 `.agents/skills/newui-prototype-sync`。
2. **分层加载（已部分落地，需保持）**：首屏 LCP 图 `fetchPriority="high"`；页脚/列表/用例等非首屏 `loading="lazy"`；共享组件默认懒加载。
3. **继续压缩**：`scenarios-v2/`、`about-rongsu-city-hero.png`、`xuanjian-brand-logo.png` 等仍可转 WebP；目标单张展示图小于 300–500KB。
4. **Hero 背景**：有条件时把关键 LCP 背景从 CSS `background-image` 改为带宽高的 `<img>`（或 `<picture>`），以便声明优先级与尺寸。
5. **响应式**：按移动/桌面输出 1x/2x 或宽度档位，补 `srcSet` + `sizes`；为图片声明宽高或 `aspect-ratio`，避免 CLS。

### 5. 拆分超大页面和重复业务组件

当前较大的文件包括：

| 文件 | 约行数 |
| --- | ---: |
| `DeepModelEval.tsx` | 1,536 |
| `DeveloperCenter.tsx` | 1,516 |
| `ModelSafetyEval.tsx` | 1,407 |
| `Layout.tsx` | 1,049 |

**建议：** 按页面区块、业务组件、数据配置、hooks 和 types 拆分。优先抽取共用的 `ProductHero`、`MetricSelector`、`TaskModal`、`ReportDialog` 和页面区块导航。组件拆分应以状态边界为依据，而不是简单按行数切文件。

### 6. 建立统一设计令牌

**证据：** 静态统计约 4,030 处内联 `style`，TSX 中约 4,422 个硬编码颜色；[globals.css](../src/styles/globals.css) 中有 62 处 `!important`。Layout 还在 hover 事件中直接修改 DOM style。

**建议：**

- 定义颜色、间距、圆角、阴影、字号和层级的语义变量。
- 使用 `--color-primary`、`--surface`、`--text-muted`、`--radius-md` 等 token。
- 新组件优先使用 token，再逐步收敛旧页面。
- 使用 class 或组件状态表达交互状态，减少事件中直接修改 style。

## 三、安全、无障碍与交互

### 7. 评估 Token 的存储方式

**证据：** [src/utils/auth.ts](../src/utils/auth.ts) 将登录 Token 写入 `localStorage`，以支持跨标签页读取。若页面存在 XSS，Bearer Token 可被脚本读取。

**建议：** 若后端支持，优先改为 `HttpOnly + Secure + SameSite` Cookie，并配合 CSRF 防护。若必须保留 localStorage，应加强 CSP、缩短 Token 生命周期、使用刷新 Token 轮换，并在安全评审中记录这一取舍。

### 8. 替换非语义点击元素

发现至少 10 个带 `onClick` 的 `div` 或 `span`，例如：

- `AigcDemoShowcase.tsx`
- `DeepModelEval.tsx`
- `ModelSafetyEval.tsx`
- `PenetrationTest.tsx`
- 多个遮罩层和自定义弹窗

建议优先换成 `button`、`a`、checkbox 或 slider；如果必须使用容器交互，应补齐 `role`、`tabIndex`、Enter/Space 键盘事件和 `aria-label`。自定义弹窗建议统一使用已有 Radix Dialog，确保 Escape、焦点锁定和焦点恢复。

### 9. 优化滚动监听和动效降级

`StickySubNav` 每次 scroll 都会读取多个元素布局、遍历锚点并更新状态。建议使用 `IntersectionObserver`，必要时使用 `requestAnimationFrame` 合并更新。

同时统一补充 `prefers-reduced-motion`，保证轮播、跑马灯、Reveal 和 transform 动画都能降级或关闭。

## 四、工程质量建设

### 10. 开启 TypeScript 严格模式

[tsconfig.json](../tsconfig.json) 当前 `strict` 为 `false`。建议分阶段开启：

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "noImplicitOverride": true
}
```

优先修复 API、UserContext、表单和任务模型，再覆盖展示组件。

### 11. 补齐质量工具和自动化检查

[package.json](../package.json) 当前只有 `dev` 和 `build` 脚本。建议补充：

- `typecheck`
- ESLint
- Prettier
- Vitest + React Testing Library
- Playwright 冒烟测试
- bundle analyzer

至少为登录、权限守卫、任务创建、关键导航和图片加载建立回归用例。

### 12. 清理调试输出和示例密钥

源码中仍有 `console.log`；DeveloperCenter 示例代码包含 `sk-test-your-key-here` 形式的 API Key 占位符。建议生产构建移除调试日志，示例密钥统一改成环境变量占位符，并增加 secret scanning。

## 五、推荐实施顺序

| 阶段 | 工作项 | 完成标准 |
| --- | --- | --- |
| 第 1 周 | 路由懒加载、管理员守卫、生产 SEO 基础配置 | 首页只加载必要 chunk；非管理员不可进入 `/admin`；生产页面不再使用错误 description 和 noindex |
| 第 2 周 | 图片压缩、懒加载、首屏资源优先级 | 首屏 LCP 资源明确，非首屏图片懒加载，图片不造成明显布局跳动 |
| 第 3–4 周 | 拆分巨型组件、抽取业务组件和设计令牌 | 重复组件集中维护；新增页面不再复制大段 JSX 和内联样式 |
| 持续建设 | 严格类型、Lint、测试、无障碍和安全扫描 | 每次合并都能自动完成类型检查、关键路径测试、构建体积检查和基础安全检查 |

## 六、验证限制

本次审查为静态检查。当前工作环境未提供 Node/npm/pnpm，因此未执行实际构建和 bundle 体积测量；也未能执行浏览器级 Lighthouse 或 Playwright 验证。建议在具备依赖的 CI 或开发机上补充：

1. `npm run build`
2. TypeScript 类型检查
3. Lighthouse 性能与无障碍审计
4. Playwright 关键路径测试
5. 构建产物体积对比
