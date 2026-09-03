import React from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import { ShieldAlert } from 'lucide-react';
import { useUser } from '../../context/UserContext';

function SessionLoading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500"
      aria-busy="true"
      aria-live="polite"
    >
      正在校验管理员权限…
    </div>
  );
}

function Forbidden() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] px-5">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-9 text-center text-white shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/20">
          <ShieldAlert className="h-7 w-7 text-red-300" />
        </div>
        <h1 className="text-xl font-black">403 无访问权限</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">
          当前账号「{user.username || user.name}」不是管理员，无法进入管理后台。
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15"
          >
            返回首页
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login', { replace: true, state: { from: '/admin', adminRequired: true } });
            }}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold hover:bg-blue-500"
          >
            切换账号登录
          </button>
        </div>
      </div>
    </div>
  );
}

/** 需管理员角色；未登录跳转登录，已登录非管理员展示 403 */
export function RequireAdmin() {
  const { user, isLoggedIn, sessionReady } = useUser();
  const location = useLocation();

  if (!sessionReady) return <SessionLoading />;

  if (!isLoggedIn) {
    const from = `${location.pathname}${location.search}${location.hash}` || '/admin';
    return <Navigate to="/login" replace state={{ from, adminRequired: true }} />;
  }

  if (user.role !== 'admin') return <Forbidden />;

  return <Outlet />;
}
