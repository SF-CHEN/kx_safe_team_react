/**
 * [INPUT]: 由 OpenAPI 的 model-data-safety-evaluation-task schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 model-data-safety-evaluation-task 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

/** 模型数据安全评测任务表 */
export interface ModelDataSafetyEvaluationTask {
  userId?: number /** 用户ID */
  fileId?: number /** 文件ID */
  evaluationRequirement?: string /** 评测诉求 */
  status?: string /** 状态 */
  emailStatus?: string /** 邮件发送状态 */
  deleted?: boolean /** 软删除标记 */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 更新时间 */
  id?: number /** id */
}

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PageModelDataSafetyEvaluationTask {
  records?: ModelDataSafetyEvaluationTask[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageModelDataSafetyEvaluationTask
  searchCount?: PageModelDataSafetyEvaluationTask
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

export interface ResultModelDataSafetyEvaluationTask {
  message?: string
  code?: number
  data?: ModelDataSafetyEvaluationTask
}

export interface ResultPageModelDataSafetyEvaluationTask {
  message?: string
  code?: number
  data?: PageModelDataSafetyEvaluationTask
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

/** GetDetailById6ModelDataSafetyEvaluationTaskParams 请求参数 */
export interface GetDetailById6ModelDataSafetyEvaluationTaskParams {
  id: number
}

/** DeleteOne6ModelDataSafetyEvaluationTaskParams 请求参数 */
export interface DeleteOne6ModelDataSafetyEvaluationTaskParams {
  id: number
}

/** BatchDel6ModelDataSafetyEvaluationTaskParams 请求参数 */
export interface BatchDel6ModelDataSafetyEvaluationTaskParams {
  ids: number[]
}
