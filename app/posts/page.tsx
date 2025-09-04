"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Filter, Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingAnimation } from '@/components/animations/loading-animation'
import { PageTransition } from '@/components/animations/page-transition'
import { Post, Category } from '@/lib/types'
import { formatDate, truncateText } from '@/lib/utils'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([])

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/posts'),
          fetch('/api/categories')
        ])

        if (postsResponse.ok) {
          const postsData = await postsResponse.json()
          setPosts(postsData)
          setFilteredPosts(postsData)
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 从URL参数获取分类过滤器
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
  }, [])

  // 过滤文章
  useEffect(() => {
    let filtered = posts

    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [posts, searchQuery, selectedCategory])

  const categoryOptions = [
    { value: '', label: '全部分类' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI': return 'from-purple-500 to-pink-500'
      case 'Java': return 'from-orange-500 to-red-500'
      case 'Python': return 'from-blue-500 to-green-500'
      default: return 'from-primary-500 to-warm-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation text="加载文章..." size="lg" />
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* 头部 */}
          <div className="text-center mb-12 animate-child">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-800 dark:text-warm-100 mb-4">
              知识文库
            </h1>
            <p className="text-lg text-primary-600 dark:text-warm-300 max-w-2xl mx-auto">
              探索AI、编程和技术相关的知识文章，持续学习，不断成长
            </p>
          </div>

          {/* 搜索和过滤 */}
          <div className="max-w-4xl mx-auto mb-12 animate-child">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary-400 dark:text-warm-500" />
                <Input
                  placeholder="搜索文章标题、内容或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-primary-600 dark:text-warm-400" />
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  options={categoryOptions}
                  className="w-40"
                />
              </div>
            </div>

            {/* 结果统计 */}
            <div className="mt-4 text-center text-sm text-primary-600 dark:text-warm-400">
              {searchQuery || selectedCategory ? (
                <>找到 <span className="font-medium">{filteredPosts.length}</span> 篇相关文章</>
              ) : (
                <>共有 <span className="font-medium">{posts.length}</span> 篇文章</>
              )}
            </div>
          </div>

          {/* 分类快捷过滤器 */}
          {!searchQuery && (
            <div className="max-w-4xl mx-auto mb-12 animate-child">
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  onClick={() => setSelectedCategory('')}
                  className="text-sm"
                >
                  全部分类
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    onClick={() => setSelectedCategory(selectedCategory === category.name ? '' : category.name)}
                    className="text-sm flex items-center space-x-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="text-xs ml-1">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 文章列表 */}
          <div className="max-w-4xl mx-auto animate-child">
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <BookOpen className="h-16 w-16 text-primary-400 dark:text-warm-500 mb-4" />
                  <h3 className="text-xl font-medium text-primary-800 dark:text-warm-100 mb-2">
                    {searchQuery || selectedCategory ? '没有找到匹配的文章' : '还没有文章'}
                  </h3>
                  <p className="text-primary-600 dark:text-warm-400 text-center">
                    {searchQuery || selectedCategory 
                      ? '尝试调整搜索条件或清除过滤器' 
                      : '内容正在准备中，敬请期待'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8">
                {filteredPosts.map((post, index) => (
                  <Card 
                    key={post.id} 
                    className="group hover:shadow-2xl transition-shadow duration-500 cursor-pointer overflow-hidden animate-fade-in glow-effect"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link href={`/posts/${post.id}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 mr-4">
                            <CardTitle className="text-xl group-hover:text-primary-600 dark:group-hover:text-warm-300 transition-colors mb-3">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="text-base leading-relaxed line-clamp-3">
                              {truncateText(post.content.replace(/[#*]/g, '').trim(), 200)}
                            </CardDescription>
                          </div>
                          
                          <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${getCategoryColor(post.category)} text-white shadow-lg flex-shrink-0`}>
                            <span className="text-sm font-semibold">{post.category}</span>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        {/* 标签 */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center space-x-1 hover:bg-primary-200 dark:hover:bg-dark-600 transition-colors">
                              <Tag className="w-3 h-3" />
                              <span>{tag}</span>
                            </Badge>
                          ))}
                        </div>

                        {/* 底部信息 */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-primary-600 dark:text-warm-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.createdAt)}</span>
                            </div>
                            {post.updates.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {post.updates.length} 次更新
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-1 text-primary-600 dark:text-warm-400 group-hover:text-primary-800 dark:group-hover:text-warm-200 transition-colors">
                            <span className="text-sm font-medium">阅读更多</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
