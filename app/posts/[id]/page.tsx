"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Edit, Plus, GitCommit, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Markdown } from '@/components/ui/markdown'
import { LoadingAnimation } from '@/components/animations/loading-animation'
import { PageTransition } from '@/components/animations/page-transition'
import { Post } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface PostPageProps {
  params: { id: string }
}

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${params.id}`)
        
        if (response.ok) {
          const postData = await response.json()
          setPost(postData)
        } else if (response.status === 404) {
          setError('文章不存在')
        } else {
          setError('获取文章失败')
        }
      } catch (error) {
        console.error('Fetch post error:', error)
        setError('网络错误')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

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

  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary-800 dark:text-warm-100 mb-4">
              {error || '文章不存在'}
            </h1>
            <Link href="/posts">
              <Button variant="outline">返回文章列表</Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <article className="min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* 头部导航 */}
          <div className="flex items-center justify-between mb-8 animate-child">
            <Link href="/posts">
              <Button variant="ghost" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>返回文章列表</span>
              </Button>
            </Link>
            
            <Link href={`/admin/edit/${post.id}`}>
              <Button variant="outline" className="flex items-center space-x-2">
                <Edit className="w-4 h-4" />
                <span>编辑文章</span>
              </Button>
            </Link>
          </div>

          {/* 文章头部 */}
          <div className="mb-12 animate-child">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getCategoryColor(post.category)} text-white shadow-lg`}>
                <span className="font-semibold">{post.category}</span>
              </div>
              
              <div className="flex items-center text-primary-600 dark:text-warm-400 space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>更新于 {formatDate(post.updatedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-primary-800 dark:text-warm-100 mb-6 leading-tight">
              {post.title}
            </h1>

            {/* 标签 */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 文章内容 */}
          <Card className="mb-12 animate-child hover:shadow-xl transition-shadow duration-300">
            <CardContent className="pt-8">
              <Markdown content={post.content} />
            </CardContent>
          </Card>

          {/* 追加内容部分 */}
          {post.updates.length > 0 && (
            <div className="space-y-6 animate-child">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-800 dark:text-warm-100 flex items-center space-x-2">
                  <GitCommit className="w-6 h-6" />
                  <span>更新记录 ({post.updates.length})</span>
                </h2>
              </div>

              <div className="space-y-4">
                {post.updates
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((update, index) => (
                    <Card 
                      key={update.id} 
                      className="border-l-4 border-l-warm-500 bg-warm-50/50 dark:bg-warm-900/10 hover:shadow-lg transition-shadow duration-300 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <div className="w-2 h-2 bg-warm-500 rounded-full animate-pulse" />
                            <span>{update.description}</span>
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(update.timestamp)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-white/50 dark:bg-dark-800/50 rounded-lg p-4 border border-primary-200 dark:border-dark-600">
                          <Markdown content={update.content} className="prose-sm" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {/* 底部操作 */}
          <div className="flex justify-center mt-12 animate-child">
            <Link href="/posts">
              <Button variant="outline" size="lg">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回文章列表
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </PageTransition>
  )
}
