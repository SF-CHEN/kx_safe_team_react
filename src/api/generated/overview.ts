/**
 * [INPUT]: 由 OpenAPI 的 overview paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 overview 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type { ResultOverviewVo, ResultTaskOverviewVo, ResultUserOverviewVo } from './types/overview'
import { requestData } from '@/api/request'

/** 用户总览查看 */
export function userOverview(): Promise<ResultUserOverviewVo> {
  return requestData<ResultUserOverviewVo>({
    url: `/temp/overview/userOverview`,
    method: 'GET',
  })
}

/** 任务概览查看 */
export function taskOverview(): Promise<ResultTaskOverviewVo> {
  return requestData<ResultTaskOverviewVo>({
    url: `/temp/overview/taskOverview`,
    method: 'GET',
  })
}

/** 运营总览查看 */
export function operationalOverview(): Promise<ResultOverviewVo> {
  return requestData<ResultOverviewVo>({
    url: `/temp/overview/operationalOverview`,
    method: 'GET',
  })
}

/** 我的任务概览查看 */
export function myTaskOverview(): Promise<ResultTaskOverviewVo> {
  return requestData<ResultTaskOverviewVo>({
    url: `/temp/overview/myTaskOverview`,
    method: 'GET',
  })
}
