# 玄鉴可信安全平台 — 目标项目结构

**适用栈：** Vite 6 + React 18 + React Router 7 + Tailwind 4 + shadcn/ui  
**目标：** 按业务域拆分、页面变薄、共享层清晰，便于懒加载与后续 TypeScript 严格化。

## 一、当前结构的问题

| 现象 | 影响 |
| --- | --- |
| `pages/` 扁平堆放 31 个页面 | 产品线边界不清，难按域拆包 |
| `components/` 业务组件、布局、守卫、Mock 混放 | 复用边界模糊，巨型文件难拆 |
| `src/imports/` 存放 PNG/PDF（约 13MB） | 资源进入模块图，构建与缓存成本高 |
| `hooks/`、`api/`、`utils/` 分散且粒度不均 | 新功能不知该放哪一层 |
| 路由集中同步导入全部页面 | 首屏携带后台/开发者中心等无关 chunk |

## 二、推荐目录（Feature 优先 + Shared 共享）

```text
可信安全团队-react-source/
├── public/                          # 纯静态资源（不进 JS bundle）
│   ├── images/                      # 场景图、品牌图、OG 图
│   ├── docs/                        # PDF 等下载资源
│   └── web.config
├── deploy/
├── docs/
├── src/
│   ├── main.tsx
│   ├── vite-env.d.ts
│   │
│   ├── app/                         # 应用壳：启动、路由、全局 Provider
│   │   ├── App.tsx
│   │   ├── providers/
│   │   │   └── UserProvider.tsx
│   │   └── router/
│   │       ├── index.tsx            # createHashRouter 出口
│   │       ├── routes.portal.tsx    # 门户 / 产品路由
│   │       ├── routes.auth.tsx      # login / register
│   │       ├── routes.admin.tsx     # /admin
│   │       ├── routes.developer.tsx # /developer
│   │       └── guards/
│   │           ├── RequireAuth.tsx
│   │           ├── RequireAdmin.tsx
│   │           └── GuestGuard.tsx   # 操作级登录提示（保留）
│   │
│   ├── features/                    # 按业务域组织（核心）
│   │   ├── portal/                  # 企业门户首页、关于我们、帮助文档
│   │   │   ├── pages/
│   │   │   │   ├── CompanyHome/
│   │   │   │   │   ├── index.tsx   # 页面入口（尽量 <200 行）
│   │   │   │   │   ├── sections/   # Hero、场景、生态等区块
│   │   │   │   │   └── data.ts
│   │   │   │   ├── AboutUs/
│   │   │   │   └── HelpDocs/
│   │   │   └── components/          # 仅本域复用
│   │   │
│   │   ├── products/                # 产品线（天源 / 天巡 / 天策 / 天衡…）
│   │   │   ├── pages/
│   │   │   │   ├── ProductsOverview/
│   │   │   │   ├── ProductSeries/
│   │   │   │   ├── DeepModelEval/
│   │   │   │   ├── ModelSafetyEval/
│   │   │   │   ├── AigcContent/
│   │   │   │   ├── PenetrationTest/
│   │   │   │   ├── PrivacyDataAudit/
│   │   │   │   └── ...
│   │   │   ├── components/          # ProductHero、MetricSelector 等
│   │   │   └── constants/
│   │   │
│   │   ├── evaluation/              # 评测任务、榜单、任务详情
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   └── hooks/
│   │   │
│   │   ├── experience/              # 在线体验、资源中心
│   │   ├── auth/                    # 登录 / 注册
│   │   │   ├── pages/
│   │   │   ├── components/          # AuthBrandPanel
│   │   │   └── api.ts               # 或复用 shared/api
│   │   ├── admin/
│   │   ├── developer/
│   │   └── legacy/                  # 过渡期：aisafepro 旧首页等
│   │
│   ├── shared/                      # 跨域复用（无业务归属）
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn 原子组件（原 app/components/ui）
│   │   │   ├── layout/              # Layout、GlobalFooter、StickySubNav
│   │   │   ├── feedback/            # 通用弹窗骨架、骨架屏
│   │   │   └── media/               # ImageWithFallback、ScrollReveal
│   │   ├── hooks/                   # useAigcAnalyze 等通用 hooks
│   │   ├── lib/                     # cn、auth token、gateway、hashRoute、md5
│   │   ├── types/                   # 全局类型
│   │   └── constants/
│   │
│   ├── api/                         # 网络层（与 UI 解耦）
│   │   ├── index.ts                 # 统一出口
│   │   ├── client.ts                # temp-maven axios 实例
│   │   ├── types.ts                 # 共用 DTO
│   │   ├── auth.ts                  # 登录 / 注册 / 当前用户
│   │   ├── aigc/
│   │   │   ├── index.ts             # 分析、报告、样例、算法 API
│   │   │   ├── keys.ts              # algorithm key / 超时 / display 解析
│   │   │   ├── sampleUtils.ts       # 样例文件名 / MIME 工具
│   │   │   └── mappers/
│   │   │       ├── reportMapper.ts
│   │   │       └── sampleMapper.ts
│   │   ├── evaluation/
│   │   │   ├── modelDataSafety.ts
│   │   │   └── modelTrust.ts
│   │   ├── user/
│   │   │   └── sysUser.ts
│   │   └── docs/api.json
│   │
│   ├── assets/                      # 必须经 Vite 处理的少量资源（图标 SVG 等）
│   │   └── icons/
│   │
│   └── styles/
│       ├── index.css
│       ├── tokens.css               # 设计令牌（颜色/间距/圆角）
│       ├── fonts.css
│       └── tailwind.css
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 三、分层约定（写代码时的判断规则）

```text
页面 (features/*/pages/*/index.tsx)
  → 组合区块与业务组件，管路由参数与顶层状态
