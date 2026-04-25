"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { authApi, getStoredToken, setStoredToken, User, usersApi } from "@/lib/api"

interface AuthUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "Student" | "Mentor"
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string, role: "Student" | "Mentor") => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  role: "Student" | "Mentor"
}

const USER_STORAGE_KEY = "smartcareer_user"
const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
}

const globalForAuthContext = globalThis as typeof globalThis & {
  __studypathAuthContext?: React.Context<AuthContextType>
}

const AuthContext =
  globalForAuthContext.__studypathAuthContext ?? createContext<AuthContextType>(defaultAuthContext)

if (!globalForAuthContext.__studypathAuthContext) {
  globalForAuthContext.__studypathAuthContext = AuthContext
}

function normalizeUser(user: User): AuthUser {
  return {
    id: String(user.id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const boot = async () => {
      const token = getStoredToken()
      try {
        if (!token) {
          setUser(null)
          localStorage.removeItem(USER_STORAGE_KEY)
          return
        }

        const res = await authApi.me().catch(() => null)
        if (res?.user) {
          const normalized = normalizeUser(res.user)
          setUser(normalized)
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalized))
        } else {
          setUser(null)
          setStoredToken(null)
          localStorage.removeItem(USER_STORAGE_KEY)
        }
      } catch {
        setUser(null)
        setStoredToken(null)
        localStorage.removeItem(USER_STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    boot()
  }, [])

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const saved = await usersApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      })
      const newUser = normalizeUser(saved)
      setUser(newUser)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser))
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, role: "Student" | "Mentor") => {
    setIsLoading(true)
    try {
      const found = await usersApi.login(email, password)
      const loggedUser = normalizeUser({ ...found, role: found.role || role })
      setUser(loggedUser)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser))
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setStoredToken(null)
    localStorage.removeItem(USER_STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
