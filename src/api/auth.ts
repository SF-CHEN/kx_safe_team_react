import { createTempClient } from '@/api/client';
import type { SysUser, UserLoginVo } from '@/api/types';
import { getToken } from '@/utils/auth';
import { unwrapGatewayData } from '@/utils/gateway';
import { md5Password } from '@/utils/md5';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface AuthUser {
  id: number | string;
  username?: string;
  nickname?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
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
  const role = String(user.role || 'USER').toUpperCase();
  return {
    id: user.id as number | string,
    username: user.username,
    nickname: user.username,
    email: '',
    role: role === 'ADMIN' ? 'admin' : 'user',
    is_active: user.deleted !== true,
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
}): Promise<{ items: AuthUser[]; total: number }> {
  const client = createTempClient();
  const { data } = await client.post(
    '/temp/sys-user/page',
    {
      pageSize: params?.pageSize ?? 10,
      pageCurrent: params?.pageCurrent ?? 1,
      entity: params?.username ? { username: params.username } : undefined,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
  const page = unwrapGatewayData<{ records?: SysUser[]; total?: number }>(data);
  return {
    items: (page.records || []).map((row) => mapSysUser(row)),
    total: Number(page.total || 0),
  };
}

export async function updateAuthUserStatus(
  userId: number | string,
  isActive: boolean,
): Promise<unknown> {
  const client = createTempClient();
  const { data } = await client.put(
    '/temp/sys-user/update',
    {
      id: Number(userId),
      deleted: !isActive,
    },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return unwrapGatewayData(data);
}
