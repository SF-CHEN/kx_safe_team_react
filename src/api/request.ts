/**
 * [INPUT]: Axios、鉴权 token、temp-maven 业务网关与统一错误处理
 * [OUTPUT]: 对外提供 tempRequest、createTempClient 和自动生成 API 使用的 requestData<T>
 * [POS]: 业务 API HTTP 基础设施；生成 API 与手写业务 API 统一经过这里，页面不直接依赖 Axios
 */
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

import { getXTokenHeader } from '@/utils/auth'
import {
  extractGatewayErrorMessage,
  getTempApiBase,
  notifyUnauthorized,
  type GatewayError,
} from '@/utils/gateway'

const tempClients = new Map<number, AxiosInstance>()

function createConfiguredTempClient(timeout: number): AxiosInstance {
  const client = axios.create({
    baseURL: getTempApiBase(),
    timeout,
    withCredentials: false,
  })

  client.interceptors.request.use((config) => {
    Object.assign(config.headers, getXTokenHeader())
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status as number | undefined
      if (status === 401 || status === 403) notifyUnauthorized()

      const normalized = new Error(extractGatewayErrorMessage(error)) as GatewayError
      normalized.status = status
      normalized.response = error.response
      return Promise.reject(normalized)
    },
  )

  return client
}

/** 相同 timeout 共用 Axios 实例；少量长任务手写 API 可以按需传入独立 timeout。 */
export function createTempClient(timeout = 30_000): AxiosInstance {
  const cached = tempClients.get(timeout)
  if (cached) return cached

  const client = createConfiguredTempClient(timeout)
  tempClients.set(timeout, client)
  return client
}

export const tempRequest = createTempClient()

/**
 * OpenAPI 自动生成代码的唯一请求入口。
 *
 * WHY: 生成器只关心 url/method/data/params，不重复鉴权、baseURL 和错误处理；
 * 页面和 Query 因此可以直接获得后端响应 data，而不是 AxiosResponse。
 */
export async function requestData<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await tempRequest.request<T>(config)
  return response.data
}
