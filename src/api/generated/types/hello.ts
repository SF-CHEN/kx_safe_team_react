/**
 * [INPUT]: 由 OpenAPI 的 hello schema、请求参数与响应模型生成
 * [OUTPUT]: 对外提供 hello 模块的 DTO 与请求参数类型
 * [POS]: src/api/generated/types 的自动生成类型文件，为同名 API 模块提供类型约束
 */

export interface ResultString {
  message?: string
  code?: number
  data?: string
}
