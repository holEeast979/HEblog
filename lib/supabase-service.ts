import { supabase } from './supabase'
import { Post, Category, PostUpdate, ApiResponse } from './types'
import { generateId, getBeijingTime } from './utils'

export class SupabaseService {
  // 获取所有文章
  static async getAllPosts(): Promise<ApiResponse<Post[]>> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取文章失败:', error)
        return { success: false, error: 'Failed to fetch posts' }
      }

      // 转换数据格式以匹配现有的Post类型
      const posts: Post[] = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        updates: [] // 需要时单独查询
      }))

      return { success: true, data: posts }
    } catch (error) {
      console.error('获取文章出错:', error)
      return { success: false, error: 'Failed to fetch posts' }
    }
  }

  // 根据ID获取文章（包含更新记录）
  static async getPostById(id: string): Promise<ApiResponse<Post>> {
    try {
      // 获取文章基本信息
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (postError) {
        console.error('获取文章失败:', postError)
        return { success: false, error: postError.code === 'PGRST116' ? 'Post not found' : 'Failed to fetch post' }
      }

      // 获取更新记录（按时间降序，最新的在前面）
      const { data: updatesData, error: updatesError } = await supabase
        .from('post_updates')
        .select('*')
        .eq('post_id', id)
        .order('timestamp', { ascending: false })

      const updates: PostUpdate[] = updatesData?.map(update => ({
        id: update.id,
        content: update.content,
        description: update.description,
        timestamp: update.timestamp
      })) || []

      const post: Post = {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags || [],
        createdAt: postData.created_at,
        updatedAt: postData.updated_at,
        updates
      }

      return { success: true, data: post }
    } catch (error) {
      console.error('获取文章出错:', error)
      return { success: false, error: 'Failed to fetch post' }
    }
  }

  // 根据分类获取文章
  static async getPostsByCategory(category: string): Promise<ApiResponse<Post[]>> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('按分类获取文章失败:', error)
        return { success: false, error: 'Failed to fetch posts by category' }
      }

      const posts: Post[] = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        updates: []
      }))

      return { success: true, data: posts }
    } catch (error) {
      console.error('按分类获取文章出错:', error)
      return { success: false, error: 'Failed to fetch posts by category' }
    }
  }

  // 搜索文章
  static async searchPosts(query: string, category?: string): Promise<ApiResponse<Post[]>> {
    try {
      let queryBuilder = supabase.from('posts').select('*')

      // 按分类过滤
      if (category) {
        queryBuilder = queryBuilder.eq('category', category)
      }

      // 搜索标题和内容
      queryBuilder = queryBuilder.or(
        `title.ilike.%${query}%,content.ilike.%${query}%`
      )

      const { data, error } = await queryBuilder.order('created_at', { ascending: false })

      if (error) {
        console.error('搜索文章失败:', error)
        return { success: false, error: 'Failed to search posts' }
      }

      const posts: Post[] = data.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        tags: post.tags || [],
        createdAt: post.created_at,
        updatedAt: post.updated_at,
        updates: []
      }))

      // 在内存中进一步搜索标签
      const searchResults = posts.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )

      // 合并结果，去重
      const allResults = [...posts, ...searchResults]
      const uniqueResults = allResults.filter((post, index, self) =>
        index === self.findIndex(p => p.id === post.id)
      )

      return { success: true, data: uniqueResults }
    } catch (error) {
      console.error('搜索文章出错:', error)
      return { success: false, error: 'Failed to search posts' }
    }
  }

  // 创建新文章
  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'updates'>): Promise<ApiResponse<Post>> {
    try {
      const newPost = {
        id: generateId(),
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        created_at: getBeijingTime(),
        updated_at: getBeijingTime()
      }

      const { data, error } = await supabase
        .from('posts')
        .insert(newPost)
        .select()
        .single()

      if (error) {
        console.error('创建文章失败:', error)
        return { success: false, error: 'Failed to create post' }
      }

      const post: Post = {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        updates: []
      }

      return { success: true, data: post }
    } catch (error) {
      console.error('创建文章出错:', error)
      return { success: false, error: 'Failed to create post' }
    }
  }

  // 更新文章
  static async updatePost(id: string, postData: Partial<Omit<Post, 'id' | 'createdAt' | 'updates'>>): Promise<ApiResponse<Post>> {
    try {
      console.log(`开始更新文章 ${id}:`, postData)
      
      // 先获取原文章信息，用于创建更新记录
      const { data: originalPost, error: getError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (getError) {
        console.error('获取原文章失败:', getError)
        return { success: false, error: getError.code === 'PGRST116' ? 'Post not found' : 'Failed to fetch original post' }
      }

      // 准备更新数据
      const updateData = {
        ...(postData.title && { title: postData.title }),
        ...(postData.content && { content: postData.content }),
        ...(postData.category && { category: postData.category }),
        ...(postData.tags && { tags: postData.tags }),
        updated_at: getBeijingTime()
      }

      console.log('更新数据:', updateData)

      // 更新文章
      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('更新文章失败:', error)
        return { success: false, error: error.code === 'PGRST116' ? 'Post not found' : 'Failed to update post' }
      }

      console.log('文章更新成功，现在创建更新记录...')

      // 自动创建更新记录 - 只记录真正变化的字段
      const changedFields = []
      
      // 检查哪些字段真正发生了变化
      if (postData.title && postData.title !== originalPost.title) {
        changedFields.push('标题')
      }
      if (postData.content && postData.content !== originalPost.content) {
        changedFields.push('内容')
      }
      if (postData.category && postData.category !== originalPost.category) {
        changedFields.push('分类')
      }
      if (postData.tags && JSON.stringify(postData.tags) !== JSON.stringify(originalPost.tags)) {
        changedFields.push('标签')
      }

      console.log('检测到变化的字段:', changedFields)

      // 生成描述信息
      const description = changedFields.length > 0 
        ? `文章更新: ${changedFields.join('、')}`
        : '文章更新: 微调整'

      const updateRecord = {
        id: generateId(),
        post_id: id,
        content: postData.content || originalPost.content, // 使用更新后的内容
        description: description,
        timestamp: getBeijingTime()
      }

      console.log('准备创建更新记录:', { description: updateRecord.description })

      const { error: updateRecordError } = await supabase
        .from('post_updates')
        .insert(updateRecord)

      if (updateRecordError) {
        console.error('创建更新记录失败:', updateRecordError)
        // 不影响主要更新操作，只记录错误
      } else {
        console.log('更新记录创建成功:', updateRecord.id)
      }

      // 获取所有更新记录（按时间降序，最新的在前面）
      const { data: updatesData } = await supabase
        .from('post_updates')
        .select('*')
        .eq('post_id', id)
        .order('timestamp', { ascending: false })

      const updates: PostUpdate[] = updatesData?.map(update => ({
        id: update.id,
        content: update.content,
        description: update.description,
        timestamp: update.timestamp
      })) || []

      console.log(`获取到 ${updates.length} 条更新记录`)

      const post: Post = {
        id: data.id,
        title: data.title,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        updates
      }

      return { success: true, data: post }
    } catch (error) {
      console.error('更新文章过程中出错:', error)
      return { success: false, error: 'Failed to update post' }
    }
  }

  // 添加文章更新记录
  static async addPostUpdate(postId: string, updateData: Omit<PostUpdate, 'id' | 'timestamp'>): Promise<ApiResponse<Post>> {
    try {
      // 先检查文章是否存在
      const { data: postExists, error: postError } = await supabase
        .from('posts')
        .select('id')
        .eq('id', postId)
        .single()

      if (postError || !postExists) {
        return { success: false, error: 'Post not found' }
      }

      // 添加更新记录
      const newUpdate = {
        id: generateId(),
        post_id: postId,
        content: updateData.content,
        description: updateData.description,
        timestamp: getBeijingTime()
      }

      const { error: insertError } = await supabase
        .from('post_updates')
        .insert(newUpdate)

      if (insertError) {
        console.error('添加更新记录失败:', insertError)
        return { success: false, error: 'Failed to add post update' }
      }

      // 更新文章的updated_at时间（使用北京时间）
      await supabase
        .from('posts')
        .update({ updated_at: getBeijingTime() })
        .eq('id', postId)

      // 返回更新后的文章
      return await this.getPostById(postId)
    } catch (error) {
      console.error('添加更新记录出错:', error)
      return { success: false, error: 'Failed to add post update' }
    }
  }

  // 删除文章
  static async deletePost(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('删除文章失败:', error)
        return { success: false, error: error.code === 'PGRST116' ? 'Post not found' : 'Failed to delete post' }
      }

      return { success: true, data: true }
    } catch (error) {
      console.error('删除文章出错:', error)
      return { success: false, error: 'Failed to delete post' }
    }
  }

  // 获取所有分类
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at')

      if (error) {
        console.error('获取分类失败:', error)
        return { success: false, error: 'Failed to fetch categories' }
      }

      const categories: Category[] = data.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description || '',
        icon: cat.icon || '',
        color: cat.color || '',
        count: cat.count
      }))

      return { success: true, data: categories }
    } catch (error) {
      console.error('获取分类出错:', error)
      return { success: false, error: 'Failed to fetch categories' }
    }
  }

  // 获取所有标签
  static async getAllTags(): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('tags')

      if (error) {
        console.error('获取标签失败:', error)
        return { success: false, error: 'Failed to fetch tags' }
      }

      const allTags = data.flatMap(post => post.tags || [])
      const uniqueTags = Array.from(new Set(allTags))

      return { success: true, data: uniqueTags }
    } catch (error) {
      console.error('获取标签出错:', error)
      return { success: false, error: 'Failed to fetch tags' }
    }
  }
}
