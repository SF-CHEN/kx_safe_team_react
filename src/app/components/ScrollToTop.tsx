import { useEffect } from 'react';
import { useLocation } from 'react-router';

/** 路由 pathname / search 变化时滚回页面顶部 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
}
