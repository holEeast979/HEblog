import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase-service'

// GET /api/posts - 获取所有文章或搜索文章
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const category = searchParams.get('category')

  try {
    let result

    if (query) {
      // 搜索文章
      result = await SupabaseService.searchPosts(query, category || undefined)
    } else if (category) {
      // 按分类获取文章
      result = await SupabaseService.getPostsByCategory(category)
    } else {
      // 获取所有文章
      result = await SupabaseService.getAllPosts()
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Posts API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/posts - 创建新文章
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 验证必要字段
    if (!body.title || !body.summary || !body.content || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, summary, content, category' },
        { status: 400 }
      )
    }

    const postData = {
      title: body.title,
      summary: body.summary,
      content: body.content,
      category: body.category,
      tags: body.tags || [],
    }

    const result = await SupabaseService.createPost(postData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    console.error('Create Post API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
