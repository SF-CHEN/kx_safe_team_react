import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, Mail, Phone, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { AuthBrandPanel } from '../components/AuthBrandPanel';

type RegisterMode = 'phone' | 'email';

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useUser();
  const [mode, setMode] = useState<RegisterMode>('email');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputClass = 'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
  const returnTo = (location.state as { from?: string } | null)?.from || '/';

  useEffect(() => {
    document.title = '注册｜玄鉴 AI安全与评测平台';
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (mode === 'phone') {
      toast.warning('手机号注册即将开放，请使用邮箱注册');
      return;
    }
    if (!username.trim() || !email.trim() || !password) {
      toast.error('请填写用户名、邮箱和密码');
      return;
    }
    if (password.length < 6) {
      toast.error('密码至少需要 6 位');
      return;
    }
    if (!agreed) {
      toast.error('请阅读并同意服务协议和隐私政策');
      return;
    }
    setLoading(true);
    try {
      await register(username.trim(), email.trim(), password, username.trim());
      toast.success('注册成功，欢迎使用玄鉴平台');
      navigate(returnTo);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '注册失败，请重试');
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
            <span className="border-l border-slate-200 pl-4 text-base font-bold text-slate-800">账号注册</span>
          </button>
          <span className="hidden text-sm text-slate-500 sm:inline">已有账号？ <Link to="/login" state={location.state} className="font-bold text-blue-600">立即登录</Link></span>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1180px] overflow-hidden border border-white/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.12)] lg:my-14 lg:grid-cols-[1.08fr_.72fr] lg:rounded-3xl">
        <AuthBrandPanel mode="register" />
        <div className="flex min-h-[620px] items-center px-7 py-12 sm:px-12 lg:px-14">
          <div className="w-full">
            <div className="mb-8">
              <div className="text-xs font-black tracking-[0.18em] text-blue-600">CREATE XUANJIAN ACCOUNT</div>
              <h1 className="mt-3 text-3xl font-black text-slate-950">免费注册玄鉴</h1>
              <p className="mt-2 text-sm text-slate-500">注册后即可使用在线体验并管理评测任务</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-semibold text-slate-400">
                <span>邮箱注册已对接</span><span>体验数据不留存</span><span>支持任务与报告管理</span>
              </div>
            </div>

            <div className="mb-7 flex border-b border-slate-200">
              {([['email', '邮箱注册'], ['phone', '手机号注册']] as const).map(([key, label]) => (
                <button key={key} type="button" onClick={() => setMode(key)} className={`relative flex-1 pb-3 text-sm font-bold ${mode === key ? 'text-blue-700' : 'text-slate-400'}`}>
                  {label}{mode === key && <span className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-blue-600" />}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'email' ? (
                <>
                  <div className="relative">
                    <UserRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={username} onChange={event => setUsername(event.target.value)} placeholder="请输入用户名" className={`${inputClass} pl-11`} />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="请输入企业邮箱地址" className={`${inputClass} pl-11`} />
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
                  手机号注册即将开放，请使用邮箱注册。
                  <div className="relative mt-3 opacity-50 pointer-events-none">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={phone} readOnly placeholder="请输入手机号码" className={`${inputClass} pl-11`} />
                  </div>
                </div>
              )}

              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="设置登录密码（至少 6 位）" className={`${inputClass} pr-11`} />
                <button type="button" onClick={() => setShowPwd(current => !current)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">{showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              {password && <div className="flex items-center gap-2 px-1"><div className="flex flex-1 gap-1">{[1, 2, 3].map(level => <span key={level} className={`h-1 flex-1 rounded-full ${password.length >= level * 4 ? (password.length >= 10 ? 'bg-emerald-500' : 'bg-blue-500') : 'bg-slate-200'}`} />)}</div><span className="text-[10px] text-slate-400">密码安全强度</span></div>}

              <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs leading-5 text-slate-500">
                <input type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} className="mt-1 rounded border-slate-300" />
                <span>我已阅读并同意 <button type="button" className="text-blue-600">《服务条款》</button> 和 <button type="button" className="text-blue-600">《隐私政策》</button></span>
              </label>

              <button type="submit" disabled={loading || mode === 'phone'} className="h-12 w-full rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:bg-slate-400">
                {loading ? '注册中…' : '注册并开始体验'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">已有账号？ <Link to="/login" state={location.state} className="font-bold text-blue-600">返回登录</Link></p>
            <div className="mt-8 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">邮箱注册已对接现网认证接口；手机验证码注册暂未开放。</div>
          </div>
        </div>
      </main>
      <footer className="pb-8 text-center text-xs text-slate-400">杭州榕数科技有限公司 · 玄鉴 AI 安全与评测平台</footer>
    </div>
  );
}
