"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // 检查本地存储中的认证状态
    const stored = localStorage.getItem('blog-auth')
    if (stored === 'authenticated') {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (password: string): boolean => {
    // 从环境变量获取管理密码，如果没有则使用默认值
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'HEblog2024'
    
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('blog-auth', 'authenticated')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('blog-auth')
  }

  const checkAuth = () => {
    return isAuthenticated
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
