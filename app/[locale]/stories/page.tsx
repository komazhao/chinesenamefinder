'use client'


import React from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Heart, Star, Clock, User } from 'lucide-react'
import Link from 'next/link'

export default function StoriesPage() {
  const t = useTranslations()

  const stories = [
    {
      id: 1,
      title: t('stories.posts.culturalRoots.title'),
      excerpt: t('stories.posts.culturalRoots.excerpt'),
      author: t('stories.posts.culturalRoots.author'),
      date: '2024年3月15日',
      readTime: '5分钟',
      category: t('stories.categories.cultural'),
      featured: true
    },
    {
      id: 2,
      title: t('stories.posts.poetry.title'),
      excerpt: t('stories.posts.poetry.excerpt'),
      author: t('stories.posts.poetry.author'),
      date: '2024年3月10日',
      readTime: '7分钟',
      category: t('stories.categories.poetry')
    },
    {
      id: 3,
      title: t('stories.posts.fiveElements.title'),
      excerpt: t('stories.posts.fiveElements.excerpt'),
      author: t('stories.posts.fiveElements.author'),
      date: '2024年3月5日',
      readTime: '6分钟',
      category: t('stories.categories.traditional')
    },
    {
      id: 4,
      title: t('stories.posts.crossCultural.title'),
      excerpt: t('stories.posts.crossCultural.excerpt'),
      author: t('stories.posts.crossCultural.author'),
      date: '2024年3月1日',
      readTime: '4分钟',
      category: t('stories.categories.crossCultural')
    },
    {
      id: 5,
      title: t('stories.posts.enterprise.title'),
      excerpt: t('stories.posts.enterprise.excerpt'),
      author: t('stories.posts.enterprise.author'),
      date: '2024年2月28日',
      readTime: '8分钟',
      category: t('stories.categories.business')
    },
    {
      id: 6,
      title: t('stories.posts.userStory.title'),
      excerpt: t('stories.posts.userStory.excerpt'),
      author: t('stories.posts.userStory.author'),
      date: '2024年2月25日',
      readTime: '10分钟',
      category: t('stories.categories.userStories')
    }
  ]

  const categories = [
    { name: t('stories.categories.all'), count: 'all' },
    { name: t('stories.categories.cultural'), count: 12 },
    { name: t('stories.categories.poetry'), count: 8 },
    { name: t('stories.categories.traditional'), count: 15 },
    { name: t('stories.categories.crossCultural'), count: 6 },
    { name: t('stories.categories.business'), count: 4 },
    { name: t('stories.categories.userStories'), count: 20 }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-red-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              {t('navigation.stories')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('stories.title')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('stories.description')}
            </p>
            <Button size="lg" asChild>
              <Link href="/generate">
                <Heart className="mr-2 h-5 w-5" />
                {t('stories.getStarted')}
              </Link>
            </Button>
          </div>
        </section>

        {/* Categories */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('stories.categories.title')}</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  {category.name}
                  {category.count !== 'all' && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.count}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Story */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('stories.featured.title')}</h2>
            {stories.filter(story => story.featured).map((story) => (
              <Card key={story.id} className="mb-8 overflow-hidden border-primary/20 bg-gradient-to-r from-red-50 to-amber-50">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary">{story.category}</Badge>
                        <Badge variant="outline">{t('stories.featured.badge')}</Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-red-800">
                        {story.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {story.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {story.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {story.readTime}
                        </div>
                        <span>{story.date}</span>
                      </div>
                      <Button variant="outline">
                        <BookOpen className="mr-2 h-4 w-4" />
                        {t('stories.featured.readMore')}
                      </Button>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-40 h-40 bg-gradient-to-r from-red-600 to-amber-600 text-white rounded-lg flex items-center justify-center text-6xl font-bold">
                        文
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stories Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('stories.latest.title')}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.filter(story => !story.featured).map((story) => (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {story.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {story.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {story.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 line-clamp-3">
                      {story.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {story.author}
                        </div>
                        <div className="mt-1">{story.date}</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-red-600 to-amber-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                {t('stories.cta.title')}
              </h2>
              <p className="text-xl opacity-90 mb-8">
                {t('stories.cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  {t('stories.cta.share')}
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  {t('stories.cta.contact')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </>
  )
}
