import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  Activity, Bell, ChevronRight, ClipboardList, History, LogOut,
  Shield, User, Users, X,
} from 'lucide-react';
import {
  AdminOperationLogPanel, AdminWorkflowWorkbench, RegisteredUserPanel,
} from '../components/AdminWorkflowWorkbench';
import { useUser } from '../context/UserContext';
import {
  ADMIN_EVAL_TASKS_EVENT,
  fetchAdminEvaluationTasks,
  type AdminEvalTaskRow,
} from '@/api/evaluation';
import {
  WORKFLOW_EVENT, getAdminOperationLogs,
} from '../data/workflowStore';

type AdminSection = 'users' | 'tasks' | 'logs';

const ADMIN_SECTIONS: AdminSection[] = ['users', 'tasks', 'logs'];

function parseAdminSection(value?: string): AdminSection {
  if (value && ADMIN_SECTIONS.includes(value as AdminSection)) {
    return value as AdminSection;
  }
  return 'users';
}

function useAdminMetrics() {
  const [tasks, setTasks] = useState<AdminEvalTaskRow[]>([]);
  const [logs, setLogs] = useState(() => getAdminOperationLogs().length);

  const reloadTasks = useCallback(() => {
    void fetchAdminEvaluationTasks()
      .then(setTasks)
      .catch(() => setTasks([]));
  }, []);

  useEffect(() => {
    reloadTasks();
    window.addEventListener(ADMIN_EVAL_TASKS_EVENT, reloadTasks);
    return () => window.removeEventListener(ADMIN_EVAL_TASKS_EVENT, reloadTasks);
  }, [reloadTasks]);

  useEffect(() => {
    const refresh = () => setLogs(getAdminOperationLogs().length);
    window.addEventListener(WORKFLOW_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return { tasks, logs };
}

function AdminLogin() {
  const { login, clearSession } = useUser();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const next = await login(account.trim(), password, true);
      if (next.role !== 'admin') {
        clearSession();
        setError('该账号不是管理员，无法进入管理后台，请使用管理员账号登录');
        return;
      }
    } catch {
      setError('管理员账号或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] px-5">
      <div className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-white/[0.06] p-9 text-white shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black">玄鉴管理后台</h1>
            <p className="mt-1 text-xs text-white/50">仅限授权管理员访问</p>
          </div>
        </div>
        <form onSubmit={(e) => void submit(e)} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-white/70">管理员账号</span>
            <input
              value={account}
              onChange={(e) => {
                setAccount(e.target.value);
                setError('');
              }}
              className="w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              placeholder="请输入管理员账号"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-white/70">登录密码</span>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              placeholder="请输入密码"
            />
          </label>
          {error && (
            <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-200">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? '登录中…' : '安全登录'}
          </button>
        </form>
        <Link to="/login" className="mt-6 block text-center text-xs text-white/50 hover:text-white">
          ← 返回普通用户登录
        </Link>
      </div>
    </div>
  );
}

function Sidebar({
  active,
  onChange,
  users,
  pendingTasks,
  logs,
}: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  users: number;
  pendingTasks: number;
  logs: number;
}) {
  const items = [
    { key: 'users' as const, label: '用户管理', icon: Users, badge: users },
    { key: 'tasks' as const, label: '任务运维', icon: Activity, badge: pendingTasks },
    { key: 'logs' as const, label: '操作日志', icon: History, badge: logs },
  ];
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[240px] flex-col border-r border-slate-200 bg-white">
      <div className="border-b px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-black text-slate-900">玄鉴管理后台</div>
            <div className="mt-0.5 text-[11px] text-slate-400">Admin Dashboard</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3">
        <div className="px-3 pb-2 pt-3 text-[11px] font-bold tracking-widest text-slate-400">核心功能</div>
        {items.map((item) => {
          const Icon = item.icon;
          const selected = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                selected ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    item.key === 'tasks' ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">系统管理员</div>
            <div className="text-xs text-slate-400">admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AdminNoticePanel({
  tasks,
  onClose,
  onOpenTasks,
}: {
  tasks: AdminEvalTaskRow[];
  onClose: () => void;
  onOpenTasks: () => void;
}) {
  const pending = tasks.filter((task) => task.status !== '已推送');
  return (
    <div className="absolute right-0 top-11 z-50 w-[360px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">待办提醒</h3>
          <p className="mt-0.5 text-[11px] text-slate-400">来自当前任务工作台的实时数据</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
          <X className="h-4 w-4" />
        </button>
      </div>
      {pending.length ? (
        <div className="max-h-[360px] divide-y overflow-auto">
          {pending.slice(0, 8).map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={onOpenTasks}
              className="block w-full px-4 py-3 text-left hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="line-clamp-1 text-sm font-semibold text-slate-700">{task.name}</span>
                <span className="shrink-0 text-[10px] font-bold text-blue-600">{task.status}</span>
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {task.userName} · {task.createdAt}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="px-6 py-10 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">暂无待办任务</p>
        </div>
      )}
    </div>
  );
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const { section: sectionParam } = useParams<{ section?: string }>();
  const { isAdmin, sessionReady, logout } = useUser();
  const section = parseAdminSection(sectionParam);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const metrics = useAdminMetrics();
  const pendingTasks = useMemo(
    () => metrics.tasks.filter((task) => task.status !== '已推送').length,
    [metrics.tasks],
  );

  const setSection = (next: AdminSection) => {
    navigate(`/admin/${next}`, { replace: false });
  };

  useEffect(() => {
    localStorage.removeItem('xj_admin_token');
  }, []);

  useEffect(() => {
    if (!sessionReady || !isAdmin) return;
    if (!sectionParam || !ADMIN_SECTIONS.includes(sectionParam as AdminSection)) {
      navigate(`/admin/${section}`, { replace: true });
    }
  }, [isAdmin, navigate, section, sectionParam, sessionReady]);

  if (!sessionReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#0f172a,#1e3a8a)] text-sm text-white/70">
        加载中…
      </div>
    );
  }

  if (!isAdmin) return <AdminLogin />;

  const titles = {
    users: ['用户管理', '查看注册用户、联系方式、登录时间、任务数量与账号状态'],
    tasks: ['任务运维', '受理用户任务、下载材料、上传结果并推送至资源中心'],
    logs: ['操作日志', '追踪管理员对任务和账号执行的关键操作'],
  } as const;
  const [title, subtitle] = titles[section];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        active={section}
        onChange={setSection}
        users={userCount}
        pendingTasks={pendingTasks}
        logs={metrics.logs}
      />
      <main className="ml-[240px] min-h-screen">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">玄鉴后台</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="font-bold text-slate-800">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNoticeOpen((open) => !open)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600"
              >
                <Bell className="h-4 w-4" />
                {pendingTasks > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">
                    {pendingTasks}
                  </span>
                )}
              </button>
              {noticeOpen && (
                <AdminNoticePanel
                  tasks={metrics.tasks}
                  onClose={() => setNoticeOpen(false)}
                  onOpenTasks={() => {
                    setNoticeOpen(false);
                    setSection('tasks');
                  }}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                void logout();
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:border-red-200 hover:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              退出登录
            </button>
          </div>
        </header>
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          {section === 'users' && <RegisteredUserPanel onTotalChange={setUserCount} />}
          {section === 'tasks' && <AdminWorkflowWorkbench />}
          {section === 'logs' && <AdminOperationLogPanel />}
        </div>
      </main>
    </div>
  );
}
