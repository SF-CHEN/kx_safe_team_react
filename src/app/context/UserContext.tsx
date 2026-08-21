import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  getCurrentUser,
  loginAuth,
  logoutAuth,
  registerAuth,
  type AuthSession,
  type AuthUser,
} from '@/api/auth';
import { getToken, isTokenExpired, removeToken, setToken } from '@/utils/auth';
import { setUnauthorizedHandler } from '@/utils/gateway';
import {
  WORKFLOW_EVENT,
  createWorkflowTask,
  getNotifications,
  getWorkflowTasks,
  markAllNotificationsRead,
  markNotificationRead,
  recordPlatformActivity,
  upsertPlatformUser,
  type StoredAttachment,
  type UserNotification,
  type WorkflowStatus,
} from '../data/workflowStore';

export type UserRole = 'guest' | 'user' | 'admin';

export interface MyModel {
  id: string;
  name: string;
  type: '开源' | '闭源' | '自定义';
  apiBase: string;
  modelId: string;
  createdAt: string;
}

export interface EvalTask {
  id: string;
  name: string;
  model: string;
  modelType: string;
  evalSet: string;
  evalType: '个人敏感信息审查' | '模型数据安全评测' | '数据集安全评测' | 'AIGC内容审核' |
    '深度模型可信测评' | '大模型安全评测' | '多模态大模型安全评测' |
    '大模型评测' | '智能体安全评测' | '训练集评测';
  status: '评测中' | '评测完成' | '评测失败' | '已暂停' | '排队中' | WorkflowStatus;
  score: number | null;
  createdAt: string;
  plan: 'free' | 'paid';
  shareLink?: string;
  requirement?: string;
  configSummary?: string;
  attachments?: StoredAttachment[];
  reports?: StoredAttachment[];
  pushedAt?: string;
  /** 管理员对用户可见的留言（可选，未接 API 时为空） */
  publicMessage?: string;
  supplementDueAt?: string;
  supplementCategory?: string;
  communications?: import('../data/workflowStore').WorkflowCommunication[];
  terminationReason?: string;
}

export interface EvalSet {
  id: string;
  name: string;
  category: string;
  count: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  nickname?: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive?: boolean;
  myModels: MyModel[];
  myTasks: EvalTask[];
  myEvalSets: EvalSet[];
  notificationPreference?: 'site' | 'contact' | 'both';
}

interface UserContextType {
  user: User;
  isGuest: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  sessionReady: boolean;
  login: (account: string, password: string, rememberMe?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    nickname?: string,
    rememberMe?: boolean,
  ) => Promise<User>;
  clearSession: () => void;
  updateAccount: (updates: {
    name: string;
    email: string;
    notificationPreference: 'site' | 'contact' | 'both';
  }) => Promise<{ ok: boolean; message?: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message?: string }>;
  addTask: (task: EvalTask) => void;
  updateTask: (id: string, updates: Partial<EvalTask>) => void;
  deleteTask: (id: string) => void;
  addModel: (model: MyModel) => void;
  notifications: UserNotification[];
  unreadCount: number;
  markNoticeRead: (id: string) => void;
  markAllNoticesRead: () => void;
}

const guestUser: User = {
  id: 'guest',
  name: '游客',
  username: '',
  email: '',
  role: 'guest',
  myModels: [],
  myTasks: [],
  myEvalSets: [],
  notificationPreference: 'both',
};

const LOCAL_DATA_PREFIX = 'xuanjian-local-data:';

export function getDefaultUserName(identifier: string): string {
  const account = identifier.trim();
  if (/^1\d{10}$/.test(account)) return `用户 ${account.slice(-4)}`;
  if (account.includes('@')) {
    const prefix = account.split('@')[0].trim();
    return `用户 ${prefix || '新用户'}`;
  }
  return account ? `用户 ${account.slice(-4)}` : '普通用户';
}

function localDataKey(userId: string) {
  return `${LOCAL_DATA_PREFIX}${userId}`;
}

function loadLocalWorkspace(userId: string): Pick<
  User,
  'myModels' | 'myTasks' | 'myEvalSets' | 'notificationPreference' | 'name' | 'email'
