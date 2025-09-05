"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PostEditor } from '@/components/cms/post-editor'
import { PageTransition } from '@/components/animations/page-transition'
import { LoadingAnimation } from '@/components/animations/loading-animation'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Post } from '@/lib/types'

interface EditPostPageProps {
  params: { id: string }
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return (
    <AuthGuard>
      <EditPostPageContent params={params} />
    </AuthGuard>
  )
}

function EditPostPageContent({ params }: EditPostPageProps) {
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

  const handleSave = async (postData: Partial<Post>) => {
    try {
      console.log('开始保存文章，数据：', postData)
      
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      console.log('API响应状态：', response.status)
      
      if (response.ok) {
        const updatedPost = await response.json()
        console.log('文章保存成功：', updatedPost)
        setPost(updatedPost)
        alert('文章保存成功！')
        router.push('/admin')
      } else {
        const errorData = await response.json().catch(() => ({ error: '未知错误' }))
        console.error('保存失败，服务器响应：', { status: response.status, data: errorData })
        alert(`保存失败：${errorData.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('网络或其他错误：', error)
      alert(`保存失败：${error instanceof Error ? error.message : '网络错误'}`)
    }
  }

  const handleCancel = () => {
    router.push('/admin')
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
            <button
              onClick={() => router.push('/admin')}
              className="text-primary-600 dark:text-warm-400 hover:underline"
            >
              返回管理页面
            </button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-8">
        <PostEditor
          post={post}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </PageTransition>
  )
}
