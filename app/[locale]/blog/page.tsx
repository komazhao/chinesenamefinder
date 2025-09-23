'use client'


import React, { useState } from 'react'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Calendar,
  User,
  Clock,
  Tag,
  TrendingUp,
  BookOpen,
  Heart,
  MessageCircle,
  Share2,
  ArrowRight,
  Filter
} from 'lucide-react'

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const blogPosts = [
    {
      id: 1,
      title: 'AI技术如何革新传统中文起名艺术',
      excerpt: '探索人工智能如何结合古老的中华文化智慧，为现代起名带来全新的可能性。深入了解机器学习在文化传承中的重要作用...',
      content: '完整文章内容...',
      author: 'AI研发团队',
      authorAvatar: '/avatars/ai-team.jpg',
      date: '2024年3月15日',
      readTime: '8分钟',
      category: '技术创新',
      tags: ['AI技术', '机器学习', '文化传承'],
      views: 2540,
      likes: 186,
      comments: 24,
      featured: true,
      image: '/blog/ai-naming-technology.jpg'
    },
    {
      id: 2,
      title: '古典诗词中的起名智慧：从《诗经》到现代',
      excerpt: '从古代经典诗词中汲取起名灵感，了解如何让传统文化在现代起名中焕发新的生命力。探索诗词背后的深层文化内涵...',
      content: '完整文章内容...',
      author: '文化研究员',
      authorAvatar: '/avatars/culture-researcher.jpg',
      date: '2024年3月12日',
      readTime: '10分钟',
      category: '文化传承',
      tags: ['古典诗词', '诗经', '文化内涵'],
      views: 1890,
      likes: 142,
      comments: 18,
      featured: false,
      image: '/blog/classical-poetry.jpg'
    },
    {
      id: 3,
      title: '五行八字理论在现代起名中的应用',
      excerpt: '深入了解传统五行八字理论如何与现代科学相结合，为起名提供更加个性化和准确的指导...',
      content: '完整文章内容...',
      author: '传统文化专家',
      authorAvatar: '/avatars/tradition-expert.jpg',
      date: '2024年3月10日',
      readTime: '7分钟',
      category: '传统文化',
      tags: ['五行八字', '传统理论', '个性化'],
      views: 1650,
      likes: 98,
      comments: 15,
      featured: false,
      image: '/blog/five-elements.jpg'
    },
    {
      id: 4,
      title: '跨文化起名：连接东西方文化的桥梁',
      excerpt: '在全球化时代，如何为跨文化家庭的孩子选择既具有中华文化特色又适应国际环境的名字...',
      content: '完整文章内容...',
      author: '国际化专家',
      authorAvatar: '/avatars/international-expert.jpg',
      date: '2024年3月8日',
      readTime: '6分钟',
      category: '国际化',
      tags: ['跨文化', '国际化', '全球化'],
      views: 1320,
      likes: 87,
      comments: 12,
      featured: false,
      image: '/blog/cross-culture.jpg'
    },
    {
      id: 5,
      title: '用户故事：我的中文名字改变了我的生活',
      excerpt: '来自全球用户的真实分享，了解一个好的中文名字如何影响个人的文化认同和生活体验...',
      content: '完整文章内容...',
      author: '用户投稿',
      authorAvatar: '/avatars/user-story.jpg',
      date: '2024年3月5日',
      readTime: '5分钟',
      category: '用户故事',
      tags: ['用户故事', '真实体验', '文化认同'],
      views: 980,
      likes: 156,
      comments: 32,
      featured: false,
      image: '/blog/user-story.jpg'
    },
    {
      id: 6,
      title: '企业命名策略：品牌文化的深层表达',
      excerpt: '探讨现代企业如何通过中文命名来表达品牌文化，建立与消费者的深层情感连接...',
      content: '完整文章内容...',
      author: '品牌策略师',
      authorAvatar: '/avatars/brand-strategist.jpg',
      date: '2024年3月3日',
      readTime: '9分钟',
      category: '商业应用',
      tags: ['企业命名', '品牌策略', '商业文化'],
      views: 756,
      likes: 63,
      comments: 8,
      featured: false,
      image: '/blog/enterprise-naming.jpg'
    }
  ]

  const categories = [
    { name: '全部', value: 'all', count: 24 },
    { name: '技术创新', value: 'tech', count: 8 },
    { name: '文化传承', value: 'culture', count: 12 },
    { name: '传统文化', value: 'tradition', count: 6 },
    { name: '国际化', value: 'international', count: 4 },
    { name: '用户故事', value: 'user-story', count: 15 },
    { name: '商业应用', value: 'business', count: 5 }
  ]

  const trendingTags = [
    'AI技术', '传统文化', '诗词起名', '五行八字', '跨文化', '用户体验',
    '品牌命名', '文化传承', '个性化', '现代科技'
  ]

  const featuredPost = blogPosts.find(post => post.featured)
  const regularPosts = blogPosts.filter(post => !post.featured)

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              文化伴侣博客
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              探索文化，分享智慧
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              在这里，我们分享关于中华文化、AI技术和起名艺术的深度见解。
              每一篇文章都是文化传承与技术创新的完美结合。
            </p>

            {/* Search and Filter */}
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="搜索文章..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 py-6 text-lg"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className="rounded-full"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && (
          <section className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8">精选文章</h2>
              <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-purple-50 to-blue-50">
                <CardContent className="p-0">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="p-8 lg:p-12">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{featuredPost.category}</Badge>
                        <Badge variant="outline">精选</Badge>
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-primary">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
                        {featuredPost.excerpt}
                      </p>

                      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {featuredPost.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {featuredPost.readTime}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {featuredPost.views} 浏览
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {featuredPost.likes} 点赞
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          {featuredPost.comments} 评论
                        </div>
                      </div>

                      <Button size="lg">
                        <BookOpen className="mr-2 h-5 w-5" />
                        阅读全文
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 lg:p-12 flex items-center justify-center text-white">
                      <div className="text-center">
                        <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-80" />
                        <p className="text-2xl font-bold opacity-90">精选文章</p>
                        <p className="opacity-75">深度解读 · 文化传承</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">最新文章</h2>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-all cursor-pointer group">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>

                    <CardTitle className="text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>

                    <CardDescription className="mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <span>{post.date}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.comments}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                加载更多文章
              </Button>
            </div>
          </div>
        </section>

        {/* Trending Tags */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">热门标签</h2>
            <div className="flex flex-wrap gap-3">
              {trendingTags.map((tag, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="rounded-full hover:bg-primary hover:text-primary-foreground"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  #{tag}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                订阅我们的博客
              </h2>
              <p className="text-xl opacity-90 mb-8">
                获取最新的文化洞察、技术更新和起名智慧，直接发送到您的邮箱
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <Input
                  placeholder="请输入您的邮箱"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button variant="secondary">
                  订阅
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-4">
                每周精选内容，随时可以取消订阅
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </>
  )
}
