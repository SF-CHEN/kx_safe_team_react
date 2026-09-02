import { tempRequest } from '@/api/request'
import type { OverviewVo, TaskOverviewVo, UserOverviewVo } from '@/api/types'
import { unwrapGatewayData } from '@/utils/gateway'

/** 管理后台运营总览统计。 */
export async function fetchOperationalOverview(): Promise<OverviewVo> {
  const { data } = await tempRequest.get('/temp/overview/operationalOverview')
  return unwrapGatewayData<OverviewVo>(data) || {}
}

/** 管理后台用户管理 KPI。 */
export async function fetchUserOverview(): Promise<UserOverviewVo> {
  const { data } = await tempRequest.get('/temp/overview/userOverview')
  return unwrapGatewayData<UserOverviewVo>(data) || {}
}

/** 当前登录用户的任务状态概览（资源中心统计卡）。 */
export async function fetchMyTaskOverview(): Promise<TaskOverviewVo> {
  const { data } = await tempRequest.get('/temp/overview/myTaskOverview')
  return unwrapGatewayData<TaskOverviewVo>(data) || {}
}

/** 全站任务概览（管理端按状态拆分时复用）。 */
export async function fetchTaskOverview(): Promise<TaskOverviewVo> {
  const { data } = await tempRequest.get('/temp/overview/taskOverview')
  return unwrapGatewayData<TaskOverviewVo>(data) || {}
}
