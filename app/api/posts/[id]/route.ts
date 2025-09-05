import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase-service'

// GET /api/posts/[id] - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await SupabaseService.getPostById(params.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Post not found' ? 404 : 400 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Get Post API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/posts/[id] - 更新文章
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`正在更新文章 ID: ${params.id}`)
    
    const body = await request.json()
    console.log('接收到的更新数据:', body)
    
    const updateData = {
      title: body.title,
      content: body.content,
      category: body.category,
      tags: body.tags,
    }

    // 移除undefined的字段
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData]
      }
    })
    
    console.log('处理后的更新数据:', updateData)

    const result = await SupabaseService.updatePost(params.id, updateData)
    console.log('DataService 的返回结果:', result)

    if (!result.success) {
      console.error('更新失败:', result.error)
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Post not found' ? 404 : 400 }
      )
    }

    console.log('文章更新成功')
    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Update Post API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/posts/[id] - 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await SupabaseService.deletePost(params.id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Post not found' ? 404 : 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete Post API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
