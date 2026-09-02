export interface MockForgotPasswordRequest {
  account: string
}

export interface MockForgotPasswordResult {
  accepted: true
  account: string
}

/**
 * 当前后端尚未提供忘记密码/重置申请接口。
 * 这里明确保留 mock 边界，让页面交互可继续演示；后续有真实接口时只替换该数据源。
 */
export async function mockForgotPasswordRequest(
  input: MockForgotPasswordRequest,
): Promise<MockForgotPasswordResult> {
  const account = input.account.trim()
  if (!account) throw new Error('请输入账号')

  await Promise.resolve()
  return { accepted: true, account }
}
