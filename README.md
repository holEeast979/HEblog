# HEblog - 个人知识博客

一个现代化的个人知识博客系统，专注于AI、编程知识的分享和管理。

## ✨ 功能特色

### 🎨 美观设计
- **温暖棕色主题** - 专业而温馨的视觉体验
- **深色/浅色模式** - 自动适应用户偏好
- **响应式布局** - 完美支持各种设备

### 🚀 炫酷动效
- **GSAP动画系统** - 丝滑流畅的交互体验
- **3D卡片效果** - 游戏风格的悬停动画
- **粒子背景** - 动态视觉效果
- **页面过渡** - 优雅的页面切换动画

### 📝 内容管理
- **可视化编辑器** - 直观的文章编辑体验
- **实时预览** - 即时查看文章效果
- **分类管理** - AI、Java、Python等分类
- **标签系统** - 灵活的内容标记

### 🔄 版本控制
- **追加内容** - 类似Git的更新记录
- **更新历史** - 完整的文章演进过程
- **时间轴展示** - 清晰的更新时间线

### 🔍 搜索过滤
- **全文搜索** - 标题、内容、标签搜索
- **分类过滤** - 按分类快速筛选
- **实时结果** - 即时显示搜索结果

## 🛠️ 技术栈

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Animation**: GSAP + Framer Motion
- **Icons**: Lucide React
- **Storage**: JSON文件存储
- **Deployment**: Vercel (推荐)

## 📦 快速开始

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 开发环境
\`\`\`bash
npm run dev
\`\`\`

### 生产构建
\`\`\`bash
npm run build
npm start
\`\`\`

### 类型检查
\`\`\`bash
npm run type-check
\`\`\`

## 📁 项目结构

\`\`\`
HEblog/
├── app/                      # Next.js 14 App Router
│   ├── layout.tsx           # 全局布局
│   ├── page.tsx            # 首页
│   ├── posts/              # 文章相关页面
│   ├── admin/              # 内容管理页面
│   └── api/                # API路由
├── components/             # React组件
│   ├── ui/                 # 基础UI组件
│   ├── animations/         # 动画组件
│   ├── cms/                # 内容管理组件
│   └── layout/             # 布局组件
├── data/                   # JSON数据文件
│   └── posts.json          # 文章数据
├── lib/                    # 工具库
│   ├── types.ts            # 类型定义
│   ├── utils.ts            # 工具函数
│   └── data-service.ts     # 数据服务
└── styles/                 # 样式文件
\`\`\`

## 🎯 使用指南

### 1. 访问首页
- 浏览知识分类
- 查看最新文章
- 感受炫酷动效

### 2. 浏览文章
- `/posts` - 查看所有文章
- `/posts/[id]` - 查看文章详情
- 支持搜索和分类过滤

### 3. 管理内容
- `/admin` - 内容管理界面
- `/admin/new` - 新建文章
- `/admin/edit/[id]` - 编辑文章

### 4. 添加更新
- 在文章编辑页面可以添加更新记录
- 类似Git commit的方式记录变更

## 🎨 主题定制

### 颜色变量
在 `tailwind.config.js` 中可以自定义主题颜色：

\`\`\`javascript
colors: {
  primary: { ... },    // 主色系
  warm: { ... },       // 温暖色系
  dark: { ... },       // 深色系
}
\`\`\`

### CSS变量
在 `globals.css` 中定义了主题切换变量：

\`\`\`css
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
\`\`\`

## 📊 数据格式

文章数据结构：
\`\`\`typescript
interface Post {
  id: string;
  title: string;
  content: string;
  category: 'AI' | 'Java' | 'Python';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  updates: PostUpdate[];
}

interface PostUpdate {
  id: string;
  content: string;
  timestamp: string;
  description: string; // 类似commit message
}
\`\`\`

## 🚀 部署

### Vercel (推荐)
1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署，获得自定义域名

### 其他平台
- Netlify
- Railway
- 自己的服务器

## 🔧 环境变量

目前项目使用本地JSON存储，无需环境变量。
如果将来需要数据库，可以添加：

\`\`\`env
# 示例环境变量
DATABASE_URL="your_database_url"
NEXT_PUBLIC_API_URL="your_api_url"
\`\`\`

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (\`git checkout -b feature/AmazingFeature\`)
3. 提交更改 (\`git commit -m 'Add some AmazingFeature'\`)
4. 推送到分支 (\`git push origin feature/AmazingFeature\`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [GSAP](https://greensock.com/gsap/) - 动画库
- [Lucide](https://lucide.dev/) - 图标库

---

**HEblog** - 让知识分享更美好 ✨