区块 / 业务组件 (features/*/components 或 pages/*/sections)
  → 单页或单域 UI，可调用 hooks 与 api
共享组件 (shared/components)
  → 无具体产品文案与业务规则，可被任意 feature 引用
API (api/)
  → 只做请求与 DTO 映射，不依赖 React
lib/utils (shared/lib)
  → 纯函数，无 JSX
```

**依赖方向（禁止反向依赖）：**

```text
app → features → shared / api
features 之间尽量不互相 import；确需复用则上提到 shared 或抽公共 feature
```

## 四、页面文件拆分模板

以超大页 `DeepModelEval` 为例，目标形态：

```text
features/products/pages/DeepModelEval/
├── index.tsx              # 组装 + 路由出口
├── sections/
│   ├── HeroSection.tsx
│   ├── MetricSection.tsx
│   └── ReportSection.tsx
├── components/
│   └── LocalOnlyWidget.tsx
├── hooks/
│   └── useDeepModelEval.ts
├── data.ts                # 文案、指标配置
└── types.ts
```

单文件建议：页面入口 &lt; 200 行；区块 &lt; 300 行；超过则继续按状态边界拆。

## 五、路径别名（建议在 vite / tsconfig 中配置）

```ts
{
  "@": "src",
  "@app": "src/app",
  "@features": "src/features",
  "@shared": "src/shared",
  "@api": "src/api"
}
```

示例：

```ts
import { Layout } from '@shared/components/layout/Layout';
import { CompanyHome } from '@features/portal/pages/CompanyHome';
import { createTempClient } from '@api/client';
```

## 六、路由与懒加载对应关系

| 路由组 | 文件 | 懒加载策略 |
| --- | --- | --- |
| 门户 + 产品营销页 | `routes.portal.tsx` | 除首页外均 `React.lazy` |
| 认证 | `routes.auth.tsx` | lazy |
| 开发者中心 | `routes.developer.tsx` | lazy + 独立 chunk |
| 管理后台 | `routes.admin.tsx` | lazy + `RequireAdmin` |

首页 `CompanyHome` 可同步导入；其余页面一律懒加载，并用 `Suspense` + 轻量骨架。

## 七、资源迁移原则

| 现状 | 目标 |
| --- | --- |
| `src/imports/*.png` | `public/images/...`，用绝对路径 `/images/...` 引用 |
| `src/imports/*.pdf` | `public/docs/...` |
| 仅图标/必须 hash 的资源 | `src/assets/` |
| Figma 导出临时文件 | 清理或移出仓库，不进生产构建 |

## 八、分阶段迁移（低风险）

| 阶段 | 动作 | 验收 |
| --- | --- | --- |
| **M0** | 只建目录与别名，不改业务逻辑 | 构建通过 |
| **M1** | `ui` → `shared/components/ui`；Layout/Footer → `shared/components/layout`；`utils` → `shared/lib` | import 路径更新，无行为变化 |
| **M2** | 路由拆分 + lazy + Auth/Admin 守卫 | 首页 chunk 变小；`/admin` 有守卫 |
| **M3** | 按域挪页面：`portal` → `auth` → `admin` → `developer` → `products` | 路由行为不变 |
| **M4** | 拆分 &gt;800 行页面；抽取 ProductHero 等共用块 | 单文件行数下降 |
| **M5** | `imports` 迁 `public`；设计令牌落地 | 资源体积与样式可维护性改善 |

每阶段保持可运行；禁止一次大挪移后无法回滚。

## 九、与当前目录的映射速查

| 当前 | 目标 |
| --- | --- |
| `src/app/pages/*.tsx` | `src/features/<域>/pages/<Name>/index.tsx` |
| `src/app/components/ui/*` | `src/shared/components/ui/*` |
| `src/app/components/Layout.tsx` 等 | `src/shared/components/layout/*` |
| `src/app/components/*Modal.tsx` | 归属对应 `features/*/components` |
| `src/app/components/*Mocks.tsx` | `features/*/mocks` 或 `__mocks__`（非生产） |
| `src/app/context/UserContext.tsx` | `src/app/providers/UserProvider.tsx` |
| `src/app/routes.tsx` | `src/app/router/*` |
| `src/hooks/*` | `src/shared/hooks` 或 `features/*/hooks` |
| `src/utils/*` | `src/shared/lib/*` |
| `src/api/tempClient.ts` | `src/api/client.ts` + `src/api/types.ts` |
| `src/api/aigc.ts` / `aigcKeys.ts` / mappers | `src/api/aigc/*` |
| `src/api/sysUser.ts` | `src/api/user/sysUser.ts` |
| `src/api/model*Evaluation.ts` | `src/api/evaluation/*` |
| `src/imports/*` | `public/images` / `public/docs` |
| `src/app/data/*` | 就近放到对应 feature 的 `data.ts` |

## 十、不做的事

- 不为了「好看」引入 Nest 式过深目录（避免 `components/common/shared/base`）。
- 不把 shadcn `ui` 与业务组件混放。
- 不让 `features/A` 直接 import `features/B/pages` 内部实现。
- 不把 API 类型散落在页面文件里。
