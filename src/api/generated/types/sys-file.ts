/**
 * [INPUT]: 由 OpenAPI 的 sys-file schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 sys-file 模块的 DTO 与请求参数类型
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

export interface PageSysFile {
  records?: SysFile[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageSysFile
  searchCount?: PageSysFile
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

export interface ResultPageSysFile {
  message?: string
  code?: number
  data?: PageSysFile
}

export interface ResultSysFile {
  message?: string
  code?: number
  data?: SysFile
}

/** 文件表，公网用户上传的文件信息，磁盘文件存放于local_save_path配置目录 */
export interface SysFile {
  id?: number /** 文件id，评测任务等通过file_id关联 */
  storagePath?: string /** 磁盘存储相对路径，如:20260807/ab12cd34-....pdf，与local_save_path拼接得到完整路径，使用uuid命名避免路径穿越和重名 */
  originalName?: string /** 原始文件名，仅用于下载时还原展示，不参与磁盘存储 */
  size?: number /** 文件大小，单位字节 */
  contentType?: string /** 文件类型，服务端校验后的MIME类型 */
  userId?: number /** 上传用户id，关联sys_user.id */
  deleted?: boolean /** 软删除标记，false未删除，true已删除 */
  createdAt?: string /** 上传时间 */
  updatedAt?: string /** 更新时间 */
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

/** GetDetailById2SysFileParams 请求参数 */
export interface GetDetailById2SysFileParams {
  id: number
}

/** DownloadSysFileParams 请求参数 */
export interface DownloadSysFileParams {
  id: number
}

/** DeleteOne2SysFileParams 请求参数 */
export interface DeleteOne2SysFileParams {
  id: number
}

/** BatchDel2SysFileParams 请求参数 */
export interface BatchDel2SysFileParams {
  ids: number[]
}
