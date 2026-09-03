/**
 * [INPUT]: 由 OpenAPI 的 user-contact paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 user-contact 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDelUserContactParams,
  DeleteOneUserContactParams,
  GetDetailByIdUserContactParams,
  PageQuery,
  ResultBoolean,
  ResultPageUserContact,
  ResultUserContact,
  UserContact,
  UserContactSubmitSo,
} from './types/user-contact'
import { requestData } from '@/api/request'

/** 修改用户联系记录 */
export function updateUserContact(data: UserContact): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/user-contact/update`,
    method: 'PUT',
    data,
  })
}

/** 用户填报联系信息 */
export function submitUserContact(data: UserContactSubmitSo): Promise<ResultUserContact> {
  return requestData<ResultUserContact>({
    url: `/temp/user-contact/submit`,
    method: 'POST',
    data,
  })
}

/** 分页查询用户联系记录 */
export function findPageUserContact(data: PageQuery): Promise<ResultPageUserContact> {
  return requestData<ResultPageUserContact>({
    url: `/temp/user-contact/page`,
    method: 'POST',
    data,
  })
}

/** 新增用户联系记录 */
export function addUserContact(data: UserContact): Promise<ResultUserContact> {
  return requestData<ResultUserContact>({
    url: `/temp/user-contact/add`,
    method: 'POST',
    data,
  })
}

/** 获取用户联系记录 */
export function getDetailByIdUserContact(params: GetDetailByIdUserContactParams): Promise<ResultUserContact> {
  return requestData<ResultUserContact>({
    url: `/temp/user-contact/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 删除用户联系记录 */
export function deleteOneUserContact(params: DeleteOneUserContactParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/user-contact/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除用户联系记录 */
export function batchDelUserContact(params: BatchDelUserContactParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/user-contact/batchDel`,
    method: 'DELETE',
    params,
  })
}
