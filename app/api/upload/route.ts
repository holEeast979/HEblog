import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '没有上传文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型。请上传 JPEG、PNG、GIF 或 WebP 格式的图片' },
        { status: 400 }
      );
    }

    // 检查文件大小 (5MB限制)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件太大，请上传小于5MB的图片' },
        { status: 400 }
      );
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    // 转换File为ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // 上传到Supabase存储
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        cacheControl: '3600', // 缓存1小时
      });

    if (error) {
      console.error('上传错误:', error);
      return NextResponse.json(
        { error: '上传失败: ' + error.message },
        { status: 500 }
      );
    }

    // 获取公开访问URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 获取所有上传的图片
export async function GET() {
  try {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      return NextResponse.json(
        { error: '获取图片列表失败: ' + error.message },
        { status: 500 }
      );
    }

    // 为每个文件生成公开URL
    const imagesWithUrls = data?.map(file => {
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(file.name);
      
      return {
        name: file.name,
        url: urlData.publicUrl,
        size: file.metadata?.size || 0,
        created_at: file.created_at,
        updated_at: file.updated_at
      };
    }) || [];

    return NextResponse.json({
      success: true,
      images: imagesWithUrls
    });

  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 删除图片
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json(
        { error: '缺少文件名参数' },
        { status: 400 }
      );
    }

    const { error } = await supabase.storage
      .from('blog-images')
      .remove([fileName]);

    if (error) {
      return NextResponse.json(
        { error: '删除失败: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '图片删除成功'
    });

  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

