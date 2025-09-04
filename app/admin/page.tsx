"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Eye, Calendar, Tag, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingAnimation } from '@/components/animations/loading-animation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Post, Category } from '@/lib/types'
import { formatDate, truncateText } from '@/lib/utils'

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPageContent />
    </AuthGuard>
  )
}

function AdminPageContent() {
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
          console.log('Posts data:', postsData)
          setPosts(postsData)
          setFilteredPosts(postsData)
        } else {
          console.error('Failed to fetch posts:', postsResponse.status)
        }

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          console.log('Categories data:', categoriesData)
          setCategories(categoriesData)
        } else {
          console.error('Failed to fetch categories:', categoriesResponse.status)
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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

  const handleDeletePost = async (postId: string) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
        // TODO: 显示成功提示
      } else {
        // TODO: 显示错误提示
        console.error('Failed to delete post')
      }
    } catch (error) {
      console.error('Delete post error:', error)
    }
  }

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
        <LoadingAnimation text="加载管理界面..." size="lg" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* 头部 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-primary-800 dark:text-warm-100">
              内容管理
            </h1>
            <p className="text-primary-600 dark:text-warm-300 mt-1">
              管理你的知识文章和内容
            </p>
          </div>

          <div>
            <Link href="/admin/new">
              <Button size="lg" variant="glow" className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>新建文章</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-xl transition-shadow duration-300 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总文章数</CardTitle>
              <Edit className="h-4 w-4 text-primary-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800 dark:text-warm-100">
                {posts.length}
              </div>
              <p className="text-xs text-primary-600 dark:text-warm-400">
                已发布的文章
              </p>
            </CardContent>
          </Card>

          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="hover:shadow-xl transition-shadow duration-300 animate-fade-in glow-effect"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(category.name)} text-white transform hover:scale-110 transition-transform duration-200`}>
                  <span className="text-sm font-bold">{category.icon}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-800 dark:text-warm-100">
                  {category.count}
                </div>
                <p className="text-xs text-primary-600 dark:text-warm-400">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 搜索和过滤 */}
        <div className="flex flex-col md:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
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

        {/* 文章列表 */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Edit className="h-12 w-12 text-primary-400 dark:text-warm-500 mb-4" />
                <h3 className="text-lg font-medium text-primary-800 dark:text-warm-100 mb-2">
                  {searchQuery || selectedCategory ? '没有找到匹配的文章' : '还没有文章'}
                </h3>
                <p className="text-primary-600 dark:text-warm-400 text-center mb-6">
                  {searchQuery || selectedCategory 
                    ? '尝试调整搜索条件或清除过滤器' 
                    : '创建你的第一篇文章，开始分享知识'
                  }
                </p>
                {!searchQuery && !selectedCategory && (
                  <Link href="/admin/new">
                    <Button variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      新建文章
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="hover:shadow-2xl transition-shadow duration-300 animate-fade-in glow-effect"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <CardTitle className="text-lg hover:text-primary-600 dark:hover:text-warm-300 transition-colors cursor-pointer">
                          <Link href={`/posts/${post.id}`}>
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2">
                          {truncateText(post.content.replace(/[#*]/g, '').trim(), 120)}
                        </CardDescription>
                      </div>
                      
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${getCategoryColor(post.category)} text-white shadow-md flex-shrink-0`}>
                        <span className="text-xs font-semibold">{post.category}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* 标签 */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{post.tags.length - 4}
                        </Badge>
                      )}
                    </div>

                    {/* 底部信息和操作 */}
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

                      <div className="flex items-center space-x-1">
                        <Link href={`/posts/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/edit/${post.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
  )
}
