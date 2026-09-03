/**
 * [INPUT]: 由 OpenAPI 的 evaluation-task schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 evaluation-task 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

/** 评测任务 */
export interface EvaluationTask {
  id?: number /** id */
  type?: 'PERFORMANCE' | 'SAFETY' /** 评测任务类型 */
  name?: string /** 评测任务名称 */
  useModelType?: 'BUILT_IN' | 'CUSTOM' | 'USER_MODEL' /** 使用的模型类型（内置模型、自定义、用户模型） */
  modelId?: number /** 模型id，当use_model_type为内置模型和用户模型的时候生效 */
  customModelConfig?: string /** 自定义的模型配置信息，是一个json对象，包含模型名称、baseUrl、apiKey */
  sampleSize?: number /** 样本数量 */
  evaluationDimensionType?: 'PRESET_SCENE' | 'CUSTOM' /** 评测维度类型（预设场景维度、自定义评测维度） */
  presumedSceneDimensionId?: number /** 预设场景维度id，当evaluation_dimension_type是预设场景维度的时候使生效 */
  customDimensionIds?: string /** 自定义维度id集合，当evaluation_dimension_type是自定义评测维度的时候生效 */
  needSendEmail?: boolean /** 是否需要在任务完成后发送邮件 */
  email?: string /** 邮件地址 */
  status?: 'PENDING' | 'QUEUED' | 'RUNNING' | 'SUCCESS' | 'FAILED' /** 任务状态 */
  hasSendEmail?: boolean /** 是否已经发送邮件 */
  deleted?: boolean /** 软删除标记 */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 更新时间 */
  userId?: number /** 创建用户的id */
  demandSupplement?: string /** 需求补充 */
}

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PageEvaluationTask {
  records?: EvaluationTask[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageEvaluationTask
  searchCount?: PageEvaluationTask
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

export interface ResultEvaluationTask {
  message?: string
  code?: number
  data?: EvaluationTask
}

export interface ResultPageEvaluationTask {
  message?: string
  code?: number
  data?: PageEvaluationTask
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

/** GetDetailById7EvaluationTaskParams 请求参数 */
export interface GetDetailById7EvaluationTaskParams {
  id: number
}

/** DeleteOne7EvaluationTaskParams 请求参数 */
export interface DeleteOne7EvaluationTaskParams {
  id: number
}

/** BatchDel7EvaluationTaskParams 请求参数 */
export interface BatchDel7EvaluationTaskParams {
  ids: number[]
}
