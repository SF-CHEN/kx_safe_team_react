import axios, { type AxiosInstance } from 'axios';
import { getXTokenHeader } from '@/utils/auth';
import {
  extractGatewayErrorMessage,
  getTempApiBase,
  notifyUnauthorized,
  type GatewayError,
} from '@/utils/gateway';

const tempClients = new Map<number, AxiosInstance>();

/**
 * 创建 temp-maven 客户端。
 *
 * 相同 timeout 的请求复用同一个 axios instance，避免每个 API 调用都重复创建实例和注册拦截器。
 * 特殊长耗时接口仍可通过 createTempClient(customTimeout) 获取对应 timeout 的复用实例。
 */
function createConfiguredTempClient(timeout: number): AxiosInstance {
  const client = axios.create({
    baseURL: getTempApiBase(),
    timeout,
    withCredentials: false,
  });

  client.interceptors.request.use((config) => {
    Object.assign(config.headers, getXTokenHeader());
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status as number | undefined;
      if (status === 401 || status === 403) {
        notifyUnauthorized();
      }
      const err = new Error(extractGatewayErrorMessage(error)) as GatewayError;
      err.status = status;
      err.response = error.response;
      return Promise.reject(err);
    },
  );

  return client;
}

/** 对接 temp-maven（api.json）的 axios 客户端 */
export function createTempClient(timeout = 30_000): AxiosInstance {
  const cached = tempClients.get(timeout);
  if (cached) return cached;

  const client = createConfiguredTempClient(timeout);
  tempClients.set(timeout, client);
  return client;
}

/** 默认业务请求客户端；新代码优先直接复用该实例。 */
export const tempClient = createTempClient();
