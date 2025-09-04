import fs from 'fs/promises'
import path from 'path'
import { Post, Category, PostUpdate, ApiResponse } from './types'
import { generateId } from './utils'

const DATA_FILE = path.join(process.cwd(), 'data/posts.json')

// 读取数据文件
async function readDataFile(): Promise<{ posts: Post[]; categories: Category[] }> {
  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf-8')
    const data = JSON.parse(fileContent)
    return data
  } catch (error) {
    console.error('Error reading data file:', error)
    // 如果文件不存在或损坏，向上抛出错误
    throw error
  }
}

// 写入数据文件
async function writeDataFile(data: { posts: Post[]; categories: Category[] }): Promise<void> {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing data file:', error)
    throw new Error('Failed to save data')
  }
}

// 更新分类统计
function updateCategoryCount(categories: Category[], posts: Post[]): Category[] {
  return categories.map(category => ({
    ...category,
    count: posts.filter(post => post.category === category.name).length
  }))
}

export class DataService {
  // 获取所有文章
  static async getAllPosts(): Promise<ApiResponse<Post[]>> {
    try {
      const { posts } = await readDataFile()
      // 按创建时间倒序排列
      const sortedPosts = posts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      return { success: true, data: sortedPosts }
    } catch (error) {
      return { success: false, error: 'Failed to fetch posts' }
    }
  }

  // 根据ID获取文章
  static async getPostById(id: string): Promise<ApiResponse<Post>> {
    try {
      const { posts } = await readDataFile()
      const post = posts.find(p => p.id === id)
      if (!post) {
        return { success: false, error: 'Post not found' }
      }
      return { success: true, data: post }
    } catch (error) {
      return { success: false, error: 'Failed to fetch post' }
    }
  }

  // 根据分类获取文章
  static async getPostsByCategory(category: string): Promise<ApiResponse<Post[]>> {
    try {
      const { posts } = await readDataFile()
      const filteredPosts = posts
        .filter(post => post.category === category)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return { success: true, data: filteredPosts }
    } catch (error) {
      return { success: false, error: 'Failed to fetch posts by category' }
    }
  }

  // 搜索文章
  static async searchPosts(query: string, category?: string): Promise<ApiResponse<Post[]>> {
    try {
      const { posts } = await readDataFile()
      let filteredPosts = posts

      // 按分类过滤
      if (category) {
        filteredPosts = filteredPosts.filter(post => post.category === category)
      }

      // 搜索标题、内容和标签
      const searchResults = filteredPosts.filter(post => {
        const searchText = query.toLowerCase()
        return (
          post.title.toLowerCase().includes(searchText) ||
          post.content.toLowerCase().includes(searchText) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchText))
        )
      })

      return { success: true, data: searchResults }
    } catch (error) {
      return { success: false, error: 'Failed to search posts' }
    }
  }

  // 创建新文章
  static async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'updates'>): Promise<ApiResponse<Post>> {
    try {
      const data = await readDataFile()
      const newPost: Post = {
        ...postData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updates: []
      }

      data.posts.push(newPost)
      data.categories = updateCategoryCount(data.categories, data.posts)
      
      await writeDataFile(data)
      return { success: true, data: newPost }
    } catch (error) {
      return { success: false, error: 'Failed to create post' }
    }
  }

  // 更新文章
  static async updatePost(id: string, postData: Partial<Omit<Post, 'id' | 'createdAt' | 'updates'>>): Promise<ApiResponse<Post>> {
    try {
      const data = await readDataFile()
      const postIndex = data.posts.findIndex(p => p.id === id)
      
      if (postIndex === -1) {
        return { success: false, error: 'Post not found' }
      }

      const existingPost = data.posts[postIndex]
      const updatedPost: Post = {
        ...existingPost,
        ...postData,
        updatedAt: new Date().toISOString()
      }

      data.posts[postIndex] = updatedPost
      data.categories = updateCategoryCount(data.categories, data.posts)
      
      await writeDataFile(data)
      return { success: true, data: updatedPost }
    } catch (error) {
      return { success: false, error: 'Failed to update post' }
    }
  }

  // 添加文章更新记录
  static async addPostUpdate(postId: string, updateData: Omit<PostUpdate, 'id' | 'timestamp'>): Promise<ApiResponse<Post>> {
    try {
      const data = await readDataFile()
      const postIndex = data.posts.findIndex(p => p.id === postId)
      
      if (postIndex === -1) {
        return { success: false, error: 'Post not found' }
      }

      const newUpdate: PostUpdate = {
        ...updateData,
        id: generateId(),
        timestamp: new Date().toISOString()
      }

      data.posts[postIndex].updates.push(newUpdate)
      data.posts[postIndex].updatedAt = new Date().toISOString()
      
      await writeDataFile(data)
      return { success: true, data: data.posts[postIndex] }
    } catch (error) {
      return { success: false, error: 'Failed to add post update' }
    }
  }

  // 删除文章
  static async deletePost(id: string): Promise<ApiResponse<boolean>> {
    try {
      const data = await readDataFile()
      const postIndex = data.posts.findIndex(p => p.id === id)
      
      if (postIndex === -1) {
        return { success: false, error: 'Post not found' }
      }

      data.posts.splice(postIndex, 1)
      data.categories = updateCategoryCount(data.categories, data.posts)
      
      await writeDataFile(data)
      return { success: true, data: true }
    } catch (error) {
      return { success: false, error: 'Failed to delete post' }
    }
  }

  // 获取所有分类
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      const { posts, categories } = await readDataFile()
      const updatedCategories = updateCategoryCount(categories, posts)
      return { success: true, data: updatedCategories }
    } catch (error) {
      return { success: false, error: 'Failed to fetch categories' }
    }
  }

  // 获取所有标签
  static async getAllTags(): Promise<ApiResponse<string[]>> {
    try {
      const { posts } = await readDataFile()
      const allTags = posts.flatMap(post => post.tags)
      const uniqueTags = Array.from(new Set(allTags))
      return { success: true, data: uniqueTags }
    } catch (error) {
      return { success: false, error: 'Failed to fetch tags' }
    }
  }
}
