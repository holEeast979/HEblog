'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Button } from './button';
import { Card } from './card';

interface UploadedImage {
  url: string;
  fileName: string;
  size: number;
  type: string;
}

interface ImageUploaderProps {
  onImageUploaded?: (image: UploadedImage) => void;
  onImageInsert?: (markdownText: string) => void;
  className?: string;
}

export default function ImageUploader({ onImageUploaded, onImageInsert, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recentImages, setRecentImages] = useState<UploadedImage[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const result = await response.json();
      
      const uploadedImage: UploadedImage = {
        url: result.url,
        fileName: result.fileName,
        size: result.size,
        type: result.type
      };

      // 添加到最近图片列表
      setRecentImages(prev => [uploadedImage, ...prev.slice(0, 4)]);
      
      // 调用回调函数
      onImageUploaded?.(uploadedImage);
      
      // 自动插入Markdown格式
      const fileName = file.name.split('.')[0];
      const markdownText = `![${fileName}](${result.url})`;
      onImageInsert?.(markdownText);

      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);

    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
      setError('请上传图片文件');
      return;
    }

    // 一次只上传一个文件
    await uploadFile(imageFiles[0]);
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await uploadFile(files[0]);
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const insertImageFromRecent = (image: UploadedImage) => {
    const fileName = image.fileName.split('.')[0];
    const markdownText = `![${fileName}](${image.url})`;
    onImageInsert?.(markdownText);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 上传区域 */}
      <Card
        className={`relative border-2 border-dashed transition-colors duration-200 ${
          isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        } ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <div className="p-6 text-center">
          {isUploading ? (
            <div className="space-y-2">
              <div className="text-2xl">📤</div>
              <p className="text-sm font-medium">上传中... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-4xl">🖼️</div>
              <p className="text-lg font-medium">拖拽图片到这里或点击上传</p>
              <p className="text-sm text-gray-500">
                支持 JPEG, PNG, GIF, WebP 格式，最大 5MB
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      {/* 错误消息 */}
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

      {/* 最近上传的图片 */}
      {recentImages.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            📸 最近上传的图片
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {recentImages.map((image, index) => (
              <Card 
                key={`${image.fileName}-${index}`}
                className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => insertImageFromRecent(image)}
              >
                <div className="flex items-start space-x-3">
                  <img 
                    src={image.url} 
                    alt={image.fileName}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {image.fileName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(image.size)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        insertImageFromRecent(image);
                      }}
                    >
                      插入
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

