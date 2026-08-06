import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  WORKFLOW_EVENT, createWorkflowTask, getNotifications, getWorkflowTasks,
  markAllNotificationsRead, markNotificationRead, upsertPlatformUser,
  type StoredAttachment, type UserNotification, type WorkflowStatus,
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
  evalType: '个人敏感信息审查' | '模型数据安全评测' | 'AIGC内容审核' |
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
  email: string;
  role: UserRole;
  avatar?: string;
  myModels: MyModel[];
  myTasks: EvalTask[];
  myEvalSets: EvalSet[];
  notificationPreference?: 'site' | 'contact' | 'both';
}

interface LocalCredential {
  userId: string;
  identifier: string;
  passwordHash: string;
  updatedAt: string;
}

interface UserContextType {
  user: User;
  isGuest: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateAccount: (updates: { name: string; email: string; notificationPreference: 'site' | 'contact' | 'both' }) => Promise<{ ok: boolean; message?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ ok: boolean; message?: string }>;
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
  email: '',
  role: 'guest',
  myModels: [],
  myTasks: [],
  myEvalSets: [],
};

export function getDefaultUserName(identifier: string): string {
  const account = identifier.trim();
  if (/^1\d{10}$/.test(account)) return `用户 ${account.slice(-4)}`;
  if (account.includes('@')) {
    const prefix = account.split('@')[0].trim();
    return `用户 ${prefix || '新用户'}`;
  }
  return account ? `用户 ${account.slice(-4)}` : '普通用户';
}

function normalizeCustomerUser(candidate: User): User {
  if (candidate.role === 'guest') return candidate;
  const isLegacyAdmin = candidate.role === 'admin' || candidate.name?.trim().toLowerCase() === 'admin';
  const legacySeedTaskIds = new Set(['t1', 't2', 't3', 't4', 't5', 't6', 't7']);
  const legacySeedModelIds = new Set(['m1', 'm2', 'm3']);
  return {
    ...candidate,
    role: 'user',
    name: isLegacyAdmin || !candidate.name ? getDefaultUserName(candidate.email) : candidate.name,
    myTasks: (candidate.myTasks || []).filter(task => !legacySeedTaskIds.has(task.id)),
    myModels: (candidate.myModels || []).filter(model => !legacySeedModelIds.has(model.id)),
    myEvalSets: [],
  };
}

const mockLoggedInUser: User = {
  id: 'user1',
  name: '用户 8000',
  email: '13800138000',
  role: 'user',
  // 新登录账号默认保持空工作区，不再自动注入与用户无关的演示任务、模型或评测集。
  myModels: [],
  myTasks: [],
  myEvalSets: [],
};

const UserContext = createContext<UserContextType | null>(null);
const USER_SESSION_KEY = 'xuanjian-user-data';
const USER_ACTIVE_KEY = 'xuanjian-user-session-active';
const USER_CREDENTIAL_KEY = 'xuanjian-local-credentials-v1';

async function hashPassword(password: string): Promise<string> {
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(value => value.toString(16).padStart(2, '0')).join('');
}

function readCredentials(): LocalCredential[] {
  try { return JSON.parse(window.localStorage.getItem(USER_CREDENTIAL_KEY) || '[]') as LocalCredential[]; } catch { return []; }
}

