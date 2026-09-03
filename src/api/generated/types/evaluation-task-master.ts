/**
 * [INPUT]: 由 OpenAPI 的 evaluation-task-master schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 evaluation-task-master 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

/** 管理员交付评测任务请求参数 */
export interface DeliverTaskSo {
  id: number /** 评测任务总表id */
  deliverFileId: number /** 交付文件id，关联sys_file.id */
}

/** 评测任务总表（统一管理四种评测任务） */
export interface EvaluationTaskMaster {
  id?: number /** 主键id */
  name?: string /** 任务名称 */
  productType?: 'PERFORMANCE' | 'SAFETY' | 'DATA_SAFETY' | 'TRUST' | 'AGENT_SAFETY' /** 所属产品：PERFORMANCE-大模型性能评测、SAFETY-大模型安全评测、DATA_SAFETY-模型数据安全评测、TRUST-模型可信评测、AGENT_SAFETY-智能体安全评测 */
  targetObject?: string /** 被测对象 */
  configSummary?: string /** 配置摘要 */
  submitType?: 'LOCAL_PROJECT_FILE' | 'USER_MODEL' /** 提交方式：LOCAL_PROJECT_FILE-本地工程文件、USER_MODEL-用户模型 */
  status?: 'PROCESSING' | 'AWAIT_SUPPLEMENT' | 'DELIVERED' | 'TERMINATED' /** 当前状态：PROCESSING-处理中、AWAIT_SUPPLEMENT-待补充、DELIVERED-已交付、TERMINATED-已终止 */
  taskRefId?: number /** 关联具体任务表记录的主键 */
  userId?: number /** 创建用户的id */
  supplementFileId?: number /** 补充材料文件id，关联sys_file.id */
  deliverFileId?: number /** 交付文件id，关联sys_file.id */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 修改时间 */
  deleted?: boolean /** 逻辑删除标记 */
}

/** 评测任务总表详情VO */
export interface EvaluationTaskMasterDetailVo {
  id?: number /** 任务id */
  evaluationRequirement?: string /** 评测诉求 */
  username?: string /** 提交用户的username */
  email?: string /** 邮箱 */
  configSummary?: string /** 配置摘要 */
  materialName?: string /** 用户提交的材料名称 */
  supplementFileId?: number /** 提交的补充材料id */
  evaluationMaterialFileId?: number /** 用户提交的评测材料id */
  evaluationMaterialName?: string /** 评测材料名称 */
  deliverFileId?: number /** 交付文件id */
  deliverFileName?: string /** 交付文件名称 */
  status?: 'PROCESSING' | 'AWAIT_SUPPLEMENT' | 'DELIVERED' | 'TERMINATED' /** 任务状态 */
  createdAt?: string /** 创建时间 */
}

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PageEvaluationTaskMaster {
  records?: EvaluationTaskMaster[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageEvaluationTaskMaster
  searchCount?: PageEvaluationTaskMaster
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

export interface ResultEvaluationTaskMasterDetailVo {
  message?: string
  code?: number
  data?: EvaluationTaskMasterDetailVo
}

export interface ResultPageEvaluationTaskMaster {
  message?: string
  code?: number
  data?: PageEvaluationTaskMaster
}

/** 用户补充评测材料请求参数 */
export interface SupplementMaterialSo {
  id: number /** 评测任务总表id */
  supplementFileId: number /** 补充材料文件id，关联sys_file.id */
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

/** GetDetailById8EvaluationTaskMasterParams 请求参数 */
export interface GetDetailById8EvaluationTaskMasterParams {
  id: number
}

/** DeleteOne8EvaluationTaskMasterParams 请求参数 */
export interface DeleteOne8EvaluationTaskMasterParams {
  id: number
}

/** BatchDel8EvaluationTaskMasterParams 请求参数 */
export interface BatchDel8EvaluationTaskMasterParams {
  ids: number[]
}
