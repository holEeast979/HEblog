import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/data-service'

// GET /api/posts/[id] - 获取单个文章
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await DataService.getPostById(params.id)

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
    const body = await request.json()
    
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

    const result = await DataService.updatePost(params.id, updateData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Post not found' ? 404 : 400 }
      )
    }

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
    const result = await DataService.deletePost(params.id)

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
