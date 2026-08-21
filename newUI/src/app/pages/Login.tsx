import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { CheckCircle2, Eye, EyeOff, KeyRound, Mail, X } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { AuthBrandPanel } from '../components/AuthBrandPanel';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useUser();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotAccount, setForgotAccount] = useState('');
  const [forgotDone, setForgotDone] = useState(false);

  const returnTo = (location.state as { from?: string } | null)?.from || '/';
  const inputClass = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

  useEffect(() => {
    document.title = '登录｜玄鉴 AI安全与评测平台';
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    if (!account || !password) {
      const msg = '请输入手机号/邮箱和密码';
      setFormError(msg);
      toast.error(msg);
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 350));
      const ok = await login(account.trim(), password);
      if (ok) {
        toast.success('登录成功');
        navigate(returnTo && returnTo !== '/login' ? returnTo : '/', { replace: true });
      } else {
        const msg = '账号已停用，请联系管理员';
        setFormError(msg);
        toast.error(msg);
      }
    } catch {
      const msg = '登录失败，请稍后重试';
      setFormError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_10%,rgba(37,99,235,.10),transparent_28rem),linear-gradient(180deg,#f8fbff,#eef3f8)]">
      <header className="h-[72px] border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-4">
            <img src="/rongsu-logo.png" alt="榕数科技" className="h-10 w-auto" />
            <span className="border-l border-slate-200 pl-4 text-base font-bold text-slate-800">账号登录</span>
          </button>
          <div className="hidden items-center gap-7 text-sm text-slate-500 sm:flex">
            <button onClick={() => navigate('/')}>返回榕数首页</button>
            <button onClick={() => navigate('/help-docs')}>帮助文档</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1180px] overflow-hidden border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)] lg:my-14 lg:grid-cols-[1.08fr_.72fr] lg:rounded-3xl">
        <AuthBrandPanel mode="login" />
        <div className="flex min-h-[620px] items-center px-7 py-12 sm:px-12 lg:px-14">
          <div className="w-full">
            <div className="mb-9">
              <div className="text-xs font-black tracking-[0.18em] text-blue-600">XUANJIAN ACCOUNT</div>
              <h1 className="mt-3 text-3xl font-black text-slate-950">登录玄鉴平台</h1>
              <p className="mt-2 text-sm text-slate-500">进入在线体验、任务中心与评测报告空间</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-400">
                <span>安全登录</span><span>体验数据不留存</span><span>任务与报告统一管理</span>
              </div>
            </div>

            <div className="mb-7 border-b border-slate-200 pb-3">
              <span className="relative inline-flex text-sm font-black text-blue-700">
                账号密码登录
                <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              </span>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={account} onChange={event => setAccount(event.target.value)} placeholder="请输入注册手机号或邮箱" className={`${inputClass} pl-11`} autoComplete="username" />
              </div>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="请输入登录密码" className={`${inputClass} px-11`} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPwd(current => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>

              <div className="flex items-center justify-between py-1 text-xs">
                <label className="flex items-center gap-2 text-slate-500"><input type="checkbox" className="rounded border-slate-300" />15 天内免登录</label>
                <button type="button" onClick={() => setForgotOpen(true)} className="font-semibold text-blue-600">忘记密码？</button>
              </div>

              {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

              <button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-400">
                {loading ? '登录中…' : '登 录'}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm">
              <span className="text-slate-500">还没有账号？ <Link to="/register" state={location.state} className="font-bold text-blue-600">免费注册</Link></span>
              <button onClick={() => navigate('/')} className="text-xs text-slate-400 hover:text-blue-600">游客浏览 →</button>
            </div>
            <div className="mt-8 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">使用注册时填写的手机号或邮箱与密码登录，登录后将返回您刚才访问的页面。</div>
            <div className="mt-5 text-center">
              <Link to="/admin" className="text-xs font-semibold text-slate-400 transition hover:text-blue-600">管理员入口 →</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="pb-8 text-center text-xs text-slate-400">杭州榕数科技有限公司 · 玄鉴 AI 安全与评测平台</footer>

      {forgotOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-5 backdrop-blur-sm">
        <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
          <button onClick={() => { setForgotOpen(false); setForgotDone(false); }} className="absolute right-5 top-5 text-slate-400"><X className="h-4 w-4" /></button>
          {forgotDone ? (
            <div className="py-5 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" /><h3 className="mt-4 text-xl font-black text-slate-900">重置申请已提交</h3><p className="mt-2 text-sm leading-6 text-slate-500">平台管理员将在核验账号后协助您重置密码。</p></div>
          ) : (
            <><h3 className="text-xl font-black text-slate-900">申请重置密码</h3><p className="mt-2 text-sm text-slate-500">输入注册手机号或邮箱，提交后由管理员协助处理</p><input value={forgotAccount} onChange={event => setForgotAccount(event.target.value)} className={`${inputClass} mt-6`} placeholder="手机号或邮箱" /><button onClick={() => { if (!forgotAccount) toast.error('请输入账号'); else setForgotDone(true); }} className="mt-4 h-11 w-full rounded-xl bg-blue-600 text-sm font-bold text-white">提交重置申请</button></>
          )}
        </div>
      </div>}
    </div>
  );
}
