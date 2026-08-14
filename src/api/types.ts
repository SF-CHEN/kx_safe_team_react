/** temp-maven / 业务后端共用 DTO */

export type UserRoleCode = 'ADMIN' | 'USER';

export interface SysUser {
  id?: number;
  username?: string;
  password?: string;
  role?: UserRoleCode | string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserLoginSo {
  username: string;
  password: string;
}

export interface UserLoginVo {
  user?: SysUser;
  token?: string;
}

export interface PageQuery<T = unknown> {
  pageSize?: number;
  pageCurrent?: number;
  orderColumn?: string;
  orderType?: string;
  entity?: T;
}

export interface PageResult<T> {
  records?: T[];
  total?: number;
  size?: number;
  current?: number;
  pages?: number;
}

export interface ModelTrustEvaluationTask {
  id?: number;
  userId?: number;
  fileId?: number;
  evaluationRequirement?: string;
  status?: string;
  emailStatus?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ModelDataSafetyEvaluationTask {
  id?: number;
  userId?: number;
  fileId?: number;
  evaluationRequirement?: string;
  status?: string;
  emailStatus?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** 大模型性能 / 安全等通用评测任务（evaluation-task） */
export type EvaluationUseModelType = 'BUILT_IN' | 'CUSTOM' | 'USER_MODEL';
export type EvaluationDimensionType = 'PRESET_SCENE' | 'CUSTOM';
export type EvaluationTaskStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'RUNNING'
  | 'SUCCESS'
  | 'FAILED';

/** 评测任务类型；亦用于预制场景 / 维度筛选 */
export type EvaluationTaskKind = 'PERFORMANCE' | 'SAFETY';

export interface EvaluationTask {
  id?: number;
  /** 评测任务类型：性能 / 安全 */
  type?: EvaluationTaskKind;
  name?: string;
  useModelType?: EvaluationUseModelType;
  modelId?: number;
  /** JSON 字符串：模型名称、baseUrl、apiKey */
  customModelConfig?: string;
  sampleSize?: number;
  evaluationDimensionType?: EvaluationDimensionType;
  /** 预制场景 id（PresetScene.id / PresetSceneVo.sceneId） */
  presumedSceneDimensionId?: number;
  /** 自定义维度 id 集合，逗号分隔，如 `1,2,3` */
  customDimensionIds?: string;
  needSendEmail?: boolean;
  email?: string;
  status?: EvaluationTaskStatus | string;
  hasSendEmail?: boolean;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  /** 需求补充（创建页「补充测试需求」） */
  demandSupplement?: string;
}

/** @deprecated 维度/场景已迁至 PresetScene / EvaluationDimension */
export type SysDictType = 'DIMENSION' | 'PRESET_SCENE';

/** @deprecated 请改用 PresetScene / EvaluationDimension */
export interface SysDict {
  id?: number;
  name?: string;
  value?: string;
  type?: SysDictType;
  pid?: number;
  remark?: string;
  icon?: string;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** 预制场景表（原 sys_dict PRESET_SCENE） */
export interface PresetScene {
  id?: number;
  name?: string;
  /** 维度 id 集合，逗号分隔，如 `1,2,3` */
  dimensionIds?: string;
  sortOrder?: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  evaluationTaskType?: EvaluationTaskKind;
}

/** 评测维度表（原 sys_dict DIMENSION，树形） */
export interface EvaluationDimension {
  id?: number;
  name?: string;
  /** 父维度 id，0 表示顶级 */
  parentId?: number;
  sortOrder?: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  evaluationTaskType?: EvaluationTaskKind;
}

export interface PresetSceneVo {
  sceneId?: number;
  sceneName?: string;
  dimensionNames?: string[];
}

/** @deprecated 请改用 TreeDropEvaluationDimension */
export interface TreeDropSysDict {
  id?: number;
  name?: string;
  data?: SysDict;
  childs?: TreeDropSysDict[];
}

export interface TreeDropEvaluationDimension {
  id?: number;
  name?: string;
  data?: EvaluationDimension;
  childs?: TreeDropEvaluationDimension[];
}

export type DepthModelType = 'BUILT_IN' | 'USER';

export interface DepthModel {
  id?: number;
  name?: string;
  baseUrl?: string;
  apiKey?: string;
  type?: DepthModelType;
  userId?: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseDropDepthModel {
  id?: number;
  name?: string;
  data?: DepthModel;
}

/** 公网用户上传文件（sys-file） */
export interface SysFile {
  id?: number;
  storagePath?: string;
  originalName?: string;
  size?: number;
  contentType?: string;
  userId?: number;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/** 评测任务总表（统一管理四种评测任务） */
export type EvaluationTaskMasterProductType =
  | 'PERFORMANCE'
  | 'SAFETY'
  | 'DATA_SAFETY'
  | 'TRUST';

export type EvaluationTaskMasterSubmitType = 'LOCAL_PROJECT_FILE' | 'USER_MODEL';

/** 总表正式状态；旧值 COMPLETED/FAILED/WAITING 仅兼容历史数据 */
export type EvaluationTaskMasterStatus =
  | 'PROCESSING'
  | 'AWAIT_SUPPLEMENT'
  | 'DELIVERED'
  | 'TERMINATED'
  | 'WAITING'
  | 'COMPLETED'
  | 'FAILED';

export type EvaluationTaskMasterHandleResult =
  | 'REQUEST_SUPPLEMENT'
  | 'TERMINATE';

export interface EvaluationTaskMaster {
  id?: number;
  name?: string;
  productType?: EvaluationTaskMasterProductType;
  /** 被测对象 */
  targetObject?: string;
  configSummary?: string;
  submitType?: EvaluationTaskMasterSubmitType;
  status?: EvaluationTaskMasterStatus | string;
  /** 关联具体任务表记录的主键 */
  taskRefId?: number;
  userId?: number;
  supplementFileId?: number;
  deliverFileId?: number;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

/** 管理员交付评测任务 */
export interface DeliverTaskSo {
  id: number;
  deliverFileId: number;
}

/** 管理员返回意见（补件 / 终止） */
export interface AdminReplySo {
  evaluationTaskMasterId: number;
  handleResult: EvaluationTaskMasterHandleResult;
  adminComment: string;
}

/** 用户补充评测材料 */
export interface SupplementMaterialSo {
  id: number;
  supplementFileId: number;
}

/** 评测任务总表详情 VO */
export interface EvaluationTaskMasterDetailVo {
  id?: number;
  evaluationRequirement?: string;
  username?: string;
  email?: string;
  configSummary?: string;
  materialName?: string;
  supplementFileId?: number;
  evaluationMaterialFileId?: number;
  evaluationMaterialName?: string;
  deliverFileId?: number;
  deliverFileName?: string;
  status?: EvaluationTaskMasterStatus | string;
  createdAt?: string;
}

/** 评测任务沟通记录 */
export interface EvaluationTaskMasterCommunication {
  id?: number;
  evaluationTaskMasterId?: number;
  handleResult?: EvaluationTaskMasterHandleResult;
  adminComment?: string;
  supplementFileName?: string;
  supplementFileId?: number;
  userReplied?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
}

/** 任务概览（我的 / 全站任务状态计数） */
export interface TaskOverviewVo {
  processingCount?: number;
  awaitSupplementCount?: number;
  deliveredCount?: number;
  terminatedCount?: number;
}

/** 运营总览 */
export interface OverviewVo {
  totalUserCount?: number;
  weeklyNewUserCount?: number;
  processingTaskCount?: number;
  inProcessingTaskCount?: number;
  recent7DaysNewTaskCount?: number;
  totalDeliveredCount?: number;
  weeklyDeliveredCount?: number;
}
