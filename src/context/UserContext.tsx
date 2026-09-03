import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

import {
  getCurrentUser,
  loginAuth,
  logoutAuth,
  registerAuth,
  type AuthSession,
  type AuthUser,
} from '@/api/auth'
import { useSessionStore } from '@/store/sessionStore'
import { getToken, isTokenExpired, removeToken, setToken } from '@/utils/auth'
import { setUnauthorizedHandler } from '@/utils/gateway'
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
  type WorkflowCommunication,
  type WorkflowStatus,
} from '../data/workflowStore'

export type UserRole = 'guest' | 'user' | 'admin'

/** 本地 EvalTask 仅用于没有真实接口的 mock 工作流。正式任务由 TanStack Query + 后端任务总表负责。 */
export interface EvalTask {
  id: string
  name: string
  model: string
  modelType: string
  evalSet: string
  evalType:
    | '个人敏感信息审查'
    | '模型数据安全评测'
    | '数据集安全评测'
    | 'AIGC内容审核'
    | '深度模型可信测评'
    | '大模型安全评测'
    | '多模态大模型安全评测'
    | '大模型评测'
    | '智能体安全评测'
    | '训练集评测'
  status: '评测中' | '评测完成' | '评测失败' | '已暂停' | '排队中' | WorkflowStatus
  score: number | null
  createdAt: string
  plan: 'free' | 'paid'
  shareLink?: string
  requirement?: string
  configSummary?: string
  attachments?: StoredAttachment[]
  reports?: StoredAttachment[]
  pushedAt?: string
  publicMessage?: string
  supplementDueAt?: string
  supplementCategory?: string
  communications?: WorkflowCommunication[]
  terminationReason?: string
}

export interface EvalSet {
  id: string
  name: string
  category: string
  count: number
  createdAt: string
}

export interface User {
  id: string
  name: string
  username?: string
  nickname?: string
  email: string
  role: UserRole
  avatar?: string
  isActive?: boolean
  /** 仅包含无真实接口的 mock 任务。 */
  myTasks: EvalTask[]
  myEvalSets: EvalSet[]
  notificationPreference?: 'site' | 'contact' | 'both'
}

interface UserContextType {
  user: User
  isGuest: boolean
  isLoggedIn: boolean
  isAdmin: boolean
  sessionReady: boolean
  login: (account: string, password: string, rememberMe?: boolean) => Promise<User>
  logout: () => Promise<void>
  register: (
    username: string,
    email: string,
    password: string,
    nickname?: string,
    rememberMe?: boolean,
  ) => Promise<User>
  clearSession: () => void
  updateAccount: (updates: {
    name: string
    email: string
    notificationPreference: 'site' | 'contact' | 'both'
  }) => Promise<{ ok: boolean; message?: string }>
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message?: string }>
  addTask: (task: EvalTask) => void
  updateTask: (id: string, updates: Partial<EvalTask>) => void
  deleteTask: (id: string) => void
  notifications: UserNotification[]
  unreadCount: number
  markNoticeRead: (id: string) => void
  markAllNoticesRead: () => void
}

const guestUser: User = {
  id: 'guest',
  name: '游客',
  username: '',
  email: '',
  role: 'guest',
  myTasks: [],
  myEvalSets: [],
  notificationPreference: 'both',
}

const LOCAL_DATA_PREFIX = 'xuanjian-local-data:'

export function getDefaultUserName(identifier: string): string {
  const account = identifier.trim()
  if (/^1\d{10}$/.test(account)) return `用户 ${account.slice(-4)}`
  if (account.includes('@')) {
    const prefix = account.split('@')[0].trim()
    return `用户 ${prefix || '新用户'}`
  }
  return account ? `用户 ${account.slice(-4)}` : '普通用户'
}

function localDataKey(userId: string) {
  return `${LOCAL_DATA_PREFIX}${userId}`
}

