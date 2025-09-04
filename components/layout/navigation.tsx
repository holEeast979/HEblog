"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Book, Settings, Home, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { SearchButton } from '@/components/layout/search-button'
import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: '首页', href: '/', icon: Home },
  { name: '知识库', href: '/posts', icon: Book },
  { name: '管理', href: '/admin', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  // 过滤导航项，只有认证用户才能看到管理链接
  const visibleNavigation = navigation.filter(item => 
    item.href !== '/admin' || isAuthenticated
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-200/50 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:border-dark-700/50 dark:bg-dark-900/80 dark:supports-[backdrop-filter]:bg-dark-900/60 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center">
          {/* Logo - 左侧 */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-3 font-bold text-xl text-primary-800 dark:text-warm-100 hover:text-primary-600 dark:hover:text-warm-300 transition-colors duration-300"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-warm-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg transform rotate-3 hover:rotate-6 transition-transform duration-300 glow-effect">
                  HE
                </div>
              </div>
              <span>HEblog</span>
            </Link>
          </div>

          {/* Navigation Links - 中间 */}
          <div className="flex-1 flex justify-center">
            <nav className="hidden md:flex items-center space-x-2">
              {visibleNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "relative text-sm font-medium transition-all duration-300",
                        isActive 
                          ? "bg-primary-500 text-white shadow-lg glow-effect" 
                          : "text-primary-700 hover:text-primary-600 hover:bg-primary-100 dark:text-warm-300 dark:hover:text-warm-100 dark:hover:bg-dark-700"
                      )}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
                      {isActive && (
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500 to-warm-500 opacity-20 animate-pulse" />
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Side Actions - 右侧 */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <SearchButton />
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden sm:inline-flex h-9 w-9 rounded-full bg-red-100/50 backdrop-blur-sm border border-red-200/50 hover:bg-red-200/70 dark:bg-red-800/50 dark:border-red-700/50 dark:hover:bg-red-700/70 transition-all duration-300"
                title="退出管理"
              >
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="sr-only">退出管理</span>
              </Button>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation - TODO: Implement hamburger menu */}
          <div className="md:hidden ml-4">
            {/* Placeholder for mobile menu button */}
          </div>
        </div>
      </div>
    </header>
  )
}