function writeCredentials(credentials: LocalCredential[]) {
  window.localStorage.setItem(USER_CREDENTIAL_KEY, JSON.stringify(credentials));
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => {
    try {
      if (window.localStorage.getItem(USER_ACTIVE_KEY) !== '1') return guestUser;
      const saved = window.localStorage.getItem(USER_SESSION_KEY);
      return saved ? normalizeCustomerUser(JSON.parse(saved) as User) : guestUser;
    } catch {
      return guestUser;
    }
  });
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  const refreshWorkflow = () => {
    const notices = getNotifications();
    setNotifications(notices);
    setUser(prev => {
      if (prev.role === 'guest') return prev;
      const workflows = getWorkflowTasks().filter(item => item.userId === prev.id);
      if (!workflows.length) return prev;
      return {
        ...prev,
        myTasks: prev.myTasks.map(task => {
          const workflow = workflows.find(item => item.id === task.id);
          return workflow ? {
            ...task,
            status: workflow.status,
            reports: workflow.outputs,
            attachments: workflow.inputs,
            pushedAt: workflow.pushedAt,
          } : task;
        }),
      };
    });
  };

  useEffect(() => {
    refreshWorkflow();
    window.addEventListener(WORKFLOW_EVENT, refreshWorkflow);
    window.addEventListener('storage', refreshWorkflow);
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refreshWorkflow);
      window.removeEventListener('storage', refreshWorkflow);
    };
  }, []);

  useEffect(() => {
    if (user.role === 'guest') {
      window.localStorage.removeItem(USER_ACTIVE_KEY);
    } else {
      window.localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
      window.localStorage.setItem(USER_ACTIVE_KEY, '1');
    }
  }, [user]);

  const isGuest = user.role === 'guest';
  const isLoggedIn = user.role !== 'guest';

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;
    const identifier = email.trim();
    const passwordHash = await hashPassword(password);
    const credentials = readCredentials();
    const credential = credentials.find(item => item.identifier === identifier);
    let saved: User | null = null;
    try {
      const raw = window.localStorage.getItem(USER_SESSION_KEY);
      saved = raw ? JSON.parse(raw) as User : null;
    } catch {
      saved = null;
    }
    if (credential && credential.passwordHash !== passwordHash) return false;
    // 兼容升级前已注册的本地演示账号：首次登录时绑定当前密码。
    if (!credential && saved?.email !== identifier) return false;
    const target = saved?.email === identifier
      ? normalizeCustomerUser(saved)
      : { ...mockLoggedInUser, id: credential!.userId, name: getDefaultUserName(identifier), email: identifier, role: 'user' as const };
    if (!credential) {
      credentials.push({ userId: target.id, identifier, passwordHash, updatedAt: new Date().toISOString() });
      writeCredentials(credentials);
    }
    setUser(target);
    upsertPlatformUser({ id: target.id, name: target.name, contact: target.email });
    return true;
  };

  const logout = () => {
    setUser(guestUser);
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (name && email && password) {
      const credentials = readCredentials();
      if (credentials.some(item => item.identifier === email)) return false;
      const next = { ...mockLoggedInUser, name, email, id: `user-${Date.now()}`, role: 'user' as const, myTasks: [], myModels: [], myEvalSets: [] };
      credentials.push({ userId: next.id, identifier: email, passwordHash: await hashPassword(password), updatedAt: new Date().toISOString() });
      writeCredentials(credentials);
      setUser(next);
      upsertPlatformUser({ id: next.id, name: next.name, contact: next.email });
      return true;
    }
    return false;
  };

  const updateAccount = async (updates: { name: string; email: string; notificationPreference: 'site' | 'contact' | 'both' }) => {
    const name = updates.name.trim();
    const email = updates.email.trim();
    if (!name || !email) return { ok: false, message: '显示名称和登录账号不能为空' };
    const credentials = readCredentials();
    if (credentials.some(item => item.userId !== user.id && item.identifier === email)) {
      return { ok: false, message: '该手机号或邮箱已被其他账号使用' };
    }
    const nextCredentials = credentials.map(item => item.userId === user.id ? { ...item, identifier: email, updatedAt: new Date().toISOString() } : item);
    writeCredentials(nextCredentials);
    setUser(prev => ({ ...prev, name, email, notificationPreference: updates.notificationPreference }));
    upsertPlatformUser({ id: user.id, name, contact: email });
    return { ok: true };
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (newPassword.length < 6) return { ok: false, message: '新密码至少需要 6 位' };
    const credentials = readCredentials();
    const index = credentials.findIndex(item => item.userId === user.id);
    const currentHash = await hashPassword(currentPassword);
    if (index >= 0 && credentials[index].passwordHash !== currentHash) return { ok: false, message: '当前密码不正确' };
    const passwordHash = await hashPassword(newPassword);
    const next: LocalCredential = { userId: user.id, identifier: user.email, passwordHash, updatedAt: new Date().toISOString() };
    if (index >= 0) credentials[index] = next;
    else credentials.push(next);
    writeCredentials(credentials);
    return { ok: true };
  };

  const addTask = (task: EvalTask) => {
    setUser(prev => ({ ...prev, myTasks: [task, ...prev.myTasks] }));
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
      status: '待受理',
      createdAt: task.createdAt,
      updatedAt: task.createdAt,
      inputs: task.attachments || [],
      outputs: task.reports || [],
    });
  };

  const updateTask = (id: string, updates: Partial<EvalTask>) => {
    setUser(prev => ({
      ...prev,
      myTasks: prev.myTasks.map(t => t.id === id ? { ...t, ...updates } : t),
    }));
  };

  const deleteTask = (id: string) => {
    setUser(prev => ({ ...prev, myTasks: prev.myTasks.filter(t => t.id !== id) }));
  };

  const addModel = (model: MyModel) => {
    setUser(prev => ({ ...prev, myModels: [model, ...prev.myModels] }));
  };

  const ownNotifications = notifications.filter(item => item.userId === user.id);
  const unreadCount = ownNotifications.filter(item => !item.read).length;
  const markNoticeRead = (id: string) => markNotificationRead(id);
  const markAllNoticesRead = () => markAllNotificationsRead(user.id);

  return (
    <UserContext.Provider value={{ user, isGuest, isLoggedIn, login, logout, register, updateAccount, changePassword, addTask, updateTask, deleteTask, addModel, notifications: ownNotifications, unreadCount, markNoticeRead, markAllNoticesRead }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
