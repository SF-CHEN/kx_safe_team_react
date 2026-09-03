/**
 * [INPUT]: 由 OpenAPI 的 depth-model paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 depth-model 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel10DepthModelParams,
  DeleteOne10DepthModelParams,
  DepthModel,
  DropdownDepthModelParams,
  GetDetailById10DepthModelParams,
  PageQuery,
  ResultBoolean,
  ResultDepthModel,
  ResultListBaseDropDepthModel,
  ResultPageDepthModel,
} from './types/depth-model'
import { requestData } from '@/api/request'

/** 修改 */
export function update7DepthModel(data: DepthModel): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/depth-model/update`,
    method: 'PUT',
    data,
  })
}

/** 分页查询 */
export function findPage10DepthModel(data: PageQuery): Promise<ResultPageDepthModel> {
  return requestData<ResultPageDepthModel>({
    url: `/temp/depth-model/page`,
    method: 'POST',
    data,
  })
}

/** 新增 */
export function add8DepthModel(data: DepthModel): Promise<ResultDepthModel> {
  return requestData<ResultDepthModel>({
    url: `/temp/depth-model/add`,
    method: 'POST',
    data,
  })
}

/** 获取 */
export function getDetailById10DepthModel(params: GetDetailById10DepthModelParams): Promise<ResultDepthModel> {
  return requestData<ResultDepthModel>({
    url: `/temp/depth-model/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 模型下拉 */
export function dropdownDepthModel(params: DropdownDepthModelParams): Promise<ResultListBaseDropDepthModel> {
  return requestData<ResultListBaseDropDepthModel>({
    url: `/temp/depth-model/dropdown`,
    method: 'GET',
    params,
  })
}

/** 删除 */
export function deleteOne10DepthModel(params: DeleteOne10DepthModelParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/depth-model/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除 */
export function batchDel10DepthModel(params: BatchDel10DepthModelParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/depth-model/batchDel`,
    method: 'DELETE',
    params,
  })
}
