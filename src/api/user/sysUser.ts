import {
  add1SysUser,
  batchDel1SysUser,
  deleteOne1SysUser,
  findPage1SysUser,
  getDetailById1SysUser,
  resetPasswordSysUser,
  update1SysUser,
  updateUserStatusSysUser,
} from '@/api/generated/sys-user'
import type { SysUser as GeneratedSysUser } from '@/api/generated/types/sys-user'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import type { PageQuery, PageResult, ResetPasswordSo, SysUser, UserStatusSo } from '@/api/types'

export type { PageQuery, PageResult, ResetPasswordSo, SysUser, UserStatusSo } from '@/api/types'

export async function addSysUser(payload: SysUser): Promise<SysUser> {
  const result = await add1SysUser(payload as GeneratedSysUser)
  return unwrapApiResult(result, '新增用户失败') as SysUser
}

export async function updateSysUser(payload: SysUser): Promise<boolean> {
  const result = await update1SysUser(payload as GeneratedSysUser)
  return unwrapApiResult(result, '修改用户失败')
}

/** 禁用/启用用户账号（专用接口，勿用 update + deleted）。 */
export async function updateSysUserStatus(payload: UserStatusSo): Promise<boolean> {
  const result = await updateUserStatusSysUser(payload)
  return unwrapApiResult(result, '更新用户状态失败')
}

/** 重置用户密码为 123456 的 MD5（服务端固定值，请求体仅需 userId）。 */
export async function resetSysUserPassword(payload: ResetPasswordSo): Promise<boolean> {
  const result = await resetPasswordSysUser(payload)
  return unwrapApiResult(result, '重置用户密码失败')
}

export async function getSysUserById(id: number): Promise<SysUser> {
  const result = await getDetailById1SysUser({ id })
  return unwrapApiResult(result, '获取用户失败') as SysUser
}

export async function pageSysUsers(
  query: PageQuery<SysUser>,
): Promise<PageResult<SysUser>> {
  // OpenAPI 未保留 PageQuery.entity 泛型，只在 generated 边界转换。
  const result = await findPage1SysUser(query as Parameters<typeof findPage1SysUser>[0])
  return unwrapApiResultOr(result, { records: [], total: 0 }, '查询用户失败') as PageResult<SysUser>
}

export async function deleteSysUser(id: number): Promise<boolean> {
  const result = await deleteOne1SysUser({ id })
  return unwrapApiResult(result, '删除用户失败')
}

export async function batchDeleteSysUsers(ids: number[]): Promise<boolean> {
  const result = await batchDel1SysUser({ ids })
  return unwrapApiResult(result, '批量删除用户失败')
}
