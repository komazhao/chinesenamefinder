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
  FileText,
  Scale,
  UserCheck,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Globe,
  Mail,
  Phone,
  Ban,
  Info,
  Clock,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const t = useTranslations()

  const lastUpdated = '2024年3月15日'
  const effectiveDate = '2024年1月1日'

  const sections = [
    {
      id: 'acceptance',
      title: '条款接受',
      icon: UserCheck,
      content: [
        '欢迎使用文化伴侣AI中文起名服务（以下简称"本服务"）。本服务由文化伴侣科技有限公司（以下简称"我们"或"公司"）提供。',
        '通过访问或使用本服务，您确认已阅读、理解并同意遵守本服务条款。如果您不同意这些条款，请不要使用本服务。',
        '我们保留随时修改本条款的权利。重大变更将提前30天通知用户。继续使用服务即表示接受修改后的条款。'
      ]
    },
    {
      id: 'services',
      title: '服务描述',
      icon: BookOpen,
      content: [
        '文化伴侣提供基于人工智能技术的中文起名服务，包括但不限于：',
        '• AI智能起名：根据用户输入生成个性化中文名字',
        '• 五行八字分析：提供传统文化角度的名字分析',
        '• 文化内涵解读：解释名字的文化背景和寓意',
        '• 个性化推荐：基于用户偏好提供定制化建议',
        '• 历史记录管理：保存和管理用户的起名历史',
        '我们致力于提供准确、有意义的起名建议，但不保证所生成名字的绝对适用性。'
      ]
    },
    {
      id: 'accounts',
      title: '用户账户',
      icon: Shield,
      content: [
        '用户账户责任：',
        '• 您有责任维护账户信息的准确性和及时性',
        '• 您有责任保护账户密码的安全性',
        '• 您对账户下发生的所有活动承担责任',
        '• 如发现账户被盗用，请立即联系我们',
        '账户限制：',
        '• 每个用户只能注册一个账户',
        '• 不得与他人共享账户信息',
        '• 不得使用虚假信息注册账户'
      ]
    },
    {
      id: 'usage',
      title: '使用规范',
      icon: CheckCircle,
      content: [
        '允许的使用：',
        '• 为个人或家庭成员起名',
        '• 学习和了解中华文化',
        '• 合法的商业命名需求',
        '禁止的使用：',
        '• 生成违法、有害或不当内容',
        '• 恶意攻击或滥用系统资源',
        '• 侵犯他人知识产权',
        '• 进行商业性质的大规模起名服务转售',
        '• 使用自动化工具批量生成名字'
      ]
    },
    {
      id: 'payment',
      title: '付费服务',
      icon: CreditCard,
      content: [
        '订阅和付费：',
        '• 部分高级功能需要付费订阅',
        '• 订阅费用将在订阅期开始时收取',
        '• 所有价格均以人民币计价，包含适用税费',
        '退款政策：',
        '• 免费试用期内可随时取消，无需支付费用',
        '• 付费订阅支持7天无理由退款',
        '• 退款将在5-10个工作日内处理',
        '• 部分消费积分或虚拟物品不支持退款'
      ]
    },
    {
      id: 'intellectual',
      title: '知识产权',
      icon: Scale,
      content: [
        '服务内容权利：',
        '• 本服务的所有内容、技术和设计均受知识产权法保护',
        '• 未经授权，不得复制、修改或分发我们的服务内容',
        '• 用户生成的名字建议仅供个人使用',
        '用户内容：',
        '• 您保留对提交内容的所有权',
        '• 您授权我们为提供服务而使用您的内容',
        '• 我们不对用户提交的内容承担责任'
      ]
    },
    {
      id: 'limitations',
      title: '责任限制',
      icon: AlertTriangle,
      content: [
        '服务限制：',
        '• 本服务基于AI技术，生成结果仅供参考',
        '• 我们不保证服务的连续性和绝对准确性',
        '• 传统文化解读可能存在不同观点和解释',
        '责任范围：',
        '• 我们的责任限于订阅费用金额',
        '• 不承担因使用服务而产生的间接损失',
        '• 不对第三方服务或内容承担责任',
        '• 用户应自行承担使用风险'
      ]
    },
    {
      id: 'termination',
      title: '服务终止',
      icon: Ban,
      content: [
        '用户终止：',
        '• 您可以随时停止使用本服务',
        '• 删除账户将永久移除所有相关数据',
        '• 终止不影响已产生的付费义务',
        '我们终止：',
        '• 我们保留暂停或终止违规账户的权利',
        '• 服务重大变更时将提前通知',
        '• 终止时将按比例退还未使用的订阅费用'
      ]
    }
  ]

  const keyPoints = [
    {
      title: '服务性质',
      description: '基于AI技术的起名建议服务，结果仅供参考',
      icon: Info
    },
    {
      title: '用户责任',
      description: '负责账户安全，遵守使用规范',
      icon: UserCheck
    },
    {
      title: '付费规则',
      description: '透明定价，支持7天无理由退款',
      icon: CreditCard
    },
    {
      title: '知识产权',
      description: '尊重知识产权，合理使用服务内容',
      icon: Scale
    }
  ]

  const contactInfo = [
    { type: '法务邮箱', value: 'legal@chinesenamefinder.com', icon: Mail },
    { type: '客服电话', value: '+86 400-123-4567', icon: Phone },
    { type: '公司地址', value: '北京市朝阳区科技园区', icon: Globe }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-amber-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              服务条款
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              服务条款与使用协议
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              请仔细阅读以下条款。使用我们的服务即表示您同意遵守这些条款。
              我们致力于为您提供优质服务的同时保护双方的合法权益。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                最后更新：{lastUpdated}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                生效日期：{effectiveDate}
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                适用地区：全球
              </div>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">重点条款概述</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {keyPoints.map((point, index) => {
                const Icon = point.icon
                return (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {point.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Alert className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>重要提醒：</strong>本服务条款构成您与文化伴侣之间具有法律约束力的协议。请在使用服务前仔细阅读所有条款。如有疑问，请联系我们的法务团队。
              </AlertDescription>
            </Alert>
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
                        <p key={index} className="text-muted-foreground leading-relaxed whitespace-pre-line">
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

        {/* Dispute Resolution */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  争议解决
                </CardTitle>
                <CardDescription>
                  如何处理可能出现的争议和分歧
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">友好协商</h4>
                    <p className="text-sm text-muted-foreground">
                      优先通过直接沟通解决争议
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-green-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">调解机制</h4>
                    <p className="text-sm text-muted-foreground">
                      通过第三方调解机构协助解决
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">法律途径</h4>
                    <p className="text-sm text-muted-foreground">
                      最后通过北京市人民法院解决
                    </p>
                  </div>
                </div>
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    本条款受中华人民共和国法律管辖。任何争议应优先通过友好协商解决，协商不成的，提交北京市有管辖权的人民法院审理。
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Legal Entity Info */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>公司信息</CardTitle>
                <CardDescription>
                  服务提供方的法律主体信息
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">公司详情</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>公司名称：</strong>文化伴侣科技有限公司</p>
                      <p><strong>注册地址：</strong>北京市朝阳区科技园区</p>
                      <p><strong>统一社会信用代码：</strong>91110000XXXXXXXXXX</p>
                      <p><strong>法定代表人：</strong>张某某</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">联系方式</h4>
                    <div className="space-y-3">
                      {contactInfo.map((contact, index) => {
                        const Icon = contact.icon
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              <strong>{contact.type}：</strong>{contact.value}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container mx-auto px-4 py-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">
                条款疑问？我们来解答
              </h2>
              <p className="text-xl opacity-90 mb-8">
                如果您对服务条款有任何疑问或需要法律建议，
                我们的法务团队随时为您提供专业解答
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-center gap-2">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">legal@chinesenamefinder.com</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+86 400-123-4567</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">工作日 9:00-18:00</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    联系法务
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link href="/privacy">
                    <Shield className="mr-2 h-4 w-4" />
                    隐私政策
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final Notice */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-center">
                <strong>感谢您选择文化伴侣！</strong>
                我们承诺遵守所有适用法律法规，为您提供安全、可靠的服务。
                您的信任是我们持续改进的动力。
              </AlertDescription>
            </Alert>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}