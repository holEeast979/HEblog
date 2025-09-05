import { NextRequest, NextResponse } from 'next/server'
import { SupabaseService } from '@/lib/supabase-service'

// GET /api/tags - 获取所有标签
export async function GET(request: NextRequest) {
  try {
    const result = await SupabaseService.getAllTags()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error('Tags API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
