"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Save, Eye, ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectOption } from "@/components/ui/select"
import { TagInput } from "@/components/ui/tag-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Post } from "@/lib/types"
import { formatDate } from "@/lib/utils"

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
    content: post?.content || '',
    category: post?.category || '',
    tags: post?.tags || [],
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '标题不能为空'
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

                  {/* 内容 */}
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium text-primary-700 dark:text-warm-300">
                      文章内容 *
                    </label>
                    <Textarea
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
                  </div>
                </form>
              ) : (
                /* 预览区域 */
                <div className="prose dark:prose-invert max-w-none">
                  <h1 className="text-3xl font-bold text-primary-800 dark:text-warm-100 mb-4">
                    {formData.title || '未命名文章'}
                  </h1>
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
                  <span className="text-sm text-primary-800 dark:text-warm-200">
                    {formatDate(post.updatedAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-primary-600 dark:text-warm-400">更新次数</span>
                  <Badge variant="secondary">
                    {post.updates.length} 次
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
