// 兼容旧 API 文件；新代码统一从 request.ts 使用请求基础设施。
export { createTempClient, tempRequest, tempRequest as tempClient } from './request'
