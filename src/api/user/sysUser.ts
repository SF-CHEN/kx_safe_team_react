import { createTempClient } from '@/api/client';
import type { PageQuery, PageResult, SysUser } from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

export type { PageQuery, PageResult, SysUser } from '@/api/types';

export async function addSysUser(payload: SysUser): Promise<SysUser> {
  const client = createTempClient();
  const { data } = await client.post('/temp/sys-user/add', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<SysUser>(data);
}

export async function updateSysUser(payload: SysUser): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.put('/temp/sys-user/update', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function getSysUserById(id: number): Promise<SysUser> {
  const client = createTempClient();
  const { data } = await client.get('/temp/sys-user/getDetailById', {
    params: { id },
  });
  return unwrapGatewayData<SysUser>(data);
}

export async function pageSysUsers(
  query: PageQuery<SysUser>,
): Promise<PageResult<SysUser>> {
  const client = createTempClient();
  const { data } = await client.post('/temp/sys-user/page', query, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<PageResult<SysUser>>(data);
}

export async function deleteSysUser(id: number): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/sys-user/deleteOne', {
    params: { id },
  });
  return unwrapGatewayData<boolean>(data);
}

export async function batchDeleteSysUsers(ids: number[]): Promise<boolean> {
  const client = createTempClient();
  const { data } = await client.delete('/temp/sys-user/batchDel', {
    params: { ids },
    paramsSerializer: { indexes: null },
  });
  return unwrapGatewayData<boolean>(data);
}
