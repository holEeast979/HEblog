"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingAnimation } from '@/components/animations/loading-animation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Post } from '@/lib/types'
import { formatDate, truncateText, getRelativeTime } from '@/lib/utils'

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminPageContent />
    </AuthGuard>
  )
}

function AdminPageContent() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  // 获取文章数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts')
        if (response.ok) {
          const postsData = await response.json()
          console.log('Posts data:', postsData)
          setPosts(postsData)
        } else {
          console.error('Failed to fetch posts:', response.status)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

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
        alert('文章删除成功！')
      } else {
        alert('删除失败，请重试')
        console.error('Failed to delete post')
      }
    } catch (error) {
      alert('删除失败，请检查网络连接')
      console.error('Delete post error:', error)
    }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-warm-50 dark:from-dark-900 dark:to-dark-800">
      <div className="container mx-auto px-4 py-8 animate-fade-in">
        {/* 简洁的头部 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-6 shadow-2xl">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-primary-800 dark:text-warm-100 mb-4">
            🔐 管理员界面
          </h1>
          <p className="text-xl text-primary-600 dark:text-warm-300 mb-8">
            管理和编辑你的所有文章
          </p>
          
          <Link href="/admin/new">
            <Button size="xl" variant="glow" className="text-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-2xl">
              <Plus className="w-6 h-6 mr-2" />
              创建新文章
            </Button>
          </Link>
        </div>

        {/* 简化的文章列表 */}
        {posts.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-12 shadow-2xl">
              <CardContent>
                <div className="mb-6">
                  <Edit className="w-20 h-20 text-primary-400 dark:text-warm-500 mx-auto mb-4" />
                </div>
                <h3 className="text-2xl font-bold text-primary-800 dark:text-warm-100 mb-4">
                  还没有文章
                </h3>
                <p className="text-lg text-primary-600 dark:text-warm-400 mb-8">
                  开始创建你的第一篇文章吧！
                </p>
                <Link href="/admin/new">
                  <Button size="lg" variant="glow">
                    <Plus className="w-5 h-5 mr-2" />
                    创建文章
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-primary-800 dark:text-warm-100 mb-2">
                所有文章 ({posts.length})
              </h2>
              <p className="text-primary-600 dark:text-warm-400">
                点击编辑按钮开始修改你的文章
              </p>
            </div>
            
            <div className="grid gap-6">
              {posts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="hover:shadow-2xl transition-all duration-300 animate-fade-in border-l-4 border-l-primary-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <CardTitle className="text-xl mb-2 text-primary-800 dark:text-warm-100">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-base line-clamp-2">
                          {truncateText(post.content.replace(/[#*]/g, '').trim(), 150)}
                        </CardDescription>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-br ${getCategoryColor(post.category)} text-white shadow-lg flex-shrink-0`}>
                        <span className="text-sm font-semibold">{post.category}</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* 标签 */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 6).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 6 && (
                          <Badge variant="secondary" className="text-sm px-3 py-1">
                            +{post.tags.length - 6}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* 底部信息和操作 */}
                    <div className="flex items-center justify-between pt-4 border-t border-primary-200 dark:border-dark-600">
                      <div className="flex items-center space-x-4 text-sm text-primary-600 dark:text-warm-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        {post.updates.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {post.updates.length} 次更新 • {getRelativeTime(post.updatedAt)}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link href={`/admin/edit/${post.id}`}>
                          <Button size="lg" variant="glow" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                            <Edit className="w-5 h-5 mr-2" />
                            编辑文章
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="lg"
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                        >
                          <Trash2 className="w-5 h-5 mr-2" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
