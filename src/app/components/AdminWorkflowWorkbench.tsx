import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bell, CheckCircle2, Download, FileArchive, FileUp, Mail, Send,
  UserRound, AlertTriangle, History, Power, PowerOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { fetchAuthUsers, updateAuthUserStatus, type AuthUser } from '@/api/auth';
import {
  fetchAdminEvaluationTasks,
  updateAdminEvaluationTaskStatus,
  notifyAdminEvaluationTasksChanged,
  type AdminEvalTaskRow,
} from '@/api/evaluation';
import { DataPagination } from './DataPagination';
import {
  WORKFLOW_EVENT, addAdminOperationLog,
  getAdminOperationLogs, getWorkflowTasks,
  type AdminOperationLog, type WorkflowStatus,
} from '../data/workflowStore';

const STATUS: WorkflowStatus[] = ['待受理', '材料已接收', '处理中', '待补充材料', '待交付', '已推送', '处理异常'];
const statusStyle: Record<string, string> = {
  待受理: 'bg-amber-50 text-amber-700', 材料已接收: 'bg-cyan-50 text-cyan-700', 处理中: 'bg-blue-50 text-blue-700',
  待补充材料: 'bg-orange-50 text-orange-700', 待交付: 'bg-violet-50 text-violet-700', 已推送: 'bg-emerald-50 text-emerald-700', 处理异常: 'bg-red-50 text-red-700',
};
const fallbackStatusStyle = 'bg-slate-100 text-slate-600';

type UserRow = {
  id: string;
  name: string;
  contact: string;
  registeredAt: string;
  lastLoginAt: string;
  status: '正常' | '已停用';
};

function formatDateTime(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
}

function mapAuthUser(user: AuthUser): UserRow {
  return {
    id: String(user.id),
    name: user.username || String(user.id),
    contact: user.username || '—',
    registeredAt: formatDateTime(user.created_at),
    lastLoginAt: formatDateTime(user.updated_at),
    status: user.is_active === false ? '已停用' : '正常',
  };
}

