"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { debounce } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
}

export function SearchButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 搜索函数
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/posts?q=${encodeURIComponent(query)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data.slice(0, 5)) // 限制显示5个结果
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  // 防抖搜索
  const debouncedSearch = debounce(performSearch, 300)

  // 监听搜索输入
  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery])

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      setSearchQuery('')
    } else if (e.key === 'Enter' && results.length > 0) {
      // 导航到第一个结果
      router.push(`/posts/${results[0].id}`)
      setIsOpen(false)
      setSearchQuery('')
    }
  }

  // 点击结果项
  const handleResultClick = (postId: string) => {
    router.push(`/posts/${postId}`)
    setIsOpen(false)
    setSearchQuery('')
  }

  // 打开搜索框
  const openSearch = () => {
    setIsOpen(true)
  }

  // 关闭搜索框
  const closeSearch = () => {
    setIsOpen(false)
    setSearchQuery('')
    setResults([])
  }

  // 截取文本
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  // 高亮搜索关键词
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    return text.replace(regex, '<mark class="bg-warm-200 dark:bg-warm-800 rounded px-1">$1</mark>')
  }

  return (
    <>
      {/* 搜索按钮 */}
      <Button
        variant="ghost"
        size="sm"
        onClick={openSearch}
        className="hidden sm:inline-flex h-9 w-9 rounded-full bg-primary-100/50 backdrop-blur-sm border border-primary-200/50 hover:bg-primary-200/70 dark:bg-dark-800/50 dark:border-dark-700/50 dark:hover:bg-dark-700/70 transition-all duration-300"
      >
        <Search className="h-4 w-4 text-primary-700 dark:text-warm-400" />
        <span className="sr-only">搜索</span>
      </Button>

      {/* 搜索覆盖层 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" onClick={closeSearch}>
          <div className="flex min-h-screen items-start justify-center p-4 pt-20">
            <div 
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 搜索输入框 */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400 dark:text-warm-500" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="搜索文章标题、内容或标签..."
                  className="pl-10 pr-12 h-12 text-lg bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm border-2 border-primary-300 dark:border-dark-600 shadow-lg"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* 搜索结果 */}
              {(loading || results.length > 0) && (
                <Card className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm shadow-xl border-primary-200 dark:border-dark-600">
                  <CardContent className="p-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                        <span className="ml-2 text-primary-600 dark:text-warm-400">搜索中...</span>
                      </div>
                    ) : results.length > 0 ? (
                      <div className="space-y-3">
                        <div className="text-sm text-primary-600 dark:text-warm-400 mb-3">
                          找到 {results.length} 个结果
                        </div>
                        {results.map((result, index) => (
                          <div
                            key={result.id}
                            onClick={() => handleResultClick(result.id)}
                            className={cn(
                              "p-3 rounded-lg border cursor-pointer transition-all duration-200",
                              "hover:bg-primary-50 dark:hover:bg-dark-700 hover:shadow-md",
                              "border-primary-200 dark:border-dark-600",
                              index === 0 ? "ring-2 ring-primary-500/20" : ""
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 
                                  className="font-medium text-primary-800 dark:text-warm-100 mb-1"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(result.title, searchQuery)
                                  }}
                                />
                                <p 
                                  className="text-sm text-primary-600 dark:text-warm-400 line-clamp-2 mb-2"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightText(
                                      truncateText(result.content.replace(/[#*]/g, '').trim(), 100), 
                                      searchQuery
                                    )
                                  }}
                                />
                                <div className="flex items-center space-x-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {result.category}
                                  </Badge>
                                  {result.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {results.length === 5 && (
                          <div className="text-center pt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                router.push(`/posts?q=${encodeURIComponent(searchQuery)}`)
                                closeSearch()
                              }}
                              className="text-primary-600 dark:text-warm-400"
                            >
                              查看更多结果 →
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : searchQuery.trim() && (
                      <div className="text-center py-8">
                        <div className="text-primary-500 dark:text-warm-500 mb-2">未找到匹配的文章</div>
                        <div className="text-sm text-primary-400 dark:text-warm-600">
                          尝试使用不同的关键词搜索
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 搜索提示 */}
              {!searchQuery && !loading && (
                <Card className="bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm shadow-xl border-primary-200 dark:border-dark-600">
                  <CardContent className="p-4">
                    <div className="text-center text-primary-600 dark:text-warm-400">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>输入关键词搜索文章</p>
                      <p className="text-xs mt-1 opacity-75">支持搜索标题、内容和标签</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
