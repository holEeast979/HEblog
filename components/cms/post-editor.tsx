"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Save, Eye, ArrowLeft, Plus, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectOption } from "@/components/ui/select"
import { TagInput } from "@/components/ui/tag-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ImageUploader from "@/components/ui/image-uploader"
import { Post } from "@/lib/types"
import { formatDate, formatBeijingTime, getRelativeTime } from "@/lib/utils"

interface PostEditorProps {
  post?: Post
  onSave: (postData: Partial<Post>) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const categoryOptions: SelectOption[] = [
  { value: "AI", label: "AI" },
  { value: "Java", label: "Java" },
  { value: "Python", label: "Python" },
]

export function PostEditor({ post, onSave, onCancel, isLoading }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    summary: post?.summary || '',
    content: post?.content || '',
    category: post?.category || 'AI',
    tags: post?.tags || [],
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [showImageUploader, setShowImageUploader] = useState(false)
  
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空'
    }

    if (!formData.summary.trim()) {
      newErrors.summary = '简介不能为空'
    }

    if (!formData.content.trim()) {
      newErrors.content = '内容不能为空'
    }

    if (!formData.category) {
      newErrors.category = '请选择分类'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSave(formData)
    } catch (error) {
      console.error('保存失败:', error)
    }
  }

  const handleFieldChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除该字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleImageInsert = (markdownText: string) => {
    const textarea = contentTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const currentContent = formData.content

    // 在光标位置插入图片
    const newContent = 
      currentContent.substring(0, start) + 
      markdownText + 
      currentContent.substring(end)

    handleFieldChange('content', newContent)

    // 重新设置光标位置
    setTimeout(() => {
      if (textarea) {
        const newCursorPos = start + markdownText.length
        textarea.setSelectionRange(newCursorPos, newCursorPos)
        textarea.focus()
      }
    }, 0)
  }

  const isEditing = !!post

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 头部操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={onCancel}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Button>
          <h1 className="text-2xl font-bold text-primary-800 dark:text-warm-100">
            {isEditing ? '编辑文章' : '新建文章'}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? '编辑' : '预览'}</span>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? '保存中...' : '保存'}</span>
          </Button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 编辑器 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {showPreview ? '文章预览' : '编辑内容'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showPreview ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 标题 */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-primary-700 dark:text-warm-300">
                      文章标题 *
                    </label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleFieldChange('title', e.target.value)}
                      placeholder="输入文章标题"
                      error={!!errors.title}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                    )}
                  </div>

                  {/* 简介 */}
                  <div className="space-y-2">
                    <label htmlFor="summary" className="text-sm font-medium text-primary-700 dark:text-warm-300">
                      文章简介 *
                    </label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => handleFieldChange('summary', e.target.value)}
                      placeholder="输入文章简介，用于在首页和列表页显示（建议100-200字）"
                      className="min-h-[80px] resize-none"
                      error={!!errors.summary}
                    />
                    {errors.summary && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.summary}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 简介将在首页和列表页作为文章预览显示，建议简洁明了
                    </p>
                  </div>

                  {/* 内容 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="content" className="text-sm font-medium text-primary-700 dark:text-warm-300">
                        文章内容 *
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowImageUploader(!showImageUploader)}
                        className="flex items-center space-x-1"
                      >
                        <Image className="w-4 h-4" />
                        <span>{showImageUploader ? '隐藏' : '图片'}</span>
                      </Button>
                    </div>
                    <Textarea
                      ref={contentTextareaRef}
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleFieldChange('content', e.target.value)}
                      placeholder="输入文章内容（支持Markdown格式）"
                      className="min-h-[400px]"
                      error={!!errors.content}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.content}</p>
                    )}
                    
                    {/* 图片上传组件 */}
                    {showImageUploader && (
                      <div className="mt-4">
                        <ImageUploader
                          onImageInsert={handleImageInsert}
                          className="border-t pt-4"
                        />
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                /* 预览区域 */
                <div className="prose dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold text-primary-800 dark:text-warm-100 mb-4">
                    {formData.title || '未命名文章'}
                  </h1>
                  {formData.summary && (
                    <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-500">
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">📝 文章简介</p>
                      <p className="text-primary-700 dark:text-warm-200 leading-relaxed">
                        {formData.summary}
                      </p>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-primary-700 dark:text-warm-200 leading-relaxed">
                    {formData.content || '暂无内容'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 侧边栏 */}
        <div className="space-y-6">
          {/* 文章信息 */}
          <Card>
            <CardHeader>
              <CardTitle>文章设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 分类 */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-primary-700 dark:text-warm-300">
                  分类 *
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleFieldChange('category', value)}
                  options={categoryOptions}
                  placeholder="选择分类"
                  error={!!errors.category}
                />
                {errors.category && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-700 dark:text-warm-300">
                  标签
                </label>
                <TagInput
                  value={formData.tags}
                  onChange={(tags) => handleFieldChange('tags', tags)}
                  placeholder="输入标签"
                  maxTags={8}
                />
              </div>
            </CardContent>
          </Card>

          {/* 文章状态 */}
          {isEditing && post && (
            <Card>
              <CardHeader>
                <CardTitle>文章信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600 dark:text-warm-400">创建时间</span>
                  <span className="text-sm text-primary-800 dark:text-warm-200">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600 dark:text-warm-400">更新时间</span>
                  <div className="text-right">
                    <div className="text-sm text-primary-800 dark:text-warm-200">
                      {formatBeijingTime(post.updatedAt)}
                    </div>
                    <div className="text-xs text-primary-500 dark:text-warm-500">
                      {getRelativeTime(post.updatedAt)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600 dark:text-warm-400">更新次数</span>
                  <Badge variant="secondary">
                    {post.updates.length} 次
                  </Badge>
                </div>
                {/* 更新历史 */}
                {post.updates.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-primary-200 dark:border-dark-600">
                    <h4 className="text-sm font-medium text-primary-700 dark:text-warm-300 mb-3">
                      最近更新记录
                    </h4>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {post.updates.slice(0, 3).map((update, index) => (
                        <div key={update.id} className="text-xs">
                          <div className="text-primary-600 dark:text-warm-400">
                            {update.description}
                          </div>
                          <div className="text-primary-400 dark:text-warm-600">
                            {getRelativeTime(update.timestamp)}
                          </div>
                        </div>
                      ))}
                      {post.updates.length > 3 && (
                        <div className="text-xs text-primary-400 dark:text-warm-600">
                          还有 {post.updates.length - 3} 条更新记录...
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