function useAdminLogs() {
  const [logs, setLogs] = useState<AdminOperationLog[]>(getAdminOperationLogs());
  useEffect(() => {
    const refresh = () => setLogs(getAdminOperationLogs());
    window.addEventListener(WORKFLOW_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return logs;
}

/** 用户面板任务数仍读本地 workflow（与用户提交双写对齐）；API 任务计数待用户表关联确认 */
function useLocalWorkflowTasks() {
  const [tasks, setTasks] = useState(getWorkflowTasks());
  useEffect(() => {
    const refresh = () => setTasks(getWorkflowTasks());
    window.addEventListener(WORKFLOW_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return tasks;
}

export function RegisteredUserPanel({
  onTotalChange,
}: {
  onTotalChange?: (total: number) => void;
} = {}) {
  const tasks = useLocalWorkflowTasks();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchAuthUsers({
        pageSize,
        pageCurrent: page,
        role: 'USER',
      });
      setUsers(result.items.map(mapAuthUser));
      setTotal(result.total);
      onTotalChange?.(result.total);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '加载用户列表失败');
      setUsers([]);
      setTotal(0);
      onTotalChange?.(0);
    } finally {
      setLoading(false);
    }
  }, [onTotalChange, page, pageSize]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const toggleStatus = async (user: UserRow) => {
    const nextActive = user.status !== '正常';
    try {
      await updateAuthUserStatus(user.id, nextActive);
      addAdminOperationLog({
        operator: 'admin',
        action: nextActive ? '启用账号' : '停用账号',
        detail: user.name,
      });
      toast.success(`账号已${nextActive ? '启用' : '停用'}`);
      await loadUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '更新账号状态失败');
    }
  };

  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <h3 className="font-bold text-slate-900">平台注册用户</h3>
          <p className="mt-1 text-xs text-slate-400">查看与管理平台注册用户的账号状态、注册信息及关联任务</p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{total} 位</span>
      </div>
      {loading ? (
        <div className="px-6 py-10 text-center text-sm text-slate-400">加载中…</div>
      ) : users.length === 0 ? (
        <div className="px-6 py-10 text-center text-sm text-slate-400">暂无注册用户</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-400">
              <tr>
                <th className="px-5 py-3">用户</th>
                <th className="px-5 py-3">联系方式</th>
                <th className="px-5 py-3">注册时间</th>
                <th className="px-5 py-3">最后登录</th>
                <th className="px-5 py-3">任务数</th>
                <th className="px-5 py-3">账号状态</th>
                <th className="px-5 py-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-5 py-3 font-semibold text-slate-800">
                    <span className="inline-flex items-center gap-2">
                      <UserRound className="h-4 w-4 text-blue-500" />
                      {user.name}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{user.contact}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{user.registeredAt}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{user.lastLoginAt}</td>
                  <td className="px-5 py-3 font-bold text-blue-600">
                    {tasks.filter((task) => task.userId === user.id).length}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        user.status === '正常' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      type="button"
                      onClick={() => void toggleStatus(user)}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600"
                    >
                      {user.status === '正常' ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                      {user.status === '正常' ? '停用' : '启用'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="border-t">
        <DataPagination
          total={total}
          page={page}
          pageSize={pageSize}
          disabled={loading}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </section>
  );
}

export function AdminWorkflowWorkbench() {
  const [tasks, setTasks] = useState<AdminEvalTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const current = useMemo(
    () => tasks.find((task) => task.id === selected) || tasks[0],
    [tasks, selected],
  );

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await fetchAdminEvaluationTasks();
      setTasks(rows);
      notifyAdminEvaluationTasksChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '加载评测任务失败');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    if (!tasks.length) setSelected(null);
    else if (!selected || !tasks.some((task) => task.id === selected)) setSelected(tasks[0].id);
  }, [tasks, selected]);

  const changeStatus = async (task: AdminEvalTaskRow, status: string) => {
    if (statusSaving) return;
    setStatusSaving(true);
    try {
      await updateAdminEvaluationTaskStatus(task, status);
      addAdminOperationLog({ operator: 'admin', taskId: task.id, action: '修改任务状态', detail: status });
      toast.success(`任务状态已更新为“${status}”`);
      await loadTasks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '更新任务状态失败');
    } finally {
      setStatusSaving(false);
    }
  };

  const uploadOutputs = () => {
    toast.error('文件上传接口尚未开放，请待后端就绪后再上传报告');
  };

  const saveNote = () => {
    toast.error('后端暂无内部备注字段，备注未保存');
  };

  const push = () => {
    toast.error('报告推送接口尚未开放');
  };

  const download = () => {
    toast.error('文件存储尚未接入，无法下载材料');
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-sm text-slate-400">
        加载任务列表…
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
        <FileArchive className="mx-auto h-10 w-10 text-slate-300" />
        <h3 className="mt-4 font-bold text-slate-700">暂无用户提交的正式评测任务</h3>
        <p className="mt-2 text-sm text-slate-400">同一网址下，用户从支持“创建任务”的产品页提交后会立即显示在这里。</p>
      </div>
    );
  }

  const statusOptions = current
    ? STATUS.includes(current.status as WorkflowStatus)
      ? STATUS
      : [current.status, ...STATUS]
    : STATUS;

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h3 className="font-bold text-slate-900">用户任务受理箱</h3>
          <p className="mt-1 text-xs text-slate-400">共 {tasks.length} 个任务</p>
        </div>
        <div className="max-h-[680px] overflow-y-auto">
          {tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => setSelected(task.id)}
              className={`w-full border-b px-5 py-4 text-left transition ${
                current?.id === task.id ? 'bg-blue-50' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="line-clamp-2 text-sm font-bold text-slate-800">{task.name}</span>
                <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${statusStyle[task.status] || fallbackStatusStyle}`}>
                  {task.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                {task.userName} · {task.product}
              </div>
              <div className="mt-1 text-[11px] text-slate-400">{task.createdAt}</div>
            </button>
          ))}
        </div>
      </section>
      {current && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
            <div>
              <div className="text-xs font-bold tracking-wider text-blue-600">TASK {current.id}</div>
              <h2 className="mt-2 text-xl font-black text-slate-900">{current.name}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {current.product} · {current.model}
              </p>
            </div>
            <select
              value={current.status}
              disabled={statusSaving}
              onChange={(event) => void changeStatus(current, event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-5 py-5 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-400">提交用户</div>
              <div className="mt-2 font-bold text-slate-800">{current.userName}</div>
              <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                {current.contact}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="text-xs font-bold text-slate-400">评测诉求与配置</div>
              <div className="mt-2 text-sm leading-6 text-slate-700">{current.requirement}</div>
              {current.configSummary && <div className="mt-2 text-xs text-slate-500">{current.configSummary}</div>}
            </div>
          </div>
          <div className="border-t py-5">
            <h3 className="text-sm font-bold text-slate-800">用户提交材料</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {current.inputs.length ? (
                current.inputs.map((file) => (
                  <button
                    key={file.id}
                    type="button"
                    onClick={download}
                    className="flex items-center gap-3 rounded-xl border p-3 text-left hover:border-blue-300 hover:bg-blue-50"
                  >
                    <FileArchive className="h-5 w-5 text-blue-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-slate-700">{file.name}</span>
                      <span className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </span>
                    <Download className="h-4 w-4 text-slate-400" />
                  </button>
                ))
              ) : (
                <div className="col-span-2 rounded-xl border border-dashed p-5 text-center text-sm text-slate-400">
                  文件上传尚未接入，暂无材料可下载
                </div>
              )}
            </div>
          </div>
          <div className="border-t py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">上传报告与结果</h3>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700">
                <FileUp className="h-4 w-4" />
                选择文件
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={() => uploadOutputs()}
                />
              </label>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {current.outputs.map((file) => (
                <div key={file.id} className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t pt-5">
            <label className="text-sm font-bold text-slate-800">内部处理备注</label>
            <textarea
              defaultValue=""
              placeholder="记录服务器运行、异常或补充材料说明（仅管理员可见）"
              className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
            />
            <div className="mt-4 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={saveNote}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                保存备注
              </button>
              <button
                type="button"
                onClick={push}
                disabled={current.status === '已推送'}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-bold text-white disabled:bg-slate-300"
              >
                <Send className="h-4 w-4" />
                {current.status === '已推送' ? '已推送' : '推送给用户'}
              </button>
            </div>
            <p className="mt-3 flex items-center justify-end gap-1 text-xs text-slate-400">
              <Bell className="h-3.5 w-3.5" />
              推送与文件能力待后端接口接入
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

export function AdminOperationLogPanel() {
  const logs = useAdminLogs();
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h3 className="flex items-center gap-2 font-bold text-slate-900">
          <History className="h-4 w-4 text-blue-500" />
          操作日志
        </h3>
        <p className="mt-1 text-xs text-slate-400">记录任务状态、材料下载、文件上传和推送动作</p>
      </div>
      {logs.length ? (
        <div className="divide-y">
          {logs.map((log) => (
            <div key={log.id} className="grid gap-2 px-5 py-4 text-sm md:grid-cols-[160px_130px_1fr_180px]">
              <span className="font-semibold text-slate-700">{log.action}</span>
              <span className="text-xs text-blue-600">{log.taskId || '平台用户'}</span>
              <span className="text-slate-500">{log.detail || '—'}</span>
              <span className="text-xs text-slate-400">
                {log.operator} · {log.createdAt}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-6 py-12 text-center text-sm text-slate-400">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-slate-300" />
          暂无管理员操作记录
        </div>
      )}
    </section>
  );
}
