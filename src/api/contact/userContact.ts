import { submitUserContact as submitUserContactApi } from '@/api/generated/user-contact'
import type { UserContact, UserContactSubmitSo } from '@/api/generated/types/user-contact'
import { unwrapApiResult } from '@/api/result'

export type { UserContact, UserContactSubmitSo } from '@/api/generated/types/user-contact'

/** 前台填报联系信息（产品页「联系我们」/ 专家咨询预约）。 */
export async function submitUserContact(payload: UserContactSubmitSo): Promise<UserContact> {
  return unwrapApiResult(await submitUserContactApi(payload), '提交联系信息失败')
}
