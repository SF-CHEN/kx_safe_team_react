import { createTempClient } from '@/api/client';
import type { OverviewVo, TaskOverviewVo, UserOverviewVo } from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

/** 管理后台运营总览统计 */
export async function fetchOperationalOverview(): Promise<OverviewVo> {
  const client = createTempClient();
  const { data } = await client.get('/temp/overview/operationalOverview');
  return unwrapGatewayData<OverviewVo>(data) || {};
}

/** 管理后台用户管理 KPI */
export async function fetchUserOverview(): Promise<UserOverviewVo> {
  const client = createTempClient();
  const { data } = await client.get('/temp/overview/userOverview');
  return unwrapGatewayData<UserOverviewVo>(data) || {};
}

/** 当前登录用户的任务状态概览（资源中心统计卡） */
export async function fetchMyTaskOverview(): Promise<TaskOverviewVo> {
  const client = createTempClient();
  const { data } = await client.get('/temp/overview/myTaskOverview');
  return unwrapGatewayData<TaskOverviewVo>(data) || {};
}

/** 全站任务概览（若管理端需要按状态拆分时可复用） */
export async function fetchTaskOverview(): Promise<TaskOverviewVo> {
  const client = createTempClient();
  const { data } = await client.get('/temp/overview/taskOverview');
  return unwrapGatewayData<TaskOverviewVo>(data) || {};
}
