# HEblog - 现代化个人知识博客

> 🌐 **在线访问：[https://h-eblog.vercel.app/](https://h-eblog.vercel.app/)**

一个现代化的全栈个人知识博客系统，专注于AI、编程知识的分享和管理。采用温暖的棕色主题设计，提供优雅的阅读体验。已成功部署在 **Vercel 云平台**，使用 **Supabase** 作为后端数据库，支持云端实时编辑和管理。

## 🚀 项目亮点

- ✅ **已部署上线** - 基于 Vercel 的云端服务
- ✅ **云数据库** - 使用 Supabase PostgreSQL 数据库
- ✅ **实时编辑** - 支持云端直接编辑和保存文章
- ✅ **自动同步** - 所有内容实时同步到数据库
- ✅ **版本追踪** - 完整的文章更新历史记录
- ✅ **北京时间** - 所有时间戳使用北京时区

## ✨ 功能特色

### 🎨 美观设计
- **温暖棕色主题** - 专业而温馨的视觉体验
- **深色/浅色模式** - 完美的主题切换系统
- **响应式布局** - 完美支持各种设备
- **优雅的卡片设计** - 简洁大方的内容展示

### 🚀 流畅动效
- **CSS原生动画** - 轻量级且性能优秀的动效系统
- **淡入淡出效果** - 优雅的页面和元素过渡
- **悬停交互** - 精致的鼠标悬停反馈
- **页面切换** - 丝滑的路由转换体验

### 📝 内容管理
- **云端编辑** - 直接在网站上编辑文章，实时保存到数据库
- **Markdown支持** - 完整的Markdown渲染，支持代码高亮
- **分类管理** - AI、Java、Python等预设分类
- **标签系统** - 灵活的多标签支持
- **管理员界面** - 醒目的管理入口，专注编辑功能

### 🔄 版本追踪
- **自动记录** - 每次编辑自动创建更新记录
- **变化检测** - 智能识别实际修改的字段
- **更新历史** - 完整的文章修改历程
- **时间追踪** - 显示相对时间（如"2小时前"）

### 🔍 搜索功能
- **实时搜索** - 标题、内容、标签全文搜索
- **分类过滤** - 按分类快速筛选内容
- **搜索高亮** - 清晰标记搜索结果

## 🛠️ 技术栈

### 前端技术
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Variables + 原生CSS动画
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Icons**: Lucide React
- **状态管理**: React Hooks + Context API

### 后端技术
- **API**: Next.js API Routes (Serverless Functions)
- **数据库**: Supabase PostgreSQL
- **认证**: 简单密码验证 + JWT Session
- **时区**: 北京时间 (Asia/Shanghai)

### 部署架构
- **前端部署**: Vercel (自动部署 + CDN加速)
- **数据库**: Supabase (云数据库服务)
- **域名**: https://h-eblog.vercel.app/
- **SSL**: 自动HTTPS证书

## 🌐 在线体验

### 🏠 [访问首页](https://h-eblog.vercel.app/)
浏览知识分类和最新文章

### 📚 [文章列表](https://h-eblog.vercel.app/posts)
查看所有文章，支持搜索和筛选

### 🔐 [管理员界面](https://h-eblog.vercel.app/admin)
云端编辑和管理文章（需要密码）

## 📦 本地开发

### 1. 克隆项目
```bash
git clone https://github.com/holEeast979/HEblog.git
cd HEblog
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
创建 `.env.local` 文件：
```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 管理员密码
NEXT_PUBLIC_ADMIN_PASSWORD=your-password
```

### 4. 数据库设置
在Supabase中创建以下表：

```sql
-- 分类表
CREATE TABLE categories (
  id VARCHAR PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR,
  color VARCHAR,
  count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 文章表
CREATE TABLE posts (
  id VARCHAR PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR NOT NULL,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (category) REFERENCES categories(name)
);

-- 文章更新记录表
CREATE TABLE post_updates (
  id VARCHAR PRIMARY KEY,
  post_id VARCHAR NOT NULL,
  content TEXT NOT NULL,
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);
```

### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看博客。

## 📁 项目结构

```
HEblog/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # 全局布局
│   ├── page.tsx            # 首页（API驱动）
│   ├── posts/              # 文章页面
│   │   ├── page.tsx        # 文章列表（支持搜索）
│   │   └── [id]/page.tsx   # 文章详情
│   ├── admin/              # 管理界面
│   │   ├── page.tsx        # 简化的管理首页
│   │   ├── new/page.tsx    # 新建文章
│   │   └── edit/[id]/      # 云端编辑文章
│   └── api/                # API路由（连接Supabase）
│       ├── posts/          # 文章CRUD API
│       ├── categories/     # 分类API
│       └── tags/           # 标签API
├── components/             # React组件
│   ├── ui/                 # 基础UI组件
│   ├── auth/               # 认证组件
│   ├── cms/                # 内容管理组件（支持云端保存）
│   └── layout/             # 布局组件
├── lib/                    # 工具库
│   ├── supabase.ts         # Supabase客户端配置
│   ├── supabase-service.ts # 数据库操作服务
│   ├── types.ts            # TypeScript类型定义
│   └── utils.ts            # 工具函数（含北京时间处理）
└── styles/                 # 样式文件
```

## 📊 数据库结构

### 文章表 (posts)
```typescript
interface Post {
  id: string;
  title: string;
  content: string;                     // Markdown格式
  category: string;                    // 分类名称
  tags: string[];                      // 标签数组
  created_at: string;                  // 创建时间（北京时间）
  updated_at: string;                  // 更新时间（北京时间）
  updates: PostUpdate[];               // 更新记录
}
```

### 更新记录表 (post_updates)
```typescript
interface PostUpdate {
  id: string;
  post_id: string;     // 关联文章ID
  content: string;     // 更新后的内容
  description: string; // 更新描述（如"文章更新: 标签"）
  timestamp: string;   // 更新时间（北京时间）
}
```

### 分类表 (categories)
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;        // 表情符号图标
  color: string;       // Tailwind颜色类
  count: number;       // 该分类文章数量
}
```

## 🎯 使用指南

### 访客使用
- **浏览文章** - 在 [首页](https://h-eblog.vercel.app/) 浏览最新文章和分类
- **搜索内容** - 在 [文章列表页](https://h-eblog.vercel.app/posts) 搜索感兴趣的内容
- **查看详情** - 点击文章标题查看完整内容和更新历史

### 管理员功能
1. 点击首页的 **🔐 管理员界面** 按钮
2. 输入管理员密码
3. 在简洁的管理界面中：
   - **创建文章** - 使用Markdown编写新文章
   - **编辑文章** - 修改现有文章内容
   - **删除文章** - 删除不需要的文章
4. 所有修改实时保存到Supabase数据库

### 文章编辑特色
- **实时预览** - 编辑时可以切换预览模式
- **版本记录** - 每次保存自动记录更新历史
- **时间显示** - 显示北京时间和相对时间
- **智能描述** - 自动生成更新描述

## 🚀 部署架构

### Vercel部署
```
GitHub Repository
        ↓
    Vercel Platform
        ↓
   自动构建和部署
        ↓
  https://h-eblog.vercel.app/
```

### 数据流
```
前端页面 ↔ Next.js API ↔ Supabase数据库
```

### 特性
- **自动部署** - 推送到GitHub自动触发部署
- **CDN加速** - 全球边缘节点加速访问
- **SSL证书** - 自动HTTPS加密
- **环境隔离** - 生产和预览环境分离

## 🔐 安全特性

- **密码保护** - 管理页面需要密码验证
- **SQL注入防护** - Supabase提供的安全查询
- **XSS防护** - React的内置XSS保护
- **HTTPS强制** - 全站HTTPS加密
- **环境变量** - 敏感信息环境变量存储

## 🌍 访问优化

由于使用了Vercel部署，如果国内访问较慢，建议：
- 使用 **Cloudflare** 进行DNS解析加速
- 绑定自定义域名提升访问速度

## 🔧 自定义开发

### 添加新分类
1. 在Supabase的 `categories` 表中添加记录
2. 更新前端的分类图标和颜色配置

### 修改主题
在 `tailwind.config.js` 中调整颜色系统：
```javascript
colors: {
  primary: {
    // 自定义主色系
  }
}
```

### 扩展功能
- 添加评论系统
- 集成更多Markdown插件
- 支持图片上传
- 添加RSS订阅

## 🤝 贡献指南

1. Fork 项目：[https://github.com/holEeast979/HEblog](https://github.com/holEeast979/HEblog)
2. 创建功能分支：`git checkout -b feature/NewFeature`
3. 提交修改：`git commit -m 'Add NewFeature'`
4. 推送分支：`git push origin feature/NewFeature`
5. 创建Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## 👏 致谢

- [Next.js](https://nextjs.org/) - 强大的React全栈框架
- [Supabase](https://supabase.com/) - 开源的Firebase替代方案
- [Vercel](https://vercel.com/) - 优秀的前端部署平台
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [react-markdown](https://github.com/remarkjs/react-markdown) - React Markdown渲染器
- [Lucide](https://lucide.dev/) - 美观的开源图标库

---

## 🌟 项目信息

**HEblog** - 让知识分享更简单优雅 ✨

- 🌐 **在线访问**: [https://h-eblog.vercel.app/](https://h-eblog.vercel.app/)
- 💻 **源码仓库**: [https://github.com/holEeast979/HEblog](https://github.com/holEeast979/HEblog)
- 🗄️ **数据库**: Supabase PostgreSQL
- ☁️ **部署平台**: Vercel Cloud Platform

### 技术架构
```
React/Next.js (前端) + Vercel (部署) + Supabase (数据库) = 现代化全栈博客
```