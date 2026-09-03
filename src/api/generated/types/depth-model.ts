/**
 * [INPUT]: 由 OpenAPI 的 depth-model schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 depth-model 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

export interface BaseDropDepthModel {
  id?: number
  name?: string
  data?: DepthModel
}

export interface DepthModel {
  id?: number /** id */
  name?: string /** 模型名称 */
  baseUrl?: string /** 模型url */
  apiKey?: string /** 模型apikey */
  type?: 'BUILT_IN' | 'USER' /** 模型类型，分为内置模型和用户模型 */
  userId?: number /** 用户id，当模型类型为用户模型的时候生效 */
  deleted?: boolean /** 软删除标记 */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 更新时间 */
}

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PageDepthModel {
  records?: DepthModel[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageDepthModel
  searchCount?: PageDepthModel
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number
}

export interface PageQuery {
  pageSize?: number /** 分页大小 */
  pageCurrent?: number /** 当前页 */
  orderColumn?: string /** 排序字段 */
  orderType?: string /** 排序方式 */
  entity?: UserContact /** 实体参数 */
}

export interface ResultBoolean {
  message?: string
  code?: number
  data?: boolean
}

export interface ResultDepthModel {
  message?: string
  code?: number
  data?: DepthModel
}

export interface ResultListBaseDropDepthModel {
  message?: string
  code?: number
  data?: BaseDropDepthModel[]
}

export interface ResultPageDepthModel {
  message?: string
  code?: number
  data?: PageDepthModel
}

/** 用户联系记录 */
export interface UserContact {
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 修改时间 */
  deleted?: boolean /** 软删除标记，false未删除，true已删除 */
  id?: number
  replied?: boolean /** 是否回复用户，false未回复，true已回复 */
  userName?: string /** 用户名称 */
  compantName?: string /** 公司名称 */
  contactInformation?: string /** 联系方式 */
  requirementDescription?: string /** 需求描述 */
  contactResult?: string /** 联系结果 */
}

/** GetDetailById10DepthModelParams 请求参数 */
export interface GetDetailById10DepthModelParams {
  id: number
}

/** DropdownDepthModelParams 请求参数 */
export interface DropdownDepthModelParams {
  type?: 'BUILT_IN' | 'USER'
}

/** DeleteOne10DepthModelParams 请求参数 */
export interface DeleteOne10DepthModelParams {
  id: number
}

/** BatchDel10DepthModelParams 请求参数 */
export interface BatchDel10DepthModelParams {
  ids: number[]
}
