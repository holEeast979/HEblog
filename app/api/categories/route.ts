import { NextRequest, NextResponse } from 'next/server'
import { DataService } from '@/lib/data-service'

// GET /api/categories - 获取所有分类
export async function GET(request: NextRequest) {
  try {
    const result = await DataService.getCategories()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Categories API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
