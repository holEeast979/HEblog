"use client"

import { useRouter } from 'next/navigation'
import { PostEditor } from '@/components/cms/post-editor'
import { PageTransition } from '@/components/animations/page-transition'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Post } from '@/lib/types'

export default function NewPostPage() {
  return (
    <AuthGuard>
      <NewPostPageContent />
    </AuthGuard>
  )
}

function NewPostPageContent() {
  const router = useRouter()

  const handleSave = async (postData: Partial<Post>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (response.ok) {
        const newPost = await response.json()
        // TODO: 显示成功提示
        router.push('/admin')
      } else {
        const error = await response.json()
        console.error('Failed to create post:', error)
        // TODO: 显示错误提示
      }
    } catch (error) {
      console.error('Create post error:', error)
      // TODO: 显示错误提示
    }
  }

  const handleCancel = () => {
    router.push('/admin')
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-8">
        <PostEditor
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </PageTransition>
  )
}
