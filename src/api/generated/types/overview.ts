/**
 * [INPUT]: 由 OpenAPI 的 overview schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 overview 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

/** 运营总览VO */
export interface OverviewVo {
  totalUserCount?: number /** 平台注册用户总数 */
  weeklyNewUserCount?: number /** 本周新增注册用户数量 */
  processingTaskCount?: number /** 进行中任务数量（处理中+待补充） */
  inProcessingTaskCount?: number /** 处于处理中的任务数量 */
  recent7DaysNewTaskCount?: number /** 近7天新增的任务数量 */
  totalDeliveredCount?: number /** 累计完成交付数量（已交付+已终止） */
  weeklyDeliveredCount?: number /** 本周交付数量 */
}

export interface ResultOverviewVo {
  message?: string
  code?: number
  data?: OverviewVo
}

export interface ResultTaskOverviewVo {
  message?: string
  code?: number
  data?: TaskOverviewVo
}

export interface ResultUserOverviewVo {
  message?: string
  code?: number
  data?: UserOverviewVo
}

/** 任务概览VO */
export interface TaskOverviewVo {
  processingCount?: number /** 处理中任务数量 */
  awaitSupplementCount?: number /** 待补充任务数量 */
  deliveredCount?: number /** 已交付任务数量 */
  terminatedCount?: number /** 已终止任务数量 */
}

/** 用户总览VO */
export interface UserOverviewVo {
  totalUserCount?: number /** 总注册用户数 */
  todayNewUserCount?: number /** 今日新增用户数量 */
  activeUserCountLast7Days?: number /** 近7天活跃的用户数量 */
  disabledUserCount?: number /** 当前禁用的账号数量 */
}
