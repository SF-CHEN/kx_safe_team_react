const TOKEN_KEY = 'AITeachToken'

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | undefined {
  return localStorage.getItem(TOKEN_KEY) ?? undefined
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}

/** temp-maven 后端鉴权头（api.json securitySchemes.X-token）。 */
export function getXTokenHeader(): Record<string, string> {
  const token = getToken()
  if (!token) return {}
  return { 'X-token': token }
}
