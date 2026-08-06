/**
 * Hash 路由（createHashRouter）下，外部跳转必须走 /#/path，
 * 不能用 /path（那是 history 模式路径，会落到服务器 404）。
 */
export function hashHref(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = import.meta.env.BASE_URL || '/';
  const prefix = base.endsWith('/') ? base : `${base}/`;
  return `${prefix}#${normalized}`;
}

/** 在新标签打开应用内 hash 路由页面 */
export function openHashRoute(path: string, target = '_blank'): void {
  window.open(hashHref(path), target, 'noopener,noreferrer');
}
