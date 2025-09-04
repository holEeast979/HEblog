// 文章数据类型定义
export interface Post {
  id: string;
  title: string;
  content: string;
  category: 'AI' | 'Java' | 'Python';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  updates: PostUpdate[];
}

// 文章更新记录类型
export interface PostUpdate {
  id: string;
  content: string;
  timestamp: string;
  description: string; // 类似commit message
}

// 分类类型
export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  count: number;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// 主题类型
export type Theme = 'light' | 'dark';

// 搜索结果类型
export interface SearchResult {
  posts: Post[];
  total: number;
}

// 标签类型
export interface Tag {
  name: string;
  count: number;
  color: string;
}
