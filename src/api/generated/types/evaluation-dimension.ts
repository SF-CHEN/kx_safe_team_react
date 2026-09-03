/**
 * [INPUT]: 由 OpenAPI 的 evaluation-dimension schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 evaluation-dimension 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

/** 评测维度表，树形结构，原sys_dict中type=DIMENSION的数据迁移至此 */
export interface EvaluationDimension {
  id?: number /** 维度id */
  name?: string /** 维度名称 */
  parentId?: number /** 父维度id，0表示顶级维度，支撑维度下拉树的父子结构 */
  sortOrder?: number /** 排序值，越小越靠前，用于同级维度的展示顺序 */
  deleted?: boolean /** 软删除标记，false未删除，true已删除 */
  createdAt?: string /** 创建时间 */
  updatedAt?: string /** 更新时间 */
  evaluationTaskType?: 'PERFORMANCE' | 'SAFETY' /** 评测任务类型 */
}

export interface OrderItem {
  column?: string
  asc?: boolean
}

export interface PageEvaluationDimension {
  records?: EvaluationDimension[]
  total?: number
  size?: number
  current?: number
  orders?: OrderItem[]
  optimizeCountSql?: PageEvaluationDimension
  searchCount?: PageEvaluationDimension
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

export interface ResultEvaluationDimension {
  message?: string
  code?: number
  data?: EvaluationDimension
}

export interface ResultListTreeDropEvaluationDimension {
  message?: string
  code?: number
  data?: TreeDropEvaluationDimension[]
}

export interface ResultPageEvaluationDimension {
  message?: string
  code?: number
  data?: PageEvaluationDimension
}

export interface TreeDropEvaluationDimension {
  id?: number
  name?: string
  data?: EvaluationDimension
  childs?: TreeDropEvaluationDimension[]
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

/** GetDetailById9EvaluationDimensionParams 请求参数 */
export interface GetDetailById9EvaluationDimensionParams {
  id: number
}

/** DimensionDropdownEvaluationDimensionParams 请求参数 */
export interface DimensionDropdownEvaluationDimensionParams {
  evaluationTaskType: 'PERFORMANCE' | 'SAFETY'
}

/** DeleteOne9EvaluationDimensionParams 请求参数 */
export interface DeleteOne9EvaluationDimensionParams {
  id: number
}

/** BatchDel9EvaluationDimensionParams 请求参数 */
export interface BatchDel9EvaluationDimensionParams {
  ids: number[]
}
