'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Code,
  Key,
  Zap,
  Shield,
  Globe,
  Copy,
  ExternalLink,
  Terminal,
  FileText,
  Play,
  Download
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from '@/i18n/routing'

export default function ApiDocsPage() {
  const tCommon = useTranslations('common')
  const [activeEndpoint, setActiveEndpoint] = useState('generate')

  const endpoints = [
    {
      id: 'generate',
      name: '生成名字',
      method: 'POST',
      path: '/api/v1/generate',
      description: '根据用户输入生成个性化的中文名字',
      parameters: [
        { name: 'gender', type: 'string', required: true, description: '性别：male/female' },
        { name: 'surname', type: 'string', required: true, description: '姓氏' },
        { name: 'birthDate', type: 'string', required: false, description: '出生日期 (YYYY-MM-DD)' },
        { name: 'preferences', type: 'object', required: false, description: '偏好设置' },
        { name: 'style', type: 'string', required: false, description: '命名风格：traditional/modern/poetic' }
      ],
      response: {
        success: {
          names: [
            { name: '张雅文', meaning: '优雅有文采', score: 95 },
            { name: '张诗涵', meaning: '富有诗意，内涵丰富', score: 93 }
          ],
          analysis: '基于五行八字分析...'
        }
      }
    },
    {
      id: 'analyze',
      method: 'POST',
      path: '/api/v1/analyze',
      name: '名字分析',
      description: '分析现有名字的文化内涵和五行属性',
      parameters: [
        { name: 'fullName', type: 'string', required: true, description: '完整姓名' },
        { name: 'birthDate', type: 'string', required: false, description: '出生日期' }
      ],
      response: {
        success: {
          analysis: '详细分析结果...',
          score: 88,
          elements: '五行属性分析',
          suggestions: '改进建议'
        }
      }
    },
    {
      id: 'history',
      method: 'GET',
      path: '/api/v1/history',
      name: '历史记录',
      description: '获取用户的起名历史记录',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: '返回数量限制' },
        { name: 'offset', type: 'number', required: false, description: '偏移量' }
      ],
      response: {
        success: {
          history: [
            { id: 1, name: '张雅文', createdAt: '2024-03-15' },
            { id: 2, name: '张诗涵', createdAt: '2024-03-14' }
          ],
          total: 25
        }
      }
    }
  ]

  const authMethods = [
    {
      name: 'API Key认证',
      description: '在请求头中添加API密钥',
      example: 'Authorization: Bearer your_api_key_here',
      icon: Key
    },
    {
      name: 'OAuth 2.0',
      description: '适用于第三方应用集成',
      example: '标准OAuth 2.0流程',
      icon: Shield
    }
  ]

  const sdks = [
    { name: 'JavaScript/Node.js', status: '可用', color: 'bg-green-500' },
    { name: 'Python', status: '可用', color: 'bg-green-500' },
    { name: 'PHP', status: '开发中', color: 'bg-yellow-500' },
    { name: 'Java', status: '计划中', color: 'bg-gray-500' },
    { name: 'Go', status: '计划中', color: 'bg-gray-500' },
    { name: 'Ruby', status: '计划中', color: 'bg-gray-500' }
  ]

  const codeExamples = {
    javascript: `
// 使用 fetch API
const response = await fetch('https://api.chinesenamefinder.com/v1/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    gender: 'female',
    surname: '张',
    style: 'poetic'
  })
});

const result = await response.json();
console.log(result.names);`,
    python: `
# 使用 requests 库
import requests

url = 'https://api.chinesenamefinder.com/v1/generate'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
}
data = {
    'gender': 'female',
    'surname': '张',
    'style': 'poetic'
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
print(result['names'])`,
    curl: `
# 使用 cURL
curl -X POST "https://api.chinesenamefinder.com/v1/generate" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "gender": "female",
    "surname": "张",
    "style": "poetic"
  }'`
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-green-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              API 文档
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              开发者 API 文档
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              强大的 RESTful API，让您轻松集成我们的 AI 中文起名服务。
              简单易用，功能丰富，助力您的应用快速上线。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" type="button" onClick={() => toast.info(tCommon('comingSoon'))}>
                <Play className="mr-2 h-5 w-5" />
                快速开始
              </Button>
              <Button
                variant="outline"
                size="lg"
                type="button"
                onClick={() => toast.info(tCommon('comingSoon'))}
              >
                <Download className="mr-2 h-5 w-5" />
                下载 SDK
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">服务可用性</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold mb-2">&lt;200ms</div>
                  <div className="text-sm text-muted-foreground">平均响应时间</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold mb-2">256位</div>
                  <div className="text-sm text-muted-foreground">SSL 加密</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold mb-2">10+</div>
                  <div className="text-sm text-muted-foreground">API 端点</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Documentation */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="quickstart" className="space-y-8">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="quickstart">快速开始</TabsTrigger>
                <TabsTrigger value="authentication">认证</TabsTrigger>
                <TabsTrigger value="endpoints">API 端点</TabsTrigger>
                <TabsTrigger value="examples">代码示例</TabsTrigger>
                <TabsTrigger value="sdks">SDK</TabsTrigger>
              </TabsList>

              {/* Quick Start */}
              <TabsContent value="quickstart" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Play className="w-5 h-5" />
                      快速开始
                    </CardTitle>
                    <CardDescription>
                      几分钟内开始使用我们的 API
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          1
                        </div>
                        <h3 className="font-semibold">获取 API 密钥</h3>
                        <p className="text-sm text-muted-foreground">
                          在控制台中创建应用并获取您的 API 密钥
                        </p>
                        <Button variant="outline" size="sm">
                          获取密钥
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          2
                        </div>
                        <h3 className="font-semibold">发送第一个请求</h3>
                        <p className="text-sm text-muted-foreground">
                          使用我们的 API 生成您的第一个中文名字
                        </p>
                        <Button variant="outline" size="sm">
                          查看示例
                        </Button>
                      </div>
                      <div className="space-y-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                          3
                        </div>
                        <h3 className="font-semibold">集成到应用</h3>
                        <p className="text-sm text-muted-foreground">
                          将 API 集成到您的应用程序中
                        </p>
                        <Button variant="outline" size="sm">
                          下载 SDK
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>基础 URL</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                      https://api.chinesenamefinder.com/v1
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Authentication */}
              <TabsContent value="authentication" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      身份认证
                    </CardTitle>
                    <CardDescription>
                      了解如何安全地访问我们的 API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {authMethods.map((method, index) => {
                        const Icon = method.icon
                        return (
                          <div key={index} className="border rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                              <Icon className="w-6 h-6 text-primary" />
                              <h3 className="font-semibold">{method.name}</h3>
                            </div>
                            <p className="text-muted-foreground mb-4">
                              {method.description}
                            </p>
                            <div className="bg-muted p-3 rounded text-sm font-mono">
                              {method.example}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Endpoints */}
              <TabsContent value="endpoints" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      API 端点
                    </CardTitle>
                    <CardDescription>
                      详细的 API 端点文档和参数说明
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        {endpoints.map((endpoint) => (
                          <Button
                            key={endpoint.id}
                            variant={activeEndpoint === endpoint.id ? "default" : "outline"}
                            className="w-full justify-start"
                            onClick={() => setActiveEndpoint(endpoint.id)}
                          >
                            <Badge
                              variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                              className="mr-2 text-xs"
                            >
                              {endpoint.method}
                            </Badge>
                            {endpoint.name}
                          </Button>
                        ))}
                      </div>

                      <div className="lg:col-span-2">
                        {endpoints.map((endpoint) => (
                          activeEndpoint === endpoint.id && (
                            <div key={endpoint.id} className="space-y-6">
                              <div>
                                <h3 className="text-xl font-semibold mb-2">{endpoint.name}</h3>
                                <p className="text-muted-foreground mb-4">{endpoint.description}</p>
                                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                                  <Badge variant="outline" className="mr-2">
                                    {endpoint.method}
                                  </Badge>
                                  {endpoint.path}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">请求参数</h4>
                                <div className="space-y-2">
                                  {endpoint.parameters.map((param, index) => (
                                    <div key={index} className="border rounded p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                          {param.name}
                                        </code>
                                        <Badge variant={param.required ? "destructive" : "secondary"} className="text-xs">
                                          {param.required ? '必需' : '可选'}
                                        </Badge>
                                        <code className="text-xs text-muted-foreground">
                                          {param.type}
                                        </code>
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {param.description}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-3">响应示例</h4>
                                <div className="bg-muted p-4 rounded-lg">
                                  <pre className="text-sm overflow-x-auto">
                                    {JSON.stringify(endpoint.response.success, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Code Examples */}
              <TabsContent value="examples" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      代码示例
                    </CardTitle>
                    <CardDescription>
                      在不同编程语言中使用我们的 API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="javascript" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                        <TabsTrigger value="python">Python</TabsTrigger>
                        <TabsTrigger value="curl">cURL</TabsTrigger>
                      </TabsList>

                      {Object.entries(codeExamples).map(([lang, code]) => (
                        <TabsContent key={lang} value={lang}>
                          <div className="relative">
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{code}</code>
                            </pre>
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2"
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SDKs */}
              <TabsContent value="sdks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      SDK 和工具
                    </CardTitle>
                    <CardDescription>
                      官方 SDK 和开发工具，让集成更简单
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sdks.map((sdk, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{sdk.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${sdk.color}`} />
                              <span className="text-xs text-muted-foreground">{sdk.status}</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            disabled={sdk.status !== '可用'}
                          >
                            {sdk.status === '可用' ? '下载' : sdk.status}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Support Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <Code className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                需要技术支持？
              </h2>
              <p className="text-xl opacity-90 mb-8">
                我们的开发者支持团队随时为您提供技术帮助和集成指导
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <FileText className="mr-2 h-4 w-4" />
                    联系支持
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  开发者社区
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
