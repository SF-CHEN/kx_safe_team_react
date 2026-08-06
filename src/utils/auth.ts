const TOKEN_KEY = 'AITeachToken';
const EXPIRES_KEY = 'AITeachTokenExpires';
const REMEMBER_KEY = 'AITeachRemember';

/**
 * 登录态统一落 localStorage。
 * 原因：「立即体验」等入口会 window.open 新标签，sessionStorage 按标签隔离导致丢登录。
 * remember_me 仍传给后端控制过期时长；前端只负责跨标签可读。
 */
function migrateSessionTokenIfNeeded(): void {
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  if (!sessionToken) return;
  if (localStorage.getItem(TOKEN_KEY)) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_KEY);
    return;
  }
  localStorage.setItem(TOKEN_KEY, sessionToken);
  const expires = sessionStorage.getItem(EXPIRES_KEY);
  if (expires) localStorage.setItem(EXPIRES_KEY, expires);
  if (localStorage.getItem(REMEMBER_KEY) == null) {
    localStorage.setItem(REMEMBER_KEY, '0');
  }
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
}

export function removeToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRES_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export function setToken(token: string, expiresAtMs?: number, remember = false): void {
  removeToken();
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresAtMs) {
    localStorage.setItem(EXPIRES_KEY, String(expiresAtMs));
  }
  localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
}

export function getToken(): string | undefined {
  migrateSessionTokenIfNeeded();
  return localStorage.getItem(TOKEN_KEY) ?? undefined;
}

export function getTokenExpiresAt(): number | null {
  migrateSessionTokenIfNeeded();
  const raw = localStorage.getItem(EXPIRES_KEY);
  return raw ? Number(raw) : null;
}

export function isTokenExpired(): boolean {
  const expiresAt = getTokenExpiresAt();
  if (!expiresAt) return false;
  return Date.now() >= expiresAt;
}

export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/** temp-maven 后端鉴权头（api.json securitySchemes.X-token） */
export function getXTokenHeader(): Record<string, string> {
  const token = getToken();
  if (!token) return {};
  return { 'X-token': token };
}
