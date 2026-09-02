---
name: react-ui
description: 玄鉴项目 UI、shadcn/Radix、交互状态、响应式与可访问性规范。
---

# React UI Skill

## 第一原则：现有视觉冻结

当前玄鉴页面已经有明确视觉稿。除非用户明确要求改 UI：

- 不改 className；
- 不改 inline style；
- 不改颜色、间距、圆角、阴影、动画；
- 不改变已有 DOM 层级导致 CSS 失效；
- 目录迁移只移动源码和 import。

## 基础 UI

`src/components/ui/**` 是唯一基础 UI 源码区。

- 当前使用 Radix/shadcn，继续保留。
- 不因为模板默认 Base UI 就批量替换。
- 不运行 shadcn CLI 覆盖已有组件。
- 已有 Button/Dialog/Select/Dropdown/AlertDialog/Tabs/Badge 等能力时不手写第二套。
- 业务组合组件放 `components/common`，不要塞进 ui。

## 页面状态

真实业务页必须考虑 Loading / Empty / Error；局部刷新优先保留已有内容。

Mock 演示区域可以保持固定展示，但数据文件必须明确标识 mock/demo。

## 操作层级

- 主操作保持当前页面视觉权重。
- 危险操作使用现有 AlertDialog，不用 window.confirm。
- 提交中防重复提交。
- 图标按钮提供 aria-label。
- Dialog 使用语义 Title/Description。

## 响应式

迁移和重构不能破坏当前窄屏行为。固定尺寸、overflow、导航隐藏等已有策略在没有视觉任务时保持原样。

## 动画

已有官网/产品展示动画可以保留。新增动画只用于状态变化，不为了“更高级”额外堆效果。

## AI 修改页面默认流程

1. 先读取现有页面和附近组件。
2. 优先复用当前 UI 组件。
3. 数据层重构默认零 UI 改动。
4. 需要拆组件时完整搬运原 JSX/style，不顺手美化。
5. 完成后检查 loading/empty/error、键盘与窄屏。

## 完成检查

- 视觉是否与改动前一致？
- 是否重复造基础 UI？
- 是否保留 Hash 路由相关交互？
- 是否补齐了真实请求状态？
- 是否误把 mock 数据展示成真实业务指标？
