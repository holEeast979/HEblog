# 🚀 HEblog 部署指南

这是一份完整的部署指南，教您如何将 HEblog 部署到 Vercel，让任何人都可以通过链接访问您的博客。

## 📋 部署前准备

### 1. 确保项目结构完整
确保您的项目包含以下关键文件：
- `package.json` - 项目依赖
- `next.config.js` - Next.js 配置
- `vercel.json` (可选) - Vercel 部署配置

### 2. 设置管理员密码
默认管理密码：`HEblog2024`
**强烈建议**部署前修改此密码，编辑 `components/auth/auth-provider.tsx` 第13行：

```typescript
const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'YOUR_SECURE_PASSWORD'
```

## 🌟 使用 Vercel 部署（推荐）

### 方式一：通过 GitHub 自动部署（推荐）

1. **创建 GitHub 仓库**
   ```bash
   # 初始化 Git 仓库
   git init
   git add .
   git commit -m "Initial commit"
   
   # 添加远程仓库（替换为您的仓库地址）
   git remote add origin https://github.com/YOUR_USERNAME/HEblog.git
   git push -u origin main
   ```

2. **连接 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择您的 HEblog 仓库
   - 点击 "Import"

3. **配置环境变量**
   在 Vercel 项目设置中添加：
   ```
   NEXT_PUBLIC_ADMIN_PASSWORD=您的安全密码
   ```

4. **部署**
   - Vercel 会自动构建和部署
   - 几分钟后您会获得一个 `.vercel.app` 域名

### 方式二：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel
   ```

4. **设置环境变量**
   ```bash
   vercel env add NEXT_PUBLIC_ADMIN_PASSWORD
   ```

## 🛡️ 访问控制说明

### 对普通访客
- ✅ 可以浏览首页
- ✅ 可以查看所有文章
- ✅ 可以使用搜索功能  
- ✅ 可以切换主题（深色/浅色模式）
- ❌ 无法看到"管理"导航链接
- ❌ 无法访问内容管理功能

### 对管理员（您）
- ✅ 输入正确密码后获得完整权限
- ✅ 可以创建、编辑、删除文章
- ✅ 可以管理分类和标签
- ✅ 右上角显示退出按钮
- 🔄 管理员状态保存在本地，刷新页面不会丢失

## 🔧 自定义域名（可选）

1. **在 Vercel 中添加域名**
   - 进入项目设置
   - 找到 "Domains" 选项
   - 添加您的自定义域名

2. **配置 DNS**
   - 添加 CNAME 记录指向 `cname.vercel-dns.com`
   - 或添加 A 记录指向 Vercel IP

## 📱 性能优化建议

### 1. 启用缓存
创建 `vercel.json` 文件：
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control", 
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

### 2. 图片优化
如果添加图片，建议：
- 使用 Next.js `Image` 组件
- 将图片放在 `public/` 目录
- 使用 WebP 格式

## 🔐 安全建议

1. **修改默认密码**
   - 使用复杂密码（包含字母、数字、特殊字符）
   - 定期更换密码

2. **环境变量安全**
   - 敏感信息只存储在环境变量中
   - 不要将密码硬编码在代码中

3. **访问监控**
   - 定期检查 Vercel 的访问日志
   - 留意异常访问模式

## 🚀 部署后测试

1. **访问测试**
   ```
   https://your-project.vercel.app
   ```

2. **功能测试**
   - ✅ 首页正常显示
   - ✅ 文章列表可以访问
   - ✅ 搜索功能工作正常
   - ✅ 主题切换正常
   - ✅ 管理功能需要密码验证
   - ✅ 认证后可以正常管理内容

## 📊 监控和维护

### Vercel 提供的功能
- **实时日志** - 查看应用运行状态
- **性能分析** - 监控页面加载速度
- **部署历史** - 回滚到之前版本
- **域名管理** - SSL 证书自动更新

### 建议的维护计划
- 每月检查依赖更新
- 定期备份文章数据
- 监控网站性能
- 收集用户反馈

## 🎉 完成！

现在您的博客已经成功部署！

📱 **分享链接**: `https://your-project.vercel.app`
🔑 **管理入口**: `https://your-project.vercel.app/admin`
🛡️ **访问控制**: 只有您知道密码才能编辑内容

---

如有任何问题，请检查 Vercel 的部署日志或在项目中创建 issue。
