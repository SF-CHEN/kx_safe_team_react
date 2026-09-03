/**
 * [INPUT]: 由 OpenAPI 的 sys-dict paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 sys-dict 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel3SysDictParams,
  DeleteOne3SysDictParams,
  GetDetailById3SysDictParams,
  PageQuery,
  ResultBoolean,
  ResultPageSysDict,
  ResultSysDict,
  SysDict,
} from './types/sys-dict'
import { requestData } from '@/api/request'

/** 修改 */
export function update2SysDict(data: SysDict): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-dict/update`,
    method: 'PUT',
    data,
  })
}

/** 分页查询 */
export function findPage3SysDict(data: PageQuery): Promise<ResultPageSysDict> {
  return requestData<ResultPageSysDict>({
    url: `/temp/sys-dict/page`,
    method: 'POST',
    data,
  })
}

/** 新增 */
export function add2SysDict(data: SysDict): Promise<ResultSysDict> {
  return requestData<ResultSysDict>({
    url: `/temp/sys-dict/add`,
    method: 'POST',
    data,
  })
}

/** 获取 */
export function getDetailById3SysDict(params: GetDetailById3SysDictParams): Promise<ResultSysDict> {
  return requestData<ResultSysDict>({
    url: `/temp/sys-dict/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除 */
export function deleteOne3SysDict(params: DeleteOne3SysDictParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-dict/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除 */
export function batchDel3SysDict(params: BatchDel3SysDictParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-dict/batchDel`,
    method: 'DELETE',
    params,
  })
}
