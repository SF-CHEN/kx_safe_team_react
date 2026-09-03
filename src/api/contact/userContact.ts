import { submitUserContact as submitUserContactApi } from '@/api/generated/user-contact'
import { unwrapApiResult } from '@/api/result'
import type { UserContact, UserContactSubmitSo } from '@/api/types'

export type { UserContact, UserContactSubmitSo } from '@/api/types'

/** 前台填报联系信息（产品页「联系我们」/ 专家咨询预约）。 */
export async function submitUserContact(payload: UserContactSubmitSo): Promise<UserContact> {
  const result = await submitUserContactApi(payload)
  return unwrapApiResult(result, '提交联系信息失败') as UserContact
}
