'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Award, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/components/providers/auth-provider'

export function HeroSection() {
  const { user } = useAuth()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  const stats = [
    { icon: Users, label: '服务用户', value: '10,000+' },
    { icon: Sparkles, label: '生成名字', value: '100,000+' },
    { icon: Award, label: '满意度', value: '98%' },
    { icon: Globe, label: '支持语言', value: '8种' },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-red-50/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -left-4 w-72 h-72 bg-red-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI驱动的专业起名服务</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                让AI为你
                <span className="chinese-decoration text-gradient bg-gradient-to-r from-red-600 to-amber-600 bg-clip-text text-transparent">
                  起一个好名字
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                融合传统文化与现代AI技术，为全球用户提供富有深刻文化内涵的中文名字。
                每个名字都承载着美好寓意，连接东西方文化的数字桥梁。
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="xl"
                variant="chinese"
                asChild
                className="group"
              >
                <Link href={user ? '/generate' : '/auth/register'}>
                  {user ? '开始起名' : '免费开始'}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                size="xl"
                variant="outline"
                onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                className="group"
              >
                <div className="w-5 h-5 mr-2 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-2 border-b-2 border-l-3 border-t-transparent border-b-transparent border-l-primary ml-0.5" />
                </div>
                观看介绍
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 pt-8">
              <div>
                <p className="text-sm text-muted-foreground">受到全球用户信赖</p>
                <div className="flex items-center space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-amber-400">
                      ⭐
                    </div>
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">4.9/5.0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Visual Card */}
            <Card className="relative overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-red-50/50 dark:from-slate-900 dark:to-red-950/20">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl text-2xl font-bold">
                    文
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground font-chinese">
                      李文华
                    </h3>
                    <p className="text-muted-foreground">Lǐ Wénhuá</p>
                    <div className="w-24 h-0.5 bg-gradient-to-r from-red-600 to-amber-600 mx-auto rounded-full" />
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">文</span> 代表文采、学问，寓意博学多才
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground">华</span> 代表光彩、繁盛，寓意前程似锦
                    </p>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-muted-foreground leading-relaxed">
                      整体寓意：<span className="font-medium text-foreground">文华并茂，德才兼备</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">质量评分</span>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-amber-400 rounded-full" />
                      ))}
                    </div>
                    <span className="text-sm font-medium">98分</span>
                  </div>
                </div>
              </CardContent>

              {/* Floating Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-amber-500 rounded-full animate-pulse" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse delay-1000" />
            </Card>

            {/* Floating Cards */}
            <div className="absolute -left-4 top-1/4 hidden lg:block">
              <Card className="p-3 shadow-lg border bg-background/80 backdrop-blur-sm">
                <div className="text-center space-y-1">
                  <div className="text-sm font-medium font-chinese">王雅琴</div>
                  <div className="text-xs text-muted-foreground">优雅如琴</div>
                </div>
              </Card>
            </div>

            <div className="absolute -right-4 bottom-1/4 hidden lg:block">
              <Card className="p-3 shadow-lg border bg-background/80 backdrop-blur-sm">
                <div className="text-center space-y-1">
                  <div className="text-sm font-medium font-chinese">张浩然</div>
                  <div className="text-xs text-muted-foreground">气宇轩昂</div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-16 lg:pt-24">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform duration-200 mb-3">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="text-2xl lg:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl overflow-hidden max-w-4xl w-full aspect-video">
            <button
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center">
              <p className="text-gray-600">视频演示即将推出...</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}