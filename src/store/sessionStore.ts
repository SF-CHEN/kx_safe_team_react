import { create } from 'zustand'

import type { User } from '@/context/UserContext'

interface SessionState {
  user: User | null
  sessionReady: boolean
  setUser: (user: User | null) => void
  setSessionReady: (ready: boolean) => void
  reset: () => void
}

/**
 * 登录会话属于跨页面客户端状态，统一放 Zustand。
 * UserContext 仅保留旧页面兼容 API，不再自己维护第二份 user state。
 */
export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  sessionReady: false,
  setUser: (user) => set({ user }),
  setSessionReady: (sessionReady) => set({ sessionReady }),
  reset: () => set({ user: null, sessionReady: false }),
}))
