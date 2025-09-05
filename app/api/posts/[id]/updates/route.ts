import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase-service'

// POST /api/posts/[id]/updates - 添加文章更新记录
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // 验证必要字段
    if (!body.content || !body.description) {
      return NextResponse.json(
        { error: 'Missing required fields: content, description' },
        { status: 400 }
      )
    }

    const updateData = {
      content: body.content,
      description: body.description,
    }

    const result = await SupabaseService.addPostUpdate(params.id, updateData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Post not found' ? 404 : 400 }
      )
    }

    return NextResponse.json(result.data, { status: 201 })
  } catch (error) {
    console.error('Add Post Update API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
