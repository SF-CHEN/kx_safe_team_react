/**
 * [INPUT]: 由 OpenAPI 的 sys-user paths 生成，并依赖 @/api/request 的 requestData
 * [OUTPUT]: 对外提供 sys-user 模块的类型安全 API 请求函数
 * [POS]: src/api/generated 的自动生成 API 模块，供页面 Query 或 src/api 手写业务封装调用
 */
import type {
  BatchDel1SysUserParams,
  DeleteOne1SysUserParams,
  GetDetailById1SysUserParams,
  PageQuery,
  ResetPasswordSo,
  ResultBoolean,
  ResultPageSysUser,
  ResultSysUser,
  ResultUserLoginVo,
  SysUser,
  UserLoginSo,
  UserStatusSo,
} from './types/sys-user'
import { requestData } from '@/api/request'

/** 修改首页用户 */
export function update1SysUser(data: SysUser): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-user/update`,
    method: 'PUT',
    data,
  })
}

/** 禁用/启用用户账号 */
export function updateUserStatusSysUser(data: UserStatusSo): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-user/updateUserStatus`,
    method: 'POST',
    data,
  })
}

/** 重置用户密码为123456的MD5编码 */
export function resetPasswordSysUser(data: ResetPasswordSo): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-user/resetPassword`,
    method: 'POST',
    data,
  })
}

/** 用户注册 */
export function registerSysUser(data: UserLoginSo): Promise<ResultUserLoginVo> {
  return requestData<ResultUserLoginVo>({
    url: `/temp/sys-user/register`,
    method: 'POST',
    data,
  })
}

/** 分页查询首页用户 */
export function findPage1SysUser(data: PageQuery): Promise<ResultPageSysUser> {
  return requestData<ResultPageSysUser>({
    url: `/temp/sys-user/page`,
    method: 'POST',
    data,
  })
}

/** 用户登录 */
export function loginSysUser(data: UserLoginSo): Promise<ResultUserLoginVo> {
  return requestData<ResultUserLoginVo>({
    url: `/temp/sys-user/login`,
    method: 'POST',
    data,
  })
}

/** 新增首页用户 */
export function add1SysUser(data: SysUser): Promise<ResultSysUser> {
  return requestData<ResultSysUser>({
    url: `/temp/sys-user/add`,
    method: 'POST',
    data,
  })
}

/** 获取首页用户 */
export function getDetailById1SysUser(params: GetDetailById1SysUserParams): Promise<ResultSysUser> {
  return requestData<ResultSysUser>({
    url: `/temp/sys-user/getDetailById`,
    method: 'GET',
    params,
  })
}

/** 获取当前登录用户信息 */
export function getCurrentUserSysUser(): Promise<ResultSysUser> {
  return requestData<ResultSysUser>({
    url: `/temp/sys-user/getCurrentUser`,
    method: 'GET',
  })
}

/** 删除首页用户 */
export function deleteOne1SysUser(params: DeleteOne1SysUserParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-user/deleteOne`,
    method: 'DELETE',
    params,
  })
}

/** 批量删除首页用户 */
export function batchDel1SysUser(params: BatchDel1SysUserParams): Promise<ResultBoolean> {
  return requestData<ResultBoolean>({
    url: `/temp/sys-user/batchDel`,
    method: 'DELETE',
    params,
  })
}
