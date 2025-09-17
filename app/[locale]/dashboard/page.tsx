'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User,
  Heart,
  Clock,
  Sparkles,
  Download,
  Copy,
  Trash2,
  Star,
  TrendingUp,
  Calendar,
  CreditCard,
  Settings,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/components/providers/auth-provider'
import { Header } from '@/components/layout/header'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

interface SavedName {
  id: string
  chinese_name: string
  pinyin: string
  meaning: string
  style: string
  quality_score: number
  created_at: string
  is_favorite: boolean
  metadata?: {
    cultural_context?: string
  }
}

interface UsageStats {
  todayGenerations: number
  totalGenerations: number
  creditsUsed: number
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [savedNames, setSavedNames] = useState<SavedName[]>([])
  const [favoriteNames, setFavoriteNames] = useState<SavedName[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats>({
    todayGenerations: 0,
    totalGenerations: 0,
    creditsUsed: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  const t = useTranslations('dashboard')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }

    if (user) {
      fetchDashboardData()
    }
  }, [user, loading, router])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)

      // Fetch saved names
      const namesResponse = await fetch('/api/names', {
        headers: {
          'Authorization': `Bearer ${user?.access_token || ''}`
        }
      })

      if (namesResponse.ok) {
        const namesData = await namesResponse.json()
        setSavedNames(namesData.names || [])
        setFavoriteNames((namesData.names || []).filter((name: SavedName) => name.is_favorite))
      }

      // Fetch usage stats
      const statsResponse = await fetch('/api/generate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${user?.access_token || ''}`
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setUsageStats(statsData.data?.usage || {
          todayGenerations: 0,
          totalGenerations: 0,
          creditsUsed: 0
        })
      }

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      toast.error('获取数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyName = (name: SavedName) => {
    navigator.clipboard.writeText(`${name.chinese_name} (${name.pinyin})`)
    toast.success('已复制到剪贴板')
  }

  const handleToggleFavorite = async (nameId: string) => {
    try {
      const response = await fetch(`/api/names/${nameId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.access_token || ''}`
        },
        body: JSON.stringify({
          is_favorite: !savedNames.find(n => n.id === nameId)?.is_favorite
        })
      })

      if (response.ok) {
        await fetchDashboardData()
        toast.success('收藏状态已更新')
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      toast.error('操作失败')
    }
  }

  const handleDeleteName = async (nameId: string) => {
    try {
      const response = await fetch(`/api/names/${nameId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.access_token || ''}`
        }
      })

      if (response.ok) {
        await fetchDashboardData()
        toast.success('名字已删除')
      }
    } catch (error) {
      console.error('Failed to delete name:', error)
      toast.error('删除失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStyleBadgeColor = (style: string) => {
    const colors = {
      traditional: 'bg-amber-100 text-amber-800',
      modern: 'bg-blue-100 text-blue-800',
      elegant: 'bg-purple-100 text-purple-800',
      nature: 'bg-green-100 text-green-800',
      literary: 'bg-rose-100 text-rose-800'
    }
    return colors[style as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading || isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-background to-red-50/20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-red-50/20">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              欢迎回来，{profile?.display_name || '用户'}
            </h1>
            <p className="text-muted-foreground">
              管理您的中文名字收藏和生成历史
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">剩余积分</CardTitle>
                <Sparkles className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {profile?.credits_remaining || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  可生成 {profile?.credits_remaining || 0} 次名字
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">今日生成</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageStats.todayGenerations}</div>
                <p className="text-xs text-muted-foreground">
                  今天已生成的名字数量
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">收藏名字</CardTitle>
                <Heart className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{favoriteNames.length}</div>
                <p className="text-xs text-muted-foreground">
                  已收藏的喜爱名字
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总生成数</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savedNames.length}</div>
                <p className="text-xs text-muted-foreground">
                  累计生成的名字数量
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
                <CardDescription>常用功能快速入口</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link href="/generate">
                    <Plus className="mr-2 h-4 w-4" />
                    生成新名字
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/pricing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    购买积分
                  </Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    账户设置
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>使用统计</CardTitle>
                <CardDescription>您的生成活动概览</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>积分使用率</span>
                    <span>{Math.round(((100 - (profile?.credits_remaining || 0)) / 100) * 100)}%</span>
                  </div>
                  <Progress
                    value={((100 - (profile?.credits_remaining || 0)) / 100) * 100}
                    className="h-2"
                  />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    订阅计划: <span className="font-medium capitalize">{profile?.subscription_tier || 'free'}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Names Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>我的名字</CardTitle>
              <CardDescription>管理您生成和收藏的名字</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="all">全部名字 ({savedNames.length})</TabsTrigger>
                  <TabsTrigger value="favorites">收藏名字 ({favoriteNames.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                  {savedNames.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        您还没有生成过名字。
                        <Link href="/generate" className="ml-2 text-primary hover:underline">
                          立即开始生成
                        </Link>
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid gap-4">
                      {savedNames.map((name) => (
                        <Card key={name.id} className="transition-shadow hover:shadow-md">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold font-chinese">{name.chinese_name}</h3>
                                  <span className="text-lg text-muted-foreground">{name.pinyin}</span>
                                  <Badge className={getStyleBadgeColor(name.style)}>
                                    {name.style}
                                  </Badge>
                                  {name.quality_score && (
                                    <Badge variant="secondary">
                                      匹配度 {name.quality_score}%
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{name.meaning}</p>
                                {name.metadata?.cultural_context && (
                                  <p className="text-xs text-muted-foreground italic">
                                    {name.metadata.cultural_context}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground mt-2">
                                  生成时间: {formatDate(name.created_at)}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleToggleFavorite(name.id)}
                                >
                                  <Heart
                                    className={`h-4 w-4 ${
                                      name.is_favorite
                                        ? 'text-red-500 fill-red-500'
                                        : 'text-muted-foreground'
                                    }`}
                                  />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleCopyName(name)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleDeleteName(name.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                  {favoriteNames.length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        您还没有收藏任何名字。在名字列表中点击心形图标来收藏您喜欢的名字。
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid gap-4">
                      {favoriteNames.map((name) => (
                        <Card key={name.id} className="transition-shadow hover:shadow-md border-red-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold font-chinese">{name.chinese_name}</h3>
                                  <span className="text-lg text-muted-foreground">{name.pinyin}</span>
                                  <Badge className={getStyleBadgeColor(name.style)}>
                                    {name.style}
                                  </Badge>
                                  <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{name.meaning}</p>
                                {name.metadata?.cultural_context && (
                                  <p className="text-xs text-muted-foreground italic">
                                    {name.metadata.cultural_context}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleCopyName(name)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleToggleFavorite(name.id)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Heart className="h-4 w-4 fill-red-500" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}