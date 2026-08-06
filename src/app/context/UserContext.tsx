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
  status: '评测中' | '评测完成' | '评测失败' | '已暂停' | '排队中';
  score: number | null;
  createdAt: string;
  plan: 'free' | 'paid';
  shareLink?: string;
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
}

interface UserContextType {
  user: User;
  isGuest: boolean;
  isLoggedIn: boolean;
  sessionReady: boolean;
  login: (account: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    nickname?: string,
    rememberMe?: boolean,
  ) => Promise<boolean>;
  clearSession: () => void;
  addTask: (task: EvalTask) => void;
  updateTask: (id: string, updates: Partial<EvalTask>) => void;
  deleteTask: (id: string) => void;
  addModel: (model: MyModel) => void;
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
};

const LOCAL_DATA_PREFIX = 'xuanjian-local-data:';

function localDataKey(userId: string) {
  return `${LOCAL_DATA_PREFIX}${userId}`;
}

function loadLocalWorkspace(userId: string): Pick<User, 'myModels' | 'myTasks' | 'myEvalSets'> {
  try {
    const raw = localStorage.getItem(localDataKey(userId));
    if (!raw) return { myModels: [], myTasks: [], myEvalSets: [] };
    const parsed = JSON.parse(raw) as Partial<User>;
    return {
      myModels: Array.isArray(parsed.myModels) ? parsed.myModels : [],
      myTasks: Array.isArray(parsed.myTasks) ? parsed.myTasks : [],
      myEvalSets: Array.isArray(parsed.myEvalSets) ? parsed.myEvalSets : [],
    };
  } catch {
    return { myModels: [], myTasks: [], myEvalSets: [] };
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
    }),
  );
}

function mapApiUser(apiUser: AuthUser): User {
  const id = String(apiUser.id);
  const workspace = loadLocalWorkspace(id);
  const roleRaw = String(apiUser.role || 'user').toLowerCase();
  const role = (roleRaw === 'admin' ? 'admin' : 'user') as UserRole;
  return {
    id,
    name: apiUser.nickname || apiUser.username || '',
    username: apiUser.username || '',
    nickname: apiUser.nickname || apiUser.username || '',
    email: apiUser.email || '',
    role,
    isActive: apiUser.is_active !== false,
    ...workspace,
  };
}

function applyAuthSession(session: AuthSession, rememberMe: boolean): User {
  setToken(session.token, session.expires_at_ms, rememberMe);
  return mapApiUser(session.user);
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(guestUser);
  const [sessionReady, setSessionReady] = useState(false);

  const clearSession = useCallback(() => {
    removeToken();
    setUser(guestUser);
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

  const isGuest = user.role === 'guest';
  const isLoggedIn = user.role !== 'guest';

  const login = async (account: string, password: string, rememberMe = false) => {
    const session = await loginAuth({
      account,
      password,
      remember_me: rememberMe,
    });
    setUser(applyAuthSession(session, rememberMe));
    return true;
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
    setUser(applyAuthSession(session, rememberMe));
    return true;
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

  const addTask = (task: EvalTask) => {
    setUser((prev) => ({ ...prev, myTasks: [task, ...prev.myTasks] }));
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

  return (
    <UserContext.Provider
      value={{
        user,
        isGuest,
        isLoggedIn,
        sessionReady,
        login,
        logout,
        register,
        clearSession,
        addTask,
        updateTask,
        deleteTask,
        addModel,
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
