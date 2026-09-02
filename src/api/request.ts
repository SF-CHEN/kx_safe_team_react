/**
 * [INPUT]: Axios、鉴权 token 与统一网关错误处理
 * [OUTPUT]: temp-maven 业务请求实例与按 timeout 复用的客户端工厂
 * [POS]: 真实业务 API 的 HTTP 基础设施；页面与 UI 不直接依赖 Axios
 */
import axios, { type AxiosInstance } from 'axios'

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

/** 相同 timeout 共用 Axios 实例；长任务可以传入独立 timeout。 */
export function createTempClient(timeout = 30_000): AxiosInstance {
  const cached = tempClients.get(timeout)
  if (cached) return cached

  const client = createConfiguredTempClient(timeout)
  tempClients.set(timeout, client)
  return client
}

export const tempRequest = createTempClient()
