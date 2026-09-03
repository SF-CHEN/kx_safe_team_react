/**
 * [INPUT]: 由 OpenAPI 的 preset-scene schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 preset-scene 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PagePresetScene {
  records?: PresetScene[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PagePresetScene
  searchCount?: PagePresetScene
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

/** 预制场景表，原sys_dict中type=PRESET_SCENE的数据迁移至此 */
export interface PresetScene {
  id?: number /** 场景id */
  name?: string /** 场景名称 */
  dimensionIds?: string /** 场景包含的维度id集合，由小写逗号分隔，如:1,2,3，实体中用List<Integer>映射，由ArrayIntegerTypeHandler完成与数据库字符串的转换 */
  sortOrder?: number /** 排序值，越小越靠前，用于场景列表的展示顺序 */
  deleted?: boolean /** 软删除标记，false未删除，true已删除 */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 更新时间 */
  evaluationTaskType?: 'PERFORMANCE' | 'SAFETY' /** 评测任务类型 */
}

/** 预置场景VO */
export interface PresetSceneVo {
  sceneId?: number /** 场景id */
  sceneName?: string /** 场景名称 */
  dimensionNames?: string[] /** 场景下的所有子维度名称集合 */
}

export interface ResultBoolean {
  message?: string
  code?: number
  data?: boolean
}

export interface ResultListPresetSceneVo {
  message?: string
  code?: number
  data?: PresetSceneVo[]
}

export interface ResultPagePresetScene {
  message?: string
  code?: number
  data?: PagePresetScene
}

export interface ResultPresetScene {
  message?: string
  code?: number
  data?: PresetScene
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

/** PresetSceneParams 请求参数 */
export interface PresetSceneParams {
  evaluationTaskType: 'PERFORMANCE' | 'SAFETY'
}

/** GetDetailById4PresetSceneParams 请求参数 */
export interface GetDetailById4PresetSceneParams {
  id: number
}

/** DeleteOne4PresetSceneParams 请求参数 */
export interface DeleteOne4PresetSceneParams {
  id: number
}

/** BatchDel4PresetSceneParams 请求参数 */
export interface BatchDel4PresetSceneParams {
  ids: number[]
}
