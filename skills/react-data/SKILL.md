---
name: react-data
description: 玄鉴项目 API、TanStack Query、Zustand、Mock、CRUD 与数据源边界规范。
---

# React 数据与状态 Skill

## 状态先归属

| 状态 | 使用方式 |
|---|---|
| 后端返回数据 | TanStack Query |
| 全局客户端状态 | Zustand |
| 当前组件 UI 状态 | React state |
| 普通筛选 | 页面 React state |
| 表单字段 | React Hook Form |
| 无完整后端能力 | 明确 Mock |

同一份正式业务数据只保留一个真实来源。

## API 层

- Axios 只在 `src/api` 使用。
- `src/api/request.ts` 负责 Axios 实例、鉴权、401/403 和基础错误。
- API 的直接相关 Input/Response/Query 类型就近定义。
- 页面不直接调用 Axios。
- 统一错误放请求层；页面只处理业务提示。

## TanStack Query

所有服务端列表、详情、概览、下拉、报告默认使用 Query。

不要再手写：

- request sequence 防竞态；
- 相同请求 Promise Map 去重；
- 页面 effect 中的 loading/error/cache；
- 失败冷却时间；
- 请求后复制一份服务器数据到 Zustand。

Mutation 成功后只 invalidate 真正受影响的 Query。

## 标准 CRUD

普通 CRUD 优先复用通用 `useCrud`；复杂依赖、多接口聚合、批量、特殊缓存时页面附近使用 `<name>.query.ts`。

筛选条件属于页面；通用分页可由 useCrud 管理。不要每页重复包装四套 useList/useCreate/useUpdate/useDelete。

## Mock

没有接口或接口不能覆盖当前 UI 业务时允许 Mock：

```text
src/mocks/<domain>/*.mock.ts
```

或页面私有 `*.mock.ts`。

规则：

- 名字必须明确 mock；
- 页面通过 service/adapter 消费；
- 不和正式后端列表写入同一个 localStorage/workflowStore；
- 真实 API 请求失败时不能 fallback 成本地“真实成功”；
- 营销演示数据可以长期静态存在。

## Zustand

适合：会话客户端信息、全局 UI 状态、跨页面但非服务器来源的状态。

不适合：任务列表、用户列表、模型列表、服务端分页、Query loading/error。

## API DTO

不要使用一个全 optional DTO 同时表示新增、更新、查询和返回。

优先：

```ts
interface CreateEvaluationTaskInput {}
interface EvaluationTask {}
interface EvaluationTaskQuery {}
```

表单字段与 Input 一致时直接提交 values，不逐字段重抄。

## 并行与缓存

独立请求并行执行；有依赖才串行。不要自建和 TanStack Query 重复的缓存。

## 完成检查

- 页面是否直接使用 Axios？
- 服务端数据是否错误进入 Zustand/localStorage？
- 是否仍用 effect 手写 Query 能力？
- mock 与真实 API 是否清晰分层？
- API Input/Response 是否职责明确？
