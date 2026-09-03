import {
  myTaskOverview,
  operationalOverview,
  taskOverview,
  userOverview,
} from '@/api/generated/overview'
import type { OverviewVo, TaskOverviewVo, UserOverviewVo } from '@/api/generated/types/overview'
import { unwrapApiResultOr } from '@/api/result'

/** 管理后台运营总览统计。 */
export async function fetchOperationalOverview(): Promise<OverviewVo> {
  return unwrapApiResultOr(await operationalOverview(), {}, '加载运营总览失败')
}

/** 管理后台用户管理 KPI。 */
export async function fetchUserOverview(): Promise<UserOverviewVo> {
  return unwrapApiResultOr(await userOverview(), {}, '加载用户总览失败')
}

/** 当前登录用户的任务状态概览（资源中心统计卡）。 */
export async function fetchMyTaskOverview(): Promise<TaskOverviewVo> {
  return unwrapApiResultOr(await myTaskOverview(), {}, '加载我的任务概览失败')
}

/** 全站任务概览（管理端按状态拆分时复用）。 */
export async function fetchTaskOverview(): Promise<TaskOverviewVo> {
  return unwrapApiResultOr(await taskOverview(), {}, '加载任务概览失败')
}

export type { OverviewVo, TaskOverviewVo, UserOverviewVo } from '@/api/generated/types/overview'