> {
  try {
    const raw = localStorage.getItem(localDataKey(userId));
    if (!raw) {
      return { myModels: [], myTasks: [], myEvalSets: [], notificationPreference: 'both', name: '', email: '' };
    }
    const parsed = JSON.parse(raw) as Partial<User>;
    return {
      myModels: Array.isArray(parsed.myModels) ? parsed.myModels : [],
      myTasks: Array.isArray(parsed.myTasks) ? parsed.myTasks : [],
      myEvalSets: Array.isArray(parsed.myEvalSets) ? parsed.myEvalSets : [],
      notificationPreference: parsed.notificationPreference || 'both',
      name: typeof parsed.name === 'string' ? parsed.name : '',
      email: typeof parsed.email === 'string' ? parsed.email : '',
    };
  } catch {
    return { myModels: [], myTasks: [], myEvalSets: [], notificationPreference: 'both', name: '', email: '' };
  }
}

function saveLocalWorkspace(user: User) {
  if (user.role === 'guest') return;
  localStorage.setItem(
    localDataKey(user.id),
    JSON.stringify({
      myModels: user.myModels,
      myTasks: user.myTasks,
      myEvalSets: user.myEvalSets,
      notificationPreference: user.notificationPreference || 'both',
      name: user.name,
      email: user.email,
    }),
  );
}

function mapApiUser(apiUser: AuthUser): User {
  const id = String(apiUser.id);
  const workspace = loadLocalWorkspace(id);
  const roleRaw = String(apiUser.role || 'user').toLowerCase();
  const role = (roleRaw === 'admin' ? 'admin' : 'user') as UserRole;
  const fallbackName = apiUser.nickname || apiUser.username || '';
  return {
    id,
    name: workspace.name || fallbackName,
    username: apiUser.username || '',
    nickname: apiUser.nickname || apiUser.username || '',
    email: workspace.email || apiUser.email || apiUser.username || '',
    role,
    isActive: apiUser.is_active !== false,
    myModels: workspace.myModels,
    myTasks: workspace.myTasks,
    myEvalSets: workspace.myEvalSets,
    notificationPreference: workspace.notificationPreference || 'both',
  };
}

function applyAuthSession(session: AuthSession, rememberMe: boolean): User {
  setToken(session.token, session.expires_at_ms, rememberMe);
  return mapApiUser(session.user);
}

const UserContext = createContext<UserContextType | null>(null);

