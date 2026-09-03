/**
 * OpenAPI 的通用 PageQuery 丢失了 entity 泛型信息。
 * 这里只补前端分页泛型，不复制任何业务 DTO；业务字段仍以 generated/types 为唯一来源。
 */
export interface PageQuery<T> {
  pageSize?: number
  pageCurrent?: number
  orderColumn?: string
  orderType?: string
  entity?: T
}

export interface PageResult<T> {
  records?: T[]
  total?: number
  size?: number
  current?: number
  pages?: number
}
