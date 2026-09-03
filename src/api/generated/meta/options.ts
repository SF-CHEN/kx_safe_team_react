/**
 * [INPUT]: 依赖 OpenAPI 枚举说明、./enums.ts 和 script/option-label-overrides.cjs 的人工 label 覆盖
 * [OUTPUT]: 对外提供人工覆盖优先、Swagger 中文说明其次、英文枚举值兜底的 Select、Radio、Checkbox 选项
 * [POS]: src/api/generated/meta 的自动生成选项文件，与 enums.ts 保持一一对应
 */
import { SysUserRoleEnum, SysDictTypeEnum, PresetSceneEvaluationTaskTypeEnum, DepthModelTypeEnum, EvaluationTaskUseModelTypeEnum, EvaluationTaskEvaluationDimensionTypeEnum, EvaluationTaskStatusEnum, EvaluationTaskMasterProductTypeEnum, EvaluationTaskMasterSubmitTypeEnum, EvaluationTaskMasterStatusEnum, AdminReplySoHandleResultEnum } from './enums'

/** 用户角色 下拉选项 */
export const SysUserRoleOptions = [
  { label: 'ADMIN', value: SysUserRoleEnum.ADMIN },
  { label: 'USER', value: SysUserRoleEnum.USER },
] as const

/** 字典类型，维度、预设场景 下拉选项 */
export const SysDictTypeOptions = [
  { label: '维度', value: SysDictTypeEnum.DIMENSION },
  { label: '预设场景', value: SysDictTypeEnum.PRESET_SCENE },
] as const

/** 评测任务类型 下拉选项 */
export const PresetSceneEvaluationTaskTypeOptions = [
  { label: 'PERFORMANCE', value: PresetSceneEvaluationTaskTypeEnum.PERFORMANCE },
  { label: 'SAFETY', value: PresetSceneEvaluationTaskTypeEnum.SAFETY },
] as const

/** 模型类型，分为内置模型和用户模型 下拉选项 */
export const DepthModelTypeOptions = [
  { label: '内置模型', value: DepthModelTypeEnum.BUILT_IN },
  { label: '用户模型', value: DepthModelTypeEnum.USER },
] as const

/** 使用的模型类型（内置模型、自定义、用户模型） 下拉选项 */
export const EvaluationTaskUseModelTypeOptions = [
  { label: '内置模型', value: EvaluationTaskUseModelTypeEnum.BUILT_IN },
  { label: '自定义', value: EvaluationTaskUseModelTypeEnum.CUSTOM },
  { label: '用户模型', value: EvaluationTaskUseModelTypeEnum.USER_MODEL },
] as const

/** 评测维度类型（预设场景维度、自定义评测维度） 下拉选项 */
export const EvaluationTaskEvaluationDimensionTypeOptions = [
  { label: '预设场景维度', value: EvaluationTaskEvaluationDimensionTypeEnum.PRESET_SCENE },
  { label: '自定义评测维度', value: EvaluationTaskEvaluationDimensionTypeEnum.CUSTOM },
] as const

/** 任务状态 下拉选项 */
export const EvaluationTaskStatusOptions = [
  { label: 'PENDING', value: EvaluationTaskStatusEnum.PENDING },
  { label: 'QUEUED', value: EvaluationTaskStatusEnum.QUEUED },
  { label: 'RUNNING', value: EvaluationTaskStatusEnum.RUNNING },
  { label: 'SUCCESS', value: EvaluationTaskStatusEnum.SUCCESS },
  { label: 'FAILED', value: EvaluationTaskStatusEnum.FAILED },
] as const

/** 所属产品：PERFORMANCE-大模型性能评测、SAFETY-大模型安全评测、DATA_SAFETY-模型数据安全评测、TRUST-模型可信评测、AGENT_SAFETY-智能体安全评测 下拉选项 */
export const EvaluationTaskMasterProductTypeOptions = [
  { label: '大模型性能评测', value: EvaluationTaskMasterProductTypeEnum.PERFORMANCE },
  { label: '大模型安全评测', value: EvaluationTaskMasterProductTypeEnum.SAFETY },
  { label: '模型数据安全评测', value: EvaluationTaskMasterProductTypeEnum.DATA_SAFETY },
  { label: '模型可信评测', value: EvaluationTaskMasterProductTypeEnum.TRUST },
  { label: '智能体安全评测', value: EvaluationTaskMasterProductTypeEnum.AGENT_SAFETY },
] as const

/** 提交方式：LOCAL_PROJECT_FILE-本地工程文件、USER_MODEL-用户模型 下拉选项 */
export const EvaluationTaskMasterSubmitTypeOptions = [
  { label: '本地工程文件', value: EvaluationTaskMasterSubmitTypeEnum.LOCAL_PROJECT_FILE },
  { label: '用户模型', value: EvaluationTaskMasterSubmitTypeEnum.USER_MODEL },
] as const

/** 当前状态：PROCESSING-处理中、AWAIT_SUPPLEMENT-待补充、DELIVERED-已交付、TERMINATED-已终止 下拉选项 */
export const EvaluationTaskMasterStatusOptions = [
  { label: '处理中', value: EvaluationTaskMasterStatusEnum.PROCESSING },
  { label: '待补充', value: EvaluationTaskMasterStatusEnum.AWAIT_SUPPLEMENT },
  { label: '已交付', value: EvaluationTaskMasterStatusEnum.DELIVERED },
  { label: '已终止', value: EvaluationTaskMasterStatusEnum.TERMINATED },
] as const

/** 处理结果：REQUEST_SUPPLEMENT-请求用户补件、TERMINATE-终止任务 下拉选项 */
export const AdminReplySoHandleResultOptions = [
  { label: '请求用户补件', value: AdminReplySoHandleResultEnum.REQUEST_SUPPLEMENT },
  { label: '终止任务', value: AdminReplySoHandleResultEnum.TERMINATE },
] as const
