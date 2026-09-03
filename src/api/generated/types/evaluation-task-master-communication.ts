/**
 * [INPUT]: 由 OpenAPI 的 evaluation-task-master-communication schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 evaluation-task-master-communication 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

/** 管理员返回意见请求参数 */
export interface AdminReplySo {
  evaluationTaskMasterId: number /** 评测任务总表id */
  handleResult: 'REQUEST_SUPPLEMENT' | 'TERMINATE' /** 处理结果：REQUEST_SUPPLEMENT-请求用户补件、TERMINATE-终止任务 */
  adminComment: string /** 管理员意见说明 */
}

/** 评测任务沟通记录表（管理员与任务所属用户围绕评测任务总表的沟通记录） */
export interface EvaluationTaskMasterCommunication {
  id?: number /** 主键id */
  evaluationTaskMasterId?: number /** 关联的评测任务总表id */
  handleResult?: 'REQUEST_SUPPLEMENT' | 'TERMINATE' /** 处理结果：REQUEST_SUPPLEMENT-请求用户补件、TERMINATE-终止任务 */
  adminComment?: string /** 管理员意见说明 */
  supplementFileName?: string /** 用户补充文件名称 */
  supplementFileId?: number /** 用户补充文件id，关联sys_file.id */
  userReplied?: boolean /** 用户是否回复，false未回复，true已回复 */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 修改时间 */
  deleted?: boolean /** 软删除标记 */
}

export interface ResultBoolean {
  message?: string
  code?: number
  data?: boolean
}

export interface ResultListEvaluationTaskMasterCommunication {
  message?: string
  code?: number
  data?: EvaluationTaskMasterCommunication[]
}

/** ListByMasterIdEvaluationTaskMasterCommunicationParams 请求参数 */
export interface ListByMasterIdEvaluationTaskMasterCommunicationParams {
  evaluationTaskMasterId: number
}
