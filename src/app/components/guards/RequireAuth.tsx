import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useUser } from '../../context/UserContext';

function SessionLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500"
      aria-busy="true"
      aria-live="polite"
    >
      正在恢复登录状态…
    </div>
  );
}

/** 需登录后访问；会话恢复中显示 loading，未登录跳转登录页并带回跳地址 */
export function RequireAuth() {
  const { isLoggedIn, sessionReady } = useUser();
  const location = useLocation();

  if (!sessionReady) return <SessionLoading />;

  if (!isLoggedIn) {
    const from = `${location.pathname}${location.search}${location.hash}` || '/';
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