interface LocalWorkspace {
  myTasks: EvalTask[]
  myEvalSets: EvalSet[]
  notificationPreference: 'site' | 'contact' | 'both'
  name: string
  email: string
}

function emptyWorkspace(): LocalWorkspace {
  return {
    myTasks: [],
    myEvalSets: [],
    notificationPreference: 'both',
    name: '',
    email: '',
  }
}

function loadLocalWorkspace(userId: string): LocalWorkspace {
  try {
    const raw = localStorage.getItem(localDataKey(userId))
    if (!raw) return emptyWorkspace()

    const parsed = JSON.parse(raw) as Partial<User>
    return {
      myTasks: Array.isArray(parsed.myTasks) ? parsed.myTasks : [],
      myEvalSets: Array.isArray(parsed.myEvalSets) ? parsed.myEvalSets : [],
      notificationPreference: parsed.notificationPreference || 'both',
      name: typeof parsed.name === 'string' ? parsed.name : '',
      email: typeof parsed.email === 'string' ? parsed.email : '',
    }
  } catch {
    return emptyWorkspace()
  }
}

function saveLocalWorkspace(user: User) {
  if (user.role === 'guest') return
  localStorage.setItem(
    localDataKey(user.id),
    JSON.stringify({
      myTasks: user.myTasks,
      myEvalSets: user.myEvalSets,
      notificationPreference: user.notificationPreference || 'both',
      name: user.name,
      email: user.email,
    }),
  )
}

function mapApiUser(apiUser: AuthUser): User {
  const id = String(apiUser.id)
  const workspace = loadLocalWorkspace(id)
  const roleRaw = String(apiUser.role || 'user').toLowerCase()
  const role = (roleRaw === 'admin' ? 'admin' : 'user') as UserRole
  const fallbackName = apiUser.nickname || apiUser.username || ''

  return {
    id,
    name: workspace.name || fallbackName,
    username: apiUser.username || '',
    nickname: apiUser.nickname || apiUser.username || '',
    email: workspace.email || apiUser.email || apiUser.username || '',
    role,
    isActive: apiUser.is_active !== false,
    myTasks: workspace.myTasks,
    myEvalSets: workspace.myEvalSets,
    notificationPreference: workspace.notificationPreference || 'both',
  }
}

function applyAuthSession(session: AuthSession, rememberMe: boolean): User {
  setToken(session.token, session.expires_at_ms, rememberMe)
  return mapApiUser(session.user)
}

