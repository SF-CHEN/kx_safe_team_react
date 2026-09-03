/**
 * [INPUT]: 由 OpenAPI schema 中的 enum 字段生成
 * [OUTPUT]: 对外提供后端枚举对应的常量对象与字面量联合类型
 * [POS]: src/api/generated/meta 的自动生成枚举文件，为页面和表单提供稳定枚举值
 */

/** 用户角色 */
export const SysUserRoleEnum = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const

export type SysUserRole = (typeof SysUserRoleEnum)[keyof typeof SysUserRoleEnum]

/** 字典类型，维度、预设场景 */
export const SysDictTypeEnum = {
  DIMENSION: 'DIMENSION',
  PRESET_SCENE: 'PRESET_SCENE',
} as const

export type SysDictType = (typeof SysDictTypeEnum)[keyof typeof SysDictTypeEnum]

/** 评测任务类型 */
export const PresetSceneEvaluationTaskTypeEnum = {
  PERFORMANCE: 'PERFORMANCE',
  SAFETY: 'SAFETY',
} as const

export type PresetSceneEvaluationTaskType = (typeof PresetSceneEvaluationTaskTypeEnum)[keyof typeof PresetSceneEvaluationTaskTypeEnum]

/** 模型类型，分为内置模型和用户模型 */
export const DepthModelTypeEnum = {
  BUILT_IN: 'BUILT_IN',
  USER: 'USER',
} as const

export type DepthModelType = (typeof DepthModelTypeEnum)[keyof typeof DepthModelTypeEnum]

/** 使用的模型类型（内置模型、自定义、用户模型） */
export const EvaluationTaskUseModelTypeEnum = {
  BUILT_IN: 'BUILT_IN',
  CUSTOM: 'CUSTOM',
  USER_MODEL: 'USER_MODEL',
} as const

export type EvaluationTaskUseModelType = (typeof EvaluationTaskUseModelTypeEnum)[keyof typeof EvaluationTaskUseModelTypeEnum]

/** 评测维度类型（预设场景维度、自定义评测维度） */
export const EvaluationTaskEvaluationDimensionTypeEnum = {
  PRESET_SCENE: 'PRESET_SCENE',
  CUSTOM: 'CUSTOM',
} as const

export type EvaluationTaskEvaluationDimensionType = (typeof EvaluationTaskEvaluationDimensionTypeEnum)[keyof typeof EvaluationTaskEvaluationDimensionTypeEnum]

/** 任务状态 */
export const EvaluationTaskStatusEnum = {
  PENDING: 'PENDING',
  QUEUED: 'QUEUED',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const

export type EvaluationTaskStatus = (typeof EvaluationTaskStatusEnum)[keyof typeof EvaluationTaskStatusEnum]

/** 所属产品：PERFORMANCE-大模型性能评测、SAFETY-大模型安全评测、DATA_SAFETY-模型数据安全评测、TRUST-模型可信评测、AGENT_SAFETY-智能体安全评测 */
export const EvaluationTaskMasterProductTypeEnum = {
  PERFORMANCE: 'PERFORMANCE',
  SAFETY: 'SAFETY',
  DATA_SAFETY: 'DATA_SAFETY',
  TRUST: 'TRUST',
  AGENT_SAFETY: 'AGENT_SAFETY',
} as const

export type EvaluationTaskMasterProductType = (typeof EvaluationTaskMasterProductTypeEnum)[keyof typeof EvaluationTaskMasterProductTypeEnum]

/** 提交方式：LOCAL_PROJECT_FILE-本地工程文件、USER_MODEL-用户模型 */
export const EvaluationTaskMasterSubmitTypeEnum = {
  LOCAL_PROJECT_FILE: 'LOCAL_PROJECT_FILE',
  USER_MODEL: 'USER_MODEL',
} as const

export type EvaluationTaskMasterSubmitType = (typeof EvaluationTaskMasterSubmitTypeEnum)[keyof typeof EvaluationTaskMasterSubmitTypeEnum]

/** 当前状态：PROCESSING-处理中、AWAIT_SUPPLEMENT-待补充、DELIVERED-已交付、TERMINATED-已终止 */
export const EvaluationTaskMasterStatusEnum = {
  PROCESSING: 'PROCESSING',
  AWAIT_SUPPLEMENT: 'AWAIT_SUPPLEMENT',
  DELIVERED: 'DELIVERED',
  TERMINATED: 'TERMINATED',
} as const

export type EvaluationTaskMasterStatus = (typeof EvaluationTaskMasterStatusEnum)[keyof typeof EvaluationTaskMasterStatusEnum]

/** 处理结果：REQUEST_SUPPLEMENT-请求用户补件、TERMINATE-终止任务 */
export const AdminReplySoHandleResultEnum = {
  REQUEST_SUPPLEMENT: 'REQUEST_SUPPLEMENT',
  TERMINATE: 'TERMINATE',
} as const

export type AdminReplySoHandleResult = (typeof AdminReplySoHandleResultEnum)[keyof typeof AdminReplySoHandleResultEnum]
