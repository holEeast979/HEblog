import { Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageTransition } from '@/components/animations/page-transition'
import { BookOpen, Code, Brain, Coffee, FileCode, ArrowRight, Clock, Tag } from 'lucide-react'
import postsData from '@/data/posts.json'

const categoryIcons = {
  'AI': Brain,
  'Java': Coffee,
  'Python': FileCode,
}

const categoryColors = {
  'AI': 'from-purple-500 to-pink-500',
  'Java': 'from-orange-500 to-red-500',
  'Python': 'from-blue-500 to-green-500',
}

function LoadingCard() {
  return (
    <Card className="loading-pulse">
      <CardHeader>
        <div className="h-6 bg-primary-200 dark:bg-dark-600 rounded animate-pulse mb-2" />
        <div className="h-4 bg-primary-100 dark:bg-dark-700 rounded animate-pulse w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-3 bg-primary-100 dark:bg-dark-700 rounded animate-pulse" />
          <div className="h-3 bg-primary-100 dark:bg-dark-700 rounded animate-pulse w-5/6" />
          <div className="h-3 bg-primary-100 dark:bg-dark-700 rounded animate-pulse w-4/6" />
        </div>
      </CardContent>
    </Card>
  )
}

function CategoryCard({ category }: { category: typeof postsData.categories[0] }) {
  const Icon = categoryIcons[category.name as keyof typeof categoryIcons]
  const gradient = categoryColors[category.name as keyof typeof categoryColors]
  
  return (
    <Link href={`/posts?category=${category.name}`}>
      <Card className="group cursor-pointer glow-effect overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        <CardHeader className="relative">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
              {Icon && <Icon className="w-6 h-6" />}
            </div>
            <div>
              <CardTitle className="text-xl group-hover:text-primary-600 dark:group-hover:text-warm-300 transition-colors">
                {category.name}
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="mb-2">
              {category.count} 篇文章
            </Badge>
            <ArrowRight className="w-4 h-4 text-primary-400 group-hover:text-primary-600 dark:text-warm-400 dark:group-hover:text-warm-300 transform group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function RecentPost({ post }: { post: typeof postsData.posts[0] }) {
  const Icon = categoryIcons[post.category as keyof typeof categoryIcons]
  const gradient = categoryColors[post.category as keyof typeof categoryColors]
  
  return (
    <Link href={`/posts/${post.id}`}>
      <Card className="group cursor-pointer glow-effect hover:shadow-xl transition-shadow duration-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg group-hover:text-primary-600 dark:group-hover:text-warm-300 transition-colors mb-2">
                {post.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 mb-3">
                {post.content.split('\n')[0].replace(/[#*]/g, '').trim()}
              </CardDescription>
            </div>
            {Icon && (
              <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md ml-4`}>
                <Icon className="w-4 h-4" />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-primary-600 dark:text-warm-400 mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>
            <Badge variant="outline">{post.category}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function HomePage() {
  const recentPosts = postsData.posts.slice(0, 3)
  
  return (
    <PageTransition>
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container px-4 mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold text-primary-800 dark:text-warm-100 mb-6 leading-tight">
              欢迎来到{' '}
              <span className="bg-gradient-to-r from-primary-500 to-warm-500 bg-clip-text text-transparent animate-glow">
                HEblog
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-primary-600 dark:text-warm-300 mb-8 leading-relaxed">
              分享AI、编程知识与个人思考
            </p>
            <p className="text-lg text-primary-500 dark:text-warm-400 mb-12">
              探索人工智能的奥秘，掌握编程语言的精髓，记录学习路上的点点滴滴
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/posts">
                <Button size="xl" variant="glow" className="text-lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  探索知识库
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="xl" variant="outline" className="text-lg">
                  <Code className="w-5 h-5 mr-2" />
                  内容管理
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* 装饰性背景元素 */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 dark:bg-primary-800 rounded-full opacity-20 animate-float" />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-warm-200 dark:bg-warm-800 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-primary-300 dark:bg-primary-700 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-primary-50/50 dark:to-dark-900/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 dark:text-warm-100 mb-4">
              知识分类
            </h2>
            <p className="text-lg text-primary-600 dark:text-warm-300">
              按主题探索不同领域的知识内容
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Suspense fallback={<LoadingCard />}>
              {postsData.categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </Suspense>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-primary-800 dark:text-warm-100 mb-4">
                最新文章
              </h2>
              <p className="text-lg text-primary-600 dark:text-warm-300">
                最近更新的知识内容
              </p>
            </div>
            
            <Link href="/posts">
              <Button variant="outline" className="hidden sm:inline-flex">
                查看全部
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Suspense fallback={[...Array(3)].map((_, i) => <LoadingCard key={i} />)}>
              {recentPosts.map((post) => (
                <RecentPost key={post.id} post={post} />
              ))}
            </Suspense>
          </div>
          
          <div className="text-center mt-8 sm:hidden">
            <Link href="/posts">
              <Button variant="outline">
                查看全部文章
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  )
}