function updateStoredUser(updater: User | ((previous: User) => User)) {
  const current = useSessionStore.getState().user ?? guestUser
  const next = typeof updater === 'function' ? updater(current) : updater
  useSessionStore.getState().setUser(next)
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const storedUser = useSessionStore((state) => state.user)
  const sessionReady = useSessionStore((state) => state.sessionReady)
  const user = storedUser ?? guestUser
  const [notifications, setNotifications] = useState<UserNotification[]>([])

  const clearSession = useCallback(() => {
    removeToken()
    useSessionStore.getState().setUser(null)
  }, [])

  const refreshWorkflow = useCallback(() => {
    setNotifications(getNotifications())
    updateStoredUser((prev) => {
      if (prev.role === 'guest') return prev
      const workflows = getWorkflowTasks().filter((item) => item.userId === prev.id)
      if (!workflows.length) return prev

      const merged = prev.myTasks.map((task) => {
        const workflow = workflows.find((item) => item.id === task.id)
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
          : task
      })
      const known = new Set(merged.map((task) => task.id))
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
        }))
      return { ...prev, myTasks: [...extras, ...merged] }
    })
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(clearSession)
    return () => setUnauthorizedHandler(null)
  }, [clearSession])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const token = getToken()
      if (!token || isTokenExpired()) {
        if (token) removeToken()
        if (!cancelled) useSessionStore.getState().setSessionReady(true)
        return
      }

      try {
        const apiUser = await getCurrentUser()
        if (!cancelled) useSessionStore.getState().setUser(mapApiUser(apiUser))
      } catch {
        if (!cancelled) clearSession()
      } finally {
        if (!cancelled) useSessionStore.getState().setSessionReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clearSession])

  useEffect(() => {
    saveLocalWorkspace(user)
  }, [user])

  useEffect(() => {
    refreshWorkflow()
    window.addEventListener(WORKFLOW_EVENT, refreshWorkflow)
    window.addEventListener('storage', refreshWorkflow)
    return () => {
      window.removeEventListener(WORKFLOW_EVENT, refreshWorkflow)
      window.removeEventListener('storage', refreshWorkflow)
    }
  }, [refreshWorkflow])

  const isGuest = user.role === 'guest'
  const isLoggedIn = user.role !== 'guest'
  const isAdmin = user.role === 'admin'

  const login = async (account: string, password: string, rememberMe = false) => {
    const session = await loginAuth({ account, password, remember_me: rememberMe })
    const next = applyAuthSession(session, rememberMe)
    useSessionStore.getState().setUser(next)
    upsertPlatformUser({
      id: next.id,
      name: next.name,
      contact: next.email || account,
      role: next.role === 'admin' ? 'admin' : 'user',
    })
    recordPlatformActivity(next.id, '登录')
    return next
  }

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
    })
    const mapped = applyAuthSession(session, rememberMe)
    const next: User = {
      ...mapped,
      name: nickname || mapped.name,
      email: email || mapped.email,
    }
    useSessionStore.getState().setUser(next)
    upsertPlatformUser({
      id: next.id,
      name: next.name,
      contact: next.email || username,
      role: next.role === 'admin' ? 'admin' : 'user',
    })
    return next
  }

  const logout = async () => {
    try {
      if (getToken()) await logoutAuth()
    } catch {
      // 当前后端没有登出接口；即使未来接口短暂失败，也必须清理本地会话。
    } finally {
      clearSession()
    }
  }

  const updateAccount = async (updates: {
    name: string
    email: string
    notificationPreference: 'site' | 'contact' | 'both'
  }) => {
    const name = updates.name.trim()
    const email = updates.email.trim()
    if (!name || !email) return { ok: false, message: '显示名称和登录账号不能为空' }

    // 后端暂无资料编辑接口，因此这里只保存明确的本地展示偏好，不伪装成服务端资料更新。
    updateStoredUser((prev) => ({
      ...prev,
      name,
      email,
      notificationPreference: updates.notificationPreference,
    }))
    upsertPlatformUser({
      id: user.id,
      name,
      contact: email,
      role: user.role === 'admin' ? 'admin' : 'user',
    })
    return { ok: true }
  }

  const changePassword = async (_currentPassword: string, newPassword: string) => {
    if (newPassword.length < 6) return { ok: false, message: '新密码至少需要 6 位' }
    return { ok: false, message: '密码修改接口尚未开放，请联系管理员' }
  }

  const addTask = (task: EvalTask) => {
    updateStoredUser((prev) => ({ ...prev, myTasks: [task, ...prev.myTasks] }))
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
    })
  }

  const updateTask = (id: string, updates: Partial<EvalTask>) => {
    updateStoredUser((prev) => ({
      ...prev,
      myTasks: prev.myTasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    }))
  }

  const deleteTask = (id: string) => {
    updateStoredUser((prev) => ({
      ...prev,
      myTasks: prev.myTasks.filter((task) => task.id !== id),
    }))
  }

  const ownNotifications = notifications.filter((item) => item.userId === user.id)
  const unreadCount = ownNotifications.filter((item) => !item.read).length
  const markNoticeRead = (id: string) => markNotificationRead(id)
  const markAllNoticesRead = () => markAllNotificationsRead(user.id)

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
        notifications: ownNotifications,
        unreadCount,
        markNoticeRead,
        markAllNoticesRead,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
