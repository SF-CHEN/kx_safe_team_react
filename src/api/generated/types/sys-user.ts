/**
 * [INPUT]: 由 OpenAPI 的 sys-user schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 sys-user 模块的 DTO 与请求参数类型
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

export interface PageSysUser {
  records?: SysUser[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageSysUser
  searchCount?: PageSysUser
  optimizeJoinOfCountSql?: boolean
  maxLimit?: number
  countId?: string
  pages?: number
}

/** 重置用户密码请求参数 */
export interface ResetPasswordSo {
  userId: number /** 目标用户id */
}

export interface ResultBoolean {
  message?: string
  code?: number
  data?: boolean
}

export interface ResultPageSysUser {
  message?: string
  code?: number
  data?: PageSysUser
}

export interface ResultSysUser {
  message?: string
  code?: number
  data?: SysUser
}

export interface ResultUserLoginVo {
  message?: string
  code?: number
  data?: UserLoginVo
}

/** 首页用户 */
export interface SysUser {
  id?: number /** id */
  username?: string
  password?: string
  role?: 'ADMIN' | 'USER' /** 用户角色 */
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
  lastLoginAt?: string /** 最近登录时间 */
  enabled?: boolean /** 是否启用：true-启用、false-禁用 */
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

/** 用户登录请求参数 */
export interface UserLoginSo {
  username: string /** 用户名 */
  password: string /** 密码 */
}

/** 用户登录返回VO */
export interface UserLoginVo {
  user?: SysUser /** 用户信息 */
  token?: string /** JWT token */
}

/** 禁用/启用用户账号请求参数 */
export interface UserStatusSo {
  userId: number /** 目标用户id */
  enabled: boolean /** 是否启用：true-启用、false-禁用 */
}

/** GetDetailById1SysUserParams 请求参数 */
export interface GetDetailById1SysUserParams {
  id: number
}

/** DeleteOne1SysUserParams 请求参数 */
export interface DeleteOne1SysUserParams {
  id: number
}

/** BatchDel1SysUserParams 请求参数 */
export interface BatchDel1SysUserParams {
  ids: number[]
}
