# HEblog - 个人知识博客

一个现代化的个人知识博客系统，专注于AI、编程知识的分享和管理。采用温暖的棕色主题设计，提供优雅的阅读体验。

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
- **Markdown支持** - 完整的Markdown渲染，支持代码高亮
- **可视化编辑器** - 直观的文章编辑体验
- **分类管理** - AI、Java、Python等预设分类
- **标签系统** - 灵活的多标签支持
- **密码保护** - 简单的管理员访问控制

### 🔄 版本追踪
- **追加内容** - 类似Git commit的更新记录系统
- **更新历史** - 完整的文章修改历程
- **醒目展示** - 突出显示文章的补充内容

### 🔍 搜索功能
- **实时搜索** - 标题、内容、标签全文搜索
- **分类过滤** - 按分类快速筛选内容
- **搜索高亮** - 清晰标记搜索结果

## 🛠️ 技术栈

- **Frontend**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Variables + 原生CSS动画
- **Markdown**: react-markdown + remark-gfm + rehype-highlight
- **Icons**: Lucide React
- **Storage**: JSON文件存储（轻量级数据管理）
- **Authentication**: 简单密码验证
- **Deployment**: Vercel（支持自动部署）

## 📦 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 开发环境
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看博客。

### 3. 生产构建
```bash
npm run build
npm start
```

### 4. 类型检查
```bash
npm run type-check
```

## 📁 项目结构

```
HEblog/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # 全局布局
│   ├── page.tsx            # 首页
│   ├── posts/              # 文章页面
│   │   ├── page.tsx        # 文章列表
│   │   └── [id]/page.tsx   # 文章详情
│   ├── admin/              # 管理页面（需要密码访问）
│   │   ├── page.tsx        # 管理首页
│   │   ├── new/page.tsx    # 新建文章
│   │   └── edit/[id]/      # 编辑文章
│   └── api/                # API路由
│       ├── posts/          # 文章API
│       ├── categories/     # 分类API
│       └── tags/           # 标签API
├── components/             # React组件
│   ├── ui/                 # 基础UI组件
│   │   ├── button.tsx      # 按钮组件
│   │   ├── card.tsx        # 卡片组件
│   │   ├── markdown.tsx    # Markdown渲染组件
│   │   └── ...             # 其他UI组件
│   ├── auth/               # 认证组件
│   ├── cms/                # 内容管理组件
│   ├── layout/             # 布局组件
│   └── theme/              # 主题相关组件
├── data/                   # JSON数据文件
│   └── posts.json          # 文章和分类数据
├── lib/                    # 工具库
│   ├── types.ts            # TypeScript类型定义
│   ├── utils.ts            # 工具函数
│   └── data-service.ts     # 数据操作服务
└── styles/                 # 样式文件
    └── globals.css         # 全局样式和主题变量
```

## 🎯 使用指南

### 公开访问（无需登录）
- **首页** (`/`) - 浏览知识分类和最新文章
- **文章列表** (`/posts`) - 查看所有文章，支持搜索和筛选
- **文章详情** (`/posts/[id]`) - 查看完整文章内容和更新记录

### 管理员功能（需要密码）
- **管理首页** (`/admin`) - 文章管理界面
- **新建文章** (`/admin/new`) - 创建新文章
- **编辑文章** (`/admin/edit/[id]`) - 修改现有文章

### 文章管理
1. 支持Markdown格式编写
2. 可设置分类和标签
3. 支持追加更新内容
4. 自动保存创建和修改时间

## 🎨 主题定制

### 颜色系统
在 `tailwind.config.js` 中定义了完整的色彩系统：

```javascript
colors: {
  primary: {
    50: '#FAF7F2',
    100: '#F5EFE6',
    // ... 棕色主色系
  },
  warm: {
    50: '#FDF8F3',
    100: '#FCF1E8',
    // ... 温暖色系
  },
  dark: {
    50: '#2A2318',
    100: '#1F1A10',
    // ... 深色系
  }
}
```

### CSS变量
在 `globals.css` 中支持主题切换：

```css
:root {
  --bg-primary: #FAF7F2;
  --text-primary: #2B1505;
  --accent: #A0522D;
}

.dark {
  --bg-primary: #1A1209;
  --text-primary: #F5EFE6;
  --accent: #C8A882;
}
```

## 📊 数据结构

### 文章数据格式
```typescript
interface Post {
  id: string;
  title: string;
  content: string;                    // Markdown格式
  category: 'AI' | 'Java' | 'Python'; // 预设分类
  tags: string[];                     // 多标签支持
  createdAt: string;                  // 创建时间
  updatedAt: string;                  // 最后更新时间
  updates: PostUpdate[];              // 追加更新记录
}

interface PostUpdate {
  id: string;
  content: string;      // 更新内容（Markdown）
  timestamp: string;    // 更新时间
  description: string;  // 更新描述（类似commit message）
}
```

### 分类数据
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;     // Lucide图标名称
  postCount: number; // 该分类下的文章数量
}
```

## 🚀 部署指南

### Vercel部署（推荐）
1. 将代码推送到GitHub
2. 在Vercel中导入GitHub仓库
3. 系统自动检测Next.js项目并配置
4. 每次推送代码自动触发重新部署

### 其他平台
- **Netlify** - 支持静态站点生成
- **Railway** - 支持全栈应用部署
- **自建服务器** - 使用PM2等工具管理

### 环境要求
- Node.js 18+ 
- npm 或 yarn
- Git（用于版本控制）

## 🔐 安全设置

目前使用简单的密码认证保护管理页面：
- 管理员访问需要输入预设密码
- 密码验证基于React Context状态管理
- 公开页面无需任何验证

## 🔧 自定义配置

### 修改分类
在 `lib/types.ts` 中修改 `Category` 类型：
```typescript
category: 'AI' | 'Java' | 'Python' | 'YourCategory';
```

### 修改认证密码
在 `components/auth/auth-provider.tsx` 中修改密码验证逻辑。

### 添加新的UI组件
在 `components/ui/` 目录下添加新组件，遵循现有的设计系统。

## 🤝 贡献指南

1. Fork 项目到你的GitHub
2. 创建功能分支 (`git checkout -b feature/NewFeature`)
3. 提交你的修改 (`git commit -m 'Add NewFeature'`)
4. 推送到分支 (`git push origin feature/NewFeature`)
5. 创建Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## 👏 致谢

- [Next.js](https://nextjs.org/) - 强大的React全栈框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [react-markdown](https://github.com/remarkjs/react-markdown) - React Markdown渲染器
- [Lucide](https://lucide.dev/) - 美观的开源图标库
- [Vercel](https://vercel.com/) - 优秀的部署平台

---

**HEblog** - 让知识分享更简单优雅 ✨

项目地址：[https://github.com/holEeast979/HEblog](https://github.com/holEeast979/HEblog)