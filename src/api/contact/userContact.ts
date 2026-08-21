import { createTempClient } from '@/api/client';
import type { UserContact, UserContactSubmitSo } from '@/api/types';
import { unwrapGatewayData } from '@/utils/gateway';

export type { UserContact, UserContactSubmitSo } from '@/api/types';

/** 前台填报联系信息（个人敏感信息审查 / 具身智能等产品页） */
export async function submitUserContact(payload: UserContactSubmitSo): Promise<UserContact> {
  const client = createTempClient();
  const { data } = await client.post('/temp/user-contact/submit', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return unwrapGatewayData<UserContact>(data);
}