/** 主站登录走后端鉴权，本地凭证重置仅用于原型联调占位。 */
export async function adminResetLocalPassword(_userId: string, _password: string): Promise<boolean> {
  return false;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(guestUser);
  const [sessionReady, setSessionReady] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  const clearSession = useCallback(() => {
    removeToken();
    setUser(guestUser);
  }, []);

  const refreshWorkflow = useCallback(() => {
    setNotifications(getNotifications());
    setUser((prev) => {
      if (prev.role === 'guest') return prev;
      const workflows = getWorkflowTasks().filter((item) => item.userId === prev.id);
      if (!workflows.length) return prev;
      const merged = prev.myTasks.map((task) => {
        const workflow = workflows.find((item) => item.id === task.id);
        return workflow
          ? {
              ...task,
              status: workflow.status,
              reports: workflow.outputs,
              attachments: workflow.inputs,
              pushedAt: workflow.pushedAt,
              publicMessage: workflow.publicMessage,
              supplementDueAt: workflow.supplementDueAt,
              supplementCategory: workflow.supplementCategory,
              communications: workflow.communications,
              terminationReason: workflow.terminationReason,
            }
          : task;
      });
      const known = new Set(merged.map((task) => task.id));
      const extras: EvalTask[] = workflows
        .filter((item) => !known.has(item.id))
        .map((item) => ({
          id: item.id,
          name: item.name,
          model: item.model,
          modelType: '自定义',
          evalSet: item.requirement,
          evalType: item.product as EvalTask['evalType'],
          status: item.status,
          score: null,
          createdAt: item.createdAt,
          plan: 'paid',
          requirement: item.requirement,
          configSummary: item.configSummary,
          attachments: item.inputs,
          reports: item.outputs,
          pushedAt: item.pushedAt,
          publicMessage: item.publicMessage,
          supplementDueAt: item.supplementDueAt,
          supplementCategory: item.supplementCategory,
          communications: item.communications,
          terminationReason: item.terminationReason,
        }));
      return { ...prev, myTasks: [...extras, ...merged] };
    });
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getToken();
      if (!token || isTokenExpired()) {
        if (token) removeToken();
        if (!cancelled) setSessionReady(true);
        return;
      }
      try {
        const apiUser = await getCurrentUser();
        if (!cancelled) setUser(mapApiUser(apiUser));
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  useEffect(() => {
    saveLocalWorkspace(user);
  }, [user]);

  useEffect(() => {
    refreshWorkflow();
    window.addEventListener(WORKFLOW_EVENT, refreshWorkflow);
    window.addEventListener('storage', refreshWorkflow);
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refreshWorkflow);
      window.removeEventListener('storage', refreshWorkflow);
    };
  }, [refreshWorkflow]);

  const isGuest = user.role === 'guest';
  const isLoggedIn = user.role !== 'guest';
  const isAdmin = user.role === 'admin';

  const login = async (account: string, password: string, rememberMe = false) => {
    const session = await loginAuth({
      account,
      password,
      remember_me: rememberMe,
    });
    const next = applyAuthSession(session, rememberMe);
    setUser(next);
    upsertPlatformUser({ id: next.id, name: next.name, contact: next.email || account });
    recordPlatformActivity(next.id, '登录');
    return next;
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    nickname?: string,
    rememberMe = false,
  ) => {
    const session = await registerAuth({
      username,
      email,
      password,
      nickname: nickname || username,
      remember_me: rememberMe,
    });
    const next = applyAuthSession(session, rememberMe);
    setUser(next);
    upsertPlatformUser({ id: next.id, name: next.name || nickname || username, contact: email || username });
    return next;
  };

  const logout = async () => {
    try {
      if (getToken()) await logoutAuth();
    } catch {
      // 忽略登出接口失败
    } finally {
      clearSession();
    }
  };

  const updateAccount = async (updates: {
    name: string;
    email: string;
    notificationPreference: 'site' | 'contact' | 'both';
  }) => {
    const name = updates.name.trim();
    const email = updates.email.trim();
    if (!name || !email) return { ok: false, message: '显示名称和登录账号不能为空' };
    setUser((prev) => ({
      ...prev,
      name,
      email,
      notificationPreference: updates.notificationPreference,
    }));
    upsertPlatformUser({ id: user.id, name, contact: email });
    return { ok: true };
  };

  const changePassword = async (_currentPassword: string, newPassword: string) => {
    if (newPassword.length < 6) return { ok: false, message: '新密码至少需要 6 位' };
    return { ok: false, message: '密码修改接口尚未开放，请联系管理员' };
  };

  const addTask = (task: EvalTask) => {
    setUser((prev) => ({ ...prev, myTasks: [task, ...prev.myTasks] }));
    createWorkflowTask({
      id: task.id,
      userId: user.id,
      userName: user.name,
      contact: user.email,
      name: task.name,
      product: task.evalType,
      model: task.model,
      requirement: task.requirement || task.evalSet || '按所选配置开展评测',
      configSummary: task.configSummary,
      status: '处理中',
      createdAt: task.createdAt,
      updatedAt: task.createdAt,
      inputs: task.attachments || [],
      outputs: task.reports || [],
    });
  };

  const updateTask = (id: string, updates: Partial<EvalTask>) => {
    setUser((prev) => ({
      ...prev,
      myTasks: prev.myTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTask = (id: string) => {
    setUser((prev) => ({
      ...prev,
      myTasks: prev.myTasks.filter((t) => t.id !== id),
    }));
  };

  const addModel = (model: MyModel) => {
    setUser((prev) => ({ ...prev, myModels: [model, ...prev.myModels] }));
  };

  const ownNotifications = notifications.filter((item) => item.userId === user.id);
  const unreadCount = ownNotifications.filter((item) => !item.read).length;
  const markNoticeRead = (id: string) => markNotificationRead(id);
  const markAllNoticesRead = () => markAllNotificationsRead(user.id);

  return (
    <UserContext.Provider
      value={{
        user,
        isGuest,
        isLoggedIn,
        isAdmin,
        sessionReady,
        login,
        logout,
        register,
        clearSession,
        updateAccount,
        changePassword,
        addTask,
        updateTask,
        deleteTask,
        addModel,
        notifications: ownNotifications,
        unreadCount,
        markNoticeRead,
        markAllNoticesRead,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
