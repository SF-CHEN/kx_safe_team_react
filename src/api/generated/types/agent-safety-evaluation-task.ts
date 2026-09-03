/**
 * [INPUT]: 由 OpenAPI 的 agent-safety-evaluation-task schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 agent-safety-evaluation-task 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

/** 智能体安全评测任务表 */
export interface AgentSafetyEvaluationTask {
  id?: number /** 自增主键ID */
  userId?: number /** 用户ID，关联sys_user.id */
  fileId?: number /** 用户上传的ZIP文件ID，关联sys_file.id */
  evaluationRequirement?: string /** 评测诉求 */
  status?: string /** 任务状态：PENDING-待执行、QUEUED-排队中、RUNNING-执行中、SUCCESS-执行成功、FAILED-执行失败 */
  emailStatus?: string /** 邮件发送状态，默认NOT_SENT-未发送 */
  deleted?: boolean /** 软删除标记：false-未删除、true-已删除 */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 更新时间，由应用更新时维护 */
}

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PageAgentSafetyEvaluationTask {
  records?: AgentSafetyEvaluationTask[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageAgentSafetyEvaluationTask
  searchCount?: PageAgentSafetyEvaluationTask
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

export interface ResultAgentSafetyEvaluationTask {
  message?: string
  code?: number
  data?: AgentSafetyEvaluationTask
}

export interface ResultBoolean {
  message?: string
  code?: number
  data?: boolean
}

export interface ResultPageAgentSafetyEvaluationTask {
  message?: string
  code?: number
  data?: PageAgentSafetyEvaluationTask
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

/** GetDetailById11AgentSafetyEvaluationTaskParams 请求参数 */
export interface GetDetailById11AgentSafetyEvaluationTaskParams {
  id: number
}

/** DeleteOne11AgentSafetyEvaluationTaskParams 请求参数 */
export interface DeleteOne11AgentSafetyEvaluationTaskParams {
  id: number
}

/** BatchDel11AgentSafetyEvaluationTaskParams 请求参数 */
export interface BatchDel11AgentSafetyEvaluationTaskParams {
  ids: number[]
}
