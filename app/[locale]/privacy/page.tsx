'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  FileText,
  Calendar,
  Globe,
  Mail,
  Phone,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
  const t = useTranslations()

  const lastUpdated = '2024年3月15日'

  const sections = [
    {
      id: 'overview',
      title: '隐私政策概述',
      icon: Shield,
      content: [
        '文化伴侣（以下简称"我们"）深知您对个人信息保护的关注，我们承诺保护您的隐私安全。',
        '本隐私政策说明了我们如何收集、使用、储存和保护您的个人信息。',
        '我们严格遵守《中华人民共和国网络安全法》、《个人信息保护法》等相关法律法规。'
      ]
    },
    {
      id: 'collection',
      title: '信息收集',
      icon: Database,
      content: [
        '我们收集的信息类型包括：',
        '• 账户信息：姓名、邮箱、手机号等注册信息',
        '• 使用信息：起名偏好、生成历史、使用统计等',
        '• 设备信息：IP地址、浏览器类型、操作系统等',
        '• 支付信息：通过第三方支付平台处理，我们不直接存储支付卡信息'
      ]
    },
    {
      id: 'usage',
      title: '信息使用',
      icon: Settings,
      content: [
        '我们使用收集的信息用于：',
        '• 提供AI起名服务和个性化推荐',
        '• 改进产品功能和用户体验',
        '• 处理订单和提供客户支持',
        '• 发送服务通知和重要更新',
        '• 防范欺诈和确保服务安全'
      ]
    },
    {
      id: 'sharing',
      title: '信息共享',
      icon: UserCheck,
      content: [
        '我们承诺不会出售您的个人信息。在以下情况下可能共享信息：',
        '• 获得您的明确同意',
        '• 与可信的第三方服务提供商合作（如支付处理、云存储）',
        '• 遵守法律法规要求或配合执法部门',
        '• 保护我们或他人的合法权益',
        '所有第三方合作伙伴都签署了严格的保密协议。'
      ]
    },
    {
      id: 'storage',
      title: '信息存储',
      icon: Lock,
      content: [
        '我们采用业界标准的安全措施保护您的信息：',
        '• 使用SSL/TLS加密技术传输数据',
        '• 数据库采用AES-256加密存储',
        '• 定期进行安全审计和漏洞检测',
        '• 实施严格的访问控制和权限管理',
        '• 数据备份和灾难恢复机制'
      ]
    },
    {
      id: 'rights',
      title: '您的权利',
      icon: Eye,
      content: [
        '根据相关法律法规，您享有以下权利：',
        '• 访问权：查看我们持有的您的个人信息',
        '• 更正权：要求更正不准确的个人信息',
        '• 删除权：要求删除您的个人信息',
        '• 限制处理权：限制我们处理您的个人信息',
        '• 数据可携权：要求以结构化格式获取您的数据',
        '• 撤回同意权：随时撤回您之前给予的同意'
      ]
    }
  ]

  const dataTypes = [
    { name: '账户信息', purpose: '用户认证和账户管理', retention: '账户存续期间', required: true },
    { name: '起名偏好', purpose: '个性化服务推荐', retention: '2年', required: false },
    { name: '使用统计', purpose: '产品改进和分析', retention: '1年', required: false },
    { name: '支付记录', purpose: '财务管理和客服', retention: '5年', required: true },
    { name: '客服记录', purpose: '问题解决和服务改进', retention: '3年', required: false }
  ]

  const thirdPartyServices = [
    { name: '阿里云', purpose: '云计算和数据存储', dataTypes: '加密的用户数据' },
    { name: '微信支付', purpose: '支付处理', dataTypes: '交易信息' },
    { name: '支付宝', purpose: '支付处理', dataTypes: '交易信息' },
    { name: '腾讯云', purpose: '内容分发网络', dataTypes: '匿名化访问日志' }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              隐私政策
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              保护您的隐私安全
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              我们深知隐私保护的重要性，承诺以透明、负责的方式处理您的个人信息。
              这份隐私政策详细说明了我们的数据处理实践。
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                最后更新：{lastUpdated}
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                适用地区：全球
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">数据安全</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    采用银行级别的安全措施保护您的数据
                  </p>
                  <Button variant="outline" size="sm">
                    了解详情
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">透明处理</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    清楚说明数据收集和使用的目的
                  </p>
                  <Button variant="outline" size="sm">
                    查看详情
                  </Button>
                </CardContent>
              </Card>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">用户控制</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    您可以随时管理和控制您的数据
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/settings">
                      管理数据
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.id} id={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.content.map((paragraph, index) => (
                        <p key={index} className="text-muted-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Data Types Table */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  数据处理详情
                </CardTitle>
                <CardDescription>
                  我们处理的具体数据类型及其用途
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">数据类型</th>
                        <th className="text-left py-3 px-4">处理目的</th>
                        <th className="text-left py-3 px-4">保存期限</th>
                        <th className="text-left py-3 px-4">是否必需</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataTypes.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4 font-medium">{item.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.purpose}</td>
                          <td className="py-3 px-4 text-muted-foreground">{item.retention}</td>
                          <td className="py-3 px-4">
                            <Badge variant={item.required ? "destructive" : "secondary"}>
                              {item.required ? '必需' : '可选'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Third Party Services */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  第三方服务提供商
                </CardTitle>
                <CardDescription>
                  我们合作的第三方服务商及其数据处理范围
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {thirdPartyServices.map((service, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2">{service.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>用途：</strong>{service.purpose}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>数据类型：</strong>{service.dataTypes}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Important Notices */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>儿童隐私保护：</strong>我们的服务面向18岁以上用户。如果您未满18岁，请在监护人指导下使用我们的服务。
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>政策变更通知：</strong>如果我们的隐私政策发生重大变更，我们会通过邮件或网站公告提前30天通知您。
              </AlertDescription>
            </Alert>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>数据跨境传输：</strong>您的数据主要存储在中国境内的服务器上。如需跨境传输，我们会采取适当的安全措施。
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                有隐私问题？联系我们
              </h2>
              <p className="text-xl opacity-90 mb-8">
                如果您对我们的隐私政策有任何疑问或需要行使您的数据权利，
                请随时联系我们的数据保护团队
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center justify-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>privacy@chinesenamefinder.com</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>+86 400-123-4567</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    联系我们
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    管理数据
                  </Link>
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