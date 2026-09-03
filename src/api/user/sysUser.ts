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
import type { ResetPasswordSo, SysUser, UserStatusSo } from '@/api/generated/types/sys-user'
import type { PageQuery, PageResult } from '@/api/pagination'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'

export async function addSysUser(payload: SysUser): Promise<SysUser> {
  return unwrapApiResult(await add1SysUser(payload), '新增用户失败')
}

export async function updateSysUser(payload: SysUser): Promise<boolean> {
  return unwrapApiResult(await update1SysUser(payload), '修改用户失败')
}

/** 禁用/启用用户账号（专用接口，勿用 update + deleted）。 */
export async function updateSysUserStatus(payload: UserStatusSo): Promise<boolean> {
  return unwrapApiResult(await updateUserStatusSysUser(payload), '更新用户状态失败')
}

/** 重置用户密码为 123456 的 MD5（服务端固定值，请求体仅需 userId）。 */
export async function resetSysUserPassword(payload: ResetPasswordSo): Promise<boolean> {
  return unwrapApiResult(await resetPasswordSysUser(payload), '重置用户密码失败')
}

export async function getSysUserById(id: number): Promise<SysUser> {
  return unwrapApiResult(await getDetailById1SysUser({ id }), '获取用户失败')
}

export async function pageSysUsers(query: PageQuery<SysUser>): Promise<PageResult<SysUser>> {
  return unwrapApiResultOr(
    await findPage1SysUser(query as Parameters<typeof findPage1SysUser>[0]),
    { records: [], total: 0 },
    '查询用户失败',
  )
}

export async function deleteSysUser(id: number): Promise<boolean> {
  return unwrapApiResult(await deleteOne1SysUser({ id }), '删除用户失败')
}

export async function batchDeleteSysUsers(ids: number[]): Promise<boolean> {
  return unwrapApiResult(await batchDel1SysUser({ ids }), '批量删除用户失败')
}

export type { ResetPasswordSo, SysUser, UserStatusSo } from '@/api/generated/types/sys-user'
export type { PageQuery, PageResult } from '@/api/pagination'
