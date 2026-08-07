import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** 路由 pathname / search 变化时滚回页面顶部 */
export function ScrollToTop() {
  const { pathname, search, hash, key } = useLocation();

  useEffect(() => {
    // 带页内锚点时留给页面自己处理，不强制回顶
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search, hash, key]);

  return null;
}
