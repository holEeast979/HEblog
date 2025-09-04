"use client"

import React, { useState } from 'react'
import { useAuth } from './auth-provider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <>{children}</>
  }

  return fallback || <LoginForm />
}

function LoginForm() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 模拟一点加载时间
    await new Promise(resolve => setTimeout(resolve, 500))

    const success = login(password)
    if (!success) {
      setError('密码错误，请重试')
      setPassword('')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-primary-50 via-warm-50 to-primary-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-primary-200 dark:border-dark-600 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-500 to-warm-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary-800 dark:text-warm-100">
              管理员验证
            </CardTitle>
            <CardDescription className="text-primary-600 dark:text-warm-400 mt-2">
              请输入管理密码以访问内容管理功能
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-400 dark:text-warm-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入管理密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12 h-12 bg-white/50 dark:bg-dark-700/50 border-primary-300 dark:border-dark-600 focus:border-primary-500 dark:focus:border-warm-500"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-warm-500 hover:text-primary-600 dark:hover:text-warm-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-primary-500 to-warm-500 hover:from-primary-600 hover:to-warm-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    验证中...
                  </div>
                ) : (
                  '登录管理'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-primary-200 dark:border-dark-600">
              <div className="text-center text-sm text-primary-500 dark:text-warm-500">
                <p>💡 这是为了保护您的博客内容管理功能</p>
                <p className="mt-1">访客可以正常浏览所有文章内容</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
