import {
  add1SysUser,
  deleteOne1SysUser,
  findPage1SysUser,
  getCurrentUserSysUser,
  loginSysUser,
  registerSysUser,
  update1SysUser,
  updateUserStatusSysUser,
} from '@/api/generated/sys-user'
import type { SysUser, UserLoginVo } from '@/api/generated/types/sys-user'
import { unwrapApiResult, unwrapApiResultOr } from '@/api/result'
import { getToken } from '@/utils/auth'
import { md5Password } from '@/utils/md5'

export type UserRoleCode = NonNullable<SysUser['role']>

export interface AuthUser {
  id: number | string
  username?: string
  nickname?: string
  email?: string
  /** 前端归一化角色：admin | user */
  role?: string
  /** 后端原始角色码 */
  role_code?: UserRoleCode | string
  /** 对应 SysUser.enabled；未返回时视为启用 */
  is_active?: boolean
  created_at?: string
  updated_at?: string
  /** 对应 SysUser.lastLoginAt */
  last_login_at?: string
}

export interface AuthSession {
  token: string
  token_type: string
  /** 只有后端真实返回有效期时才设置；当前接口没有该字段，前端不自行发明 token 生命周期。 */
  expires_at_ms?: number
  user: AuthUser
}

function mapSysUser(user?: SysUser | null): AuthUser {
  if (user == null || user.id == null) throw new Error('登录返回缺少用户信息')

  const roleCode = String(user.role || 'USER').toUpperCase()
  return {
    id: user.id,
    username: user.username,
    nickname: user.username,
    email: '',
    role: roleCode === 'ADMIN' ? 'admin' : 'user',
    role_code: roleCode,
    is_active: user.enabled !== false,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    last_login_at: user.lastLoginAt,
  }
}

function toAuthSession(vo: UserLoginVo): AuthSession {
  const token = String(vo.token || '').trim()
  if (!token) throw new Error('登录返回缺少 token')

  return {
    token,
    token_type: 'X-token',
    user: mapSysUser(vo.user),
  }
}

export async function registerAuth(payload: {
  username: string
  email?: string
  password: string
  nickname?: string
  remember_me?: boolean
}): Promise<AuthSession> {
  // 当前注册契约只有 username + password；邮箱账号必须完整放进 username，不能在前端截断域名。
  const result = await registerSysUser({
    username: payload.username.trim(),
    password: md5Password(payload.password),
  })
  return toAuthSession(unwrapApiResult(result, '注册失败'))
}

export async function loginAuth(payload: {
  account: string
  password: string
  remember_me?: boolean
}): Promise<AuthSession> {
  const result = await loginSysUser({
    username: payload.account.trim(),
    password: md5Password(payload.password),
  })
  return toAuthSession(unwrapApiResult(result, '登录失败'))
}

export async function getCurrentUser(): Promise<AuthUser> {
  if (!getToken()) throw new Error('未登录')
  const result = await getCurrentUserSysUser()
  return mapSysUser(unwrapApiResult(result, '获取当前用户失败'))
}

/** 后端 OpenAPI 暂无登出接口，仅清理本地会话。 */
export async function logoutAuth(): Promise<unknown> {
  return null
}

export async function changePasswordAuth(_payload: {
  old_password: string
  new_password: string
}): Promise<unknown> {
  throw new Error('当前后端暂不支持修改密码')
}

export async function fetchAuthUsers(params?: {
  pageSize?: number
  pageCurrent?: number
  username?: string
  /** 后端角色码：ADMIN | USER；不传则返回全部角色 */
  role?: UserRoleCode
}): Promise<{ items: AuthUser[]; total: number }> {
  const entity: { username?: string; role?: UserRoleCode } = {}
  if (params?.username) entity.username = params.username
  if (params?.role) entity.role = params.role

  // OpenAPI 的 PageQuery.entity 泛型信息已丢失，只在 generated 边界转换。
  const result = await findPage1SysUser({
    pageSize: params?.pageSize ?? 10,
    pageCurrent: params?.pageCurrent ?? 1,
    entity: Object.keys(entity).length ? entity : undefined,
  } as Parameters<typeof findPage1SysUser>[0])
  const page = unwrapApiResultOr(result, { records: [], total: 0 }, '加载用户列表失败')

  const items: AuthUser[] = []
  for (const row of page.records || []) {
    try {
      items.push(mapSysUser(row))
    } catch {
      // 跳过缺少 id 的异常记录，避免一条脏数据让整个管理员列表不可用。
    }
  }
  return { items, total: Number(page.total || 0) }
}

export async function updateAuthUserStatus(
  userId: number | string,
  isActive: boolean,
): Promise<boolean> {
  const result = await updateUserStatusSysUser({ userId: Number(userId), enabled: isActive })
  return unwrapApiResult(result, '更新用户状态失败')
}

export async function createAuthUser(payload: {
  username: string
  password: string
  role?: UserRoleCode
}): Promise<AuthUser | null> {
  const result = await add1SysUser({
    username: payload.username.trim(),
    password: md5Password(payload.password),
    role: payload.role || 'USER',
  })
  const created = unwrapApiResult(result, '创建用户失败')
  return created.id == null ? null : mapSysUser(created)
}

export async function updateAuthUserRole(
  userId: number | string,
  role: UserRoleCode,
): Promise<boolean> {
  const result = await update1SysUser({ id: Number(userId), role })
  return unwrapApiResult(result, '更新用户角色失败')
}

export async function deleteAuthUser(userId: number | string): Promise<boolean> {
  const result = await deleteOne1SysUser({ id: Number(userId) })
  return unwrapApiResult(result, '删除用户失败')
}
