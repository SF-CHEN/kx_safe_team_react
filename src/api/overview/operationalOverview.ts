import {
  myTaskOverview,
  operationalOverview,
  taskOverview,
  userOverview,
} from '@/api/generated/overview'
import { unwrapApiResultOr } from '@/api/result'
import type { OverviewVo, TaskOverviewVo, UserOverviewVo } from '@/api/types'

/** 管理后台运营总览统计。 */
export async function fetchOperationalOverview(): Promise<OverviewVo> {
  const result = await operationalOverview()
  return unwrapApiResultOr(result, {}, '加载运营总览失败') as OverviewVo
}

/** 管理后台用户管理 KPI。 */
export async function fetchUserOverview(): Promise<UserOverviewVo> {
  const result = await userOverview()
  return unwrapApiResultOr(result, {}, '加载用户总览失败') as UserOverviewVo
}

/** 当前登录用户的任务状态概览（资源中心统计卡）。 */
export async function fetchMyTaskOverview(): Promise<TaskOverviewVo> {
  const result = await myTaskOverview()
  return unwrapApiResultOr(result, {}, '加载我的任务概览失败') as TaskOverviewVo
}

/** 全站任务概览（管理端按状态拆分时复用）。 */
export async function fetchTaskOverview(): Promise<TaskOverviewVo> {
  const result = await taskOverview()
  return unwrapApiResultOr(result, {}, '加载任务概览失败') as TaskOverviewVo
}
