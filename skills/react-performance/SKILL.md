---
name: react-performance
description: 玄鉴 React 项目的请求瀑布、重渲染、Bundle、列表与动画性能规范。
---

# React 性能 Skill

## 原则

先测量和定位真实瓶颈，再优化。不要为了“性能”机械添加 memo/useMemo/useCallback。

## 请求

- 独立请求并行；有依赖才串行。
- 服务端缓存、请求去重、重试交给 TanStack Query。
- 页面不要自建 Promise Map、request sequence、失败冷却缓存。
- 大文件上传、AIGC 长任务允许单请求覆盖特殊 timeout。

## 渲染

- 派生数据直接计算；只有昂贵计算且依赖稳定时 useMemo。
- 只有子组件确实因引用变化重复渲染且有收益时 useCallback/memo。
- 不在 render 中做大规模 JSON 转换或复杂 mapper。
- 大型列表出现真实卡顿时再考虑虚拟化。

## Bundle

- 继续保留当前 Vite manualChunks 与路由 lazy。
- 大型页面保持路由级 lazy。
- `newUI/` 不进入生产运行时 import。
- 大型静态资源优先 public/assets；不要继续无节制塞入 `src/imports`。
- 第三方库不要为了一个小功能整包引入。

## 动画

- 保留现有营销动画。
- 高频动画优先 transform/opacity。
- 避免在滚动/鼠标移动时持续触发 React state 导致整页重渲染。

## 图表

- 图表数据转换放 JSX 外。
- ECharts/Recharts 大数据量时先裁剪、聚合，再渲染。
- 不因普通静态图表滥用 memo。

## 完成检查

- 是否存在可以并行却串行的请求？
- 是否重复实现 Query 缓存/去重？
- 是否出现无意义 memo？
- 是否把大资源打进首屏 Bundle？
- 是否有高频 state 更新驱动整页？
