/**
 * [INPUT]: 由 OpenAPI 的 user-contact schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 user-contact 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PageQuery {
  pageSize?: number /** 分页大小 */
  pageCurrent?: number /** 当前页 */
  orderColumn?: string /** 排序字段 */
  orderType?: string /** 排序方式 */
  entity?: UserContact /** 实体参数 */
}

export interface PageUserContact {
  records?: UserContact[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageUserContact
  searchCount?: PageUserContact
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number
}

export interface ResultBoolean {
  message?: string
  code?: number
  data?: boolean
}

export interface ResultPageUserContact {
  message?: string
  code?: number
  data?: PageUserContact
}

export interface ResultUserContact {
  message?: string
  code?: number
  data?: UserContact
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

/** 用户联系填报 */
export interface UserContactSubmitSo {
  userName: string /** 姓名 */
  companyName: string /** 公司 */
  contactInformation: string /** 联系方式 */
  requirementDescription: string /** 需求描述 */
}

/** GetDetailByIdUserContactParams 请求参数 */
export interface GetDetailByIdUserContactParams {
  id: number
}

/** DeleteOneUserContactParams 请求参数 */
export interface DeleteOneUserContactParams {
  id: number
}

/** BatchDelUserContactParams 请求参数 */
export interface BatchDelUserContactParams {
  ids: number[]
}
