import { createTempClient } from '@/api/client';
import type { SysUser, UserLoginVo, UserRoleCode } from '@/api/types';
import { updateSysUserStatus } from '@/api/user/sysUser';
import { getToken } from '@/utils/auth';
import { unwrapGatewayData } from '@/utils/gateway';
import { md5Password } from '@/utils/md5';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface AuthUser {
  id: number | string;
  username?: string;
  nickname?: string;
  email?: string;
  /** 前端归一化角色：admin | user */
  role?: string;
  /** 后端原始角色码 */
  role_code?: UserRoleCode | string;
  /** 对应 SysUser.enabled；未返回时视为启用 */
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  /** 对应 SysUser.lastLoginAt */
  last_login_at?: string;
}

export interface AuthSession {
  token: string;
  token_type: string;
  expires_at_ms: number;
  user: AuthUser;
}

function mapSysUser(user?: SysUser | null): AuthUser {
  if (user == null || user.id == null) {
    throw new Error('登录返回缺少用户信息');
  }
  const roleCode = String(user.role || 'USER').toUpperCase();
  return {
    id: user.id as number | string,
    username: user.username,
    nickname: user.username,
    email: '',
    role: roleCode === 'ADMIN' ? 'admin' : 'user',
    role_code: roleCode,
    // 账号启停以 enabled 为准；缺省视为启用（勿再用 deleted 冒充）
    is_active: user.enabled !== false,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    last_login_at: user.lastLoginAt,
  };
}

function toAuthSession(vo: UserLoginVo, rememberMe = false): AuthSession {
  const token = String(vo.token || '').trim();
  if (!token) throw new Error('登录返回缺少 token');
  return {
    token,
    token_type: 'X-token',
    expires_at_ms: Date.now() + (rememberMe ? 15 : 1) * DAY_MS,
    user: mapSysUser(vo.user),
  };
}

export async function registerAuth(payload: {
  username: string;
  email?: string;
  password: string;
  nickname?: string;
  remember_me?: boolean;
}): Promise<AuthSession> {
  const client = createTempClient();
  const { data } = await client.post(
    '/temp/sys-user/register',
    {
      username: payload.username,
      password: md5Password(payload.password),
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
  const vo = unwrapGatewayData<UserLoginVo>(data);
  return toAuthSession(vo, Boolean(payload.remember_me));
}

export async function loginAuth(payload: {
  account: string;
  password: string;
  remember_me?: boolean;
}): Promise<AuthSession> {
  const client = createTempClient();
  const { data } = await client.post(
    '/temp/sys-user/login',
    {
      username: payload.account,
      password: md5Password(payload.password),
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
  const vo = unwrapGatewayData<UserLoginVo>(data);
  return toAuthSession(vo, Boolean(payload.remember_me));
}

export async function getCurrentUser(): Promise<AuthUser> {
  if (!getToken()) throw new Error('未登录');
  const client = createTempClient();
  const { data } = await client.get('/temp/sys-user/getCurrentUser');
  return mapSysUser(unwrapGatewayData<SysUser>(data));
}

/** 新后端暂无登出接口，仅清理本地会话 */
export async function logoutAuth(): Promise<unknown> {
  return null;
}

export async function changePasswordAuth(_payload: {
  old_password: string;
  new_password: string;
}): Promise<unknown> {
  throw new Error('当前后端暂不支持修改密码');
}

export async function fetchAuthUsers(params?: {
  pageSize?: number;
  pageCurrent?: number;
  username?: string;
  /** 后端角色码：ADMIN | USER；不传则返回全部角色 */
  role?: UserRoleCode;
}): Promise<{ items: AuthUser[]; total: number }> {
  const client = createTempClient();
  const entity: { username?: string; role?: UserRoleCode } = {};
  if (params?.username) entity.username = params.username;
  if (params?.role) entity.role = params.role;
  const { data } = await client.post(
    '/temp/sys-user/page',
    {
      pageSize: params?.pageSize ?? 10,
      pageCurrent: params?.pageCurrent ?? 1,
      entity: Object.keys(entity).length ? entity : undefined,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
  const page = unwrapGatewayData<{ records?: SysUser[]; total?: number }>(data);
  const items: AuthUser[] = [];
  for (const row of page.records || []) {
    try {
      items.push(mapSysUser(row));
    } catch {
      // 跳过缺少 id 的异常记录
    }
  }
  return {
    items,
    total: Number(page.total || 0),
  };
}

export async function updateAuthUserStatus(
  userId: number | string,
  isActive: boolean,
): Promise<unknown> {
  return updateSysUserStatus({
    userId: Number(userId),
    enabled: isActive,
  });
}

export async function createAuthUser(payload: {
  username: string;
  password: string;
  role?: UserRoleCode;
}): Promise<AuthUser | null> {
  const client = createTempClient();
  const { data } = await client.post(
    '/temp/sys-user/add',
    {
      username: payload.username.trim(),
      password: md5Password(payload.password),
      role: payload.role || 'USER',
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
  const created = unwrapGatewayData<SysUser | boolean | null>(data);
  if (created && typeof created === 'object' && 'id' in created && created.id != null) {
    return mapSysUser(created);
  }
  // 部分后端 add 只返回成功标记，不回传用户对象
  return null;
}

export async function updateAuthUserRole(
  userId: number | string,
  role: UserRoleCode,
): Promise<unknown> {
  const client = createTempClient();
  const { data } = await client.put(
    '/temp/sys-user/update',
    {
      id: Number(userId),
      role,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return unwrapGatewayData(data);
}

export async function deleteAuthUser(userId: number | string): Promise<unknown> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/sys-user/deleteOne', {
    params: { id: Number(userId) },
  });
  return unwrapGatewayData(data);
}
