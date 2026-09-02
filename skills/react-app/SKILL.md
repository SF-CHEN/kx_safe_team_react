---
name: react-app
description: 玄鉴 React + TypeScript + Vite 项目的页面、组件、Hash 路由、表单、TypeScript 和目录实现规范。
---

# React 应用实现 Skill

## 目标

生成容易找到、容易理解、容易维护的 React 代码。当前项目视觉已经稳定，结构重构默认不得改变页面样式。

## 文件放置

| 内容 | 默认位置 |
|---|---|
| 后端接口 | `src/api/<name>.ts` 或现有业务子目录 |
| 路由页面 | `src/pages/<name>/index.tsx` 或简单页 `src/pages/<Name>.tsx` |
| 页面私有组件 | 当前页面目录 |
| 复杂页面组件 | `pages/<name>/components/` |
| 页面特殊 Query | 页面附近 `<name>.query.ts` |
| 页面 Schema | 页面附近 `<name>.schema.ts` |
| 基础 UI | `src/components/ui` |
| 跨页面组件 | `src/components/common` |
| Layout | `src/layouts` |
| 全局客户端状态 | `src/store` |

简单页面不要默认创建目录全家桶。

## 页面职责

页面入口负责布局、业务流程、筛选与组件组合。独立业务区块、复杂表单、重型结果区域有清晰边界时再拆。

迁移旧页面时：

- 原 DOM / className / inline style / 动画尽量原样移动；
- 先抽数据与业务逻辑，再考虑 UI 拆分；
- 不为了“模板统一”重写已经稳定的视觉组件。

## React

- 派生值直接计算，不用 effect 同步第二份 state。
- 交互逻辑放事件处理函数。
- 新状态依赖旧状态时使用函数式 setState。
- 不机械添加 memo/useMemo/useCallback/useRef。
- 不在组件内部声明 React 组件。
- 列表使用稳定业务 ID。
- props/state 不可变。
- 当前路由级 lazy 继续由 app 层组织。

## 路由

本项目必须使用 Hash Router。

- `src/app/routes.tsx`：路由页面和导航元数据单一来源；
- `src/app/router.tsx`：`createHashRouter`、Layout、守卫、ScrollToTop、兜底；
- 不切换 BrowserRouter；
- 站内跳转使用 Link/navigate；需要新开 Hash 页继续使用 `@/utils/hashRoute`。

## 表单

复杂表单使用 React Hook Form + Zod。

- API Input 与表单一致时直接复用 API Input 类型。
- Schema 可用 `satisfies z.ZodType<ApiInput>` 保持契约一致。
- 字段一致时直接提交整个 values。
- 只有字段改名、类型转换、清洗或嵌套结构不同时做转换。
- 非原生 shadcn/Radix 控件用 Controller。

## TypeScript

- 不用 `IUser` 前缀或机械 Type/Interface 后缀。
- 禁止新增 any；未知外部数据用 unknown 收窄。
- API 类型跟 API 放一起；页面私有类型跟页面放一起；真正共享才进 `src/types`。
- Input/Response/Query 按用途拆分，避免一个全 optional DTO 包办全部场景。
- 优先字面量联合、as const、satisfies。

## 注释

复杂业务流程、特殊状态联动、数据转换、兼容原因、第三方限制写中文 Why 注释。普通 JSX 和简单赋值不逐行注释。

## 完成检查

- 文件是否放在最接近所有者的位置？
- 是否改变了现有视觉？
- 是否存在重复 state？
- 是否把复杂数据转换塞进 JSX？
- 表单是否重复定义了和 API 一样的类型？
- 路由和菜单是否仍来自同一份配置？
