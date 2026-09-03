import { resetPasswordSysUser, update1SysUser } from '@/api/generated/sys-user'
import type { ResetPasswordSo, SysUser } from '@/api/generated/types/sys-user'
import { unwrapApiResult } from '@/api/result'

export async function updateSysUser(payload: SysUser): Promise<boolean> {
  return unwrapApiResult(await update1SysUser(payload), '修改用户失败')
}

/** 重置用户密码为 123456 的 MD5（服务端固定值，请求体仅需 userId）。 */
export async function resetSysUserPassword(payload: ResetPasswordSo): Promise<boolean> {
  return unwrapApiResult(await resetPasswordSysUser(payload), '重置用户密码失败')
}

export type { ResetPasswordSo, SysUser } from '@/api/generated/types/sys-user'
