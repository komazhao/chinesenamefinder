'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  User,
  Mail,
  Shield,
  Bell,
  Globe,
  Key,
  CreditCard,
  Download,
  Trash2,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const t = useTranslations()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true
  })

  const [profile, setProfile] = useState({
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '+86 138 0013 8000',
    bio: '热爱中华文化的起名爱好者',
    location: '中国 北京',
    website: 'https://example.com',
    birthDate: '1990-01-01'
  })

  const [preferences, setPreferences] = useState({
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    currency: 'CNY',
    namingStyle: 'traditional',
    autoSave: true,
    soundEnabled: true
  })

  const handleSave = async (section: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`${section}设置已保存`)
    } catch (error) {
      toast.error('保存失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const usageStats = [
    { label: '总生成次数', value: '156', icon: SettingsIcon },
    { label: '本月生成', value: '23', icon: User },
    { label: '收藏名字', value: '8', icon: CheckCircle },
    { label: '账户积分', value: '1,250', icon: CreditCard }
  ]

  const recentActivity = [
    { action: '生成名字', details: '张雅文 - 诗意风格', time: '2小时前' },
    { action: '修改偏好', details: '更新命名风格偏好', time: '1天前' },
    { action: '下载报告', details: '五行分析报告', time: '3天前' },
    { action: '账户充值', details: '购买高级套餐', time: '1周前' }
  ]

  const connectedDevices = [
    { name: 'iPhone 15 Pro', type: 'mobile', lastSeen: '刚刚', current: true },
    { name: 'MacBook Pro', type: 'desktop', lastSeen: '2小时前', current: false },
    { name: 'iPad Air', type: 'tablet', lastSeen: '1天前', current: false }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-blue-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              账户设置
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              管理您的账户
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              个性化您的体验，管理隐私设置，查看使用统计，
              让文化伴侣更好地为您服务。
            </p>
          </div>
        </section>

        {/* Usage Stats */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">使用概览</h2>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {usageStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="text-2xl font-bold mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Settings Tabs */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="profile" className="space-y-8">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="profile">个人资料</TabsTrigger>
                <TabsTrigger value="preferences">偏好设置</TabsTrigger>
                <TabsTrigger value="notifications">通知设置</TabsTrigger>
                <TabsTrigger value="security">安全设置</TabsTrigger>
                <TabsTrigger value="billing">账单设置</TabsTrigger>
                <TabsTrigger value="data">数据管理</TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      个人资料
                    </CardTitle>
                    <CardDescription>
                      管理您的个人信息和账户详情
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">手机号</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">出生日期</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={profile.birthDate}
                          onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">所在地</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">个人网站</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">个人简介</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button onClick={() => handleSave('个人资料')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      保存更改
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <SettingsIcon className="w-5 h-5" />
                      偏好设置
                    </CardTitle>
                    <CardDescription>
                      自定义您的使用体验和默认设置
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">界面语言</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zh-CN">简体中文</SelectItem>
                            <SelectItem value="zh-TW">繁体中文</SelectItem>
                            <SelectItem value="en-US">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">时区</Label>
                        <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Shanghai">中国时间 (UTC+8)</SelectItem>
                            <SelectItem value="Asia/Tokyo">日本时间 (UTC+9)</SelectItem>
                            <SelectItem value="America/New_York">美东时间 (UTC-5)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">货币</Label>
                        <Select value={preferences.currency} onValueChange={(value) => setPreferences({ ...preferences, currency: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CNY">人民币 (¥)</SelectItem>
                            <SelectItem value="USD">美元 ($)</SelectItem>
                            <SelectItem value="EUR">欧元 (€)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="namingStyle">默认起名风格</Label>
                        <Select value={preferences.namingStyle} onValueChange={(value) => setPreferences({ ...preferences, namingStyle: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="traditional">传统风格</SelectItem>
                            <SelectItem value="modern">现代风格</SelectItem>
                            <SelectItem value="poetic">诗意风格</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>深色模式</Label>
                          <p className="text-sm text-muted-foreground">启用深色主题界面</p>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>自动保存</Label>
                          <p className="text-sm text-muted-foreground">自动保存您的起名偏好</p>
                        </div>
                        <Switch
                          checked={preferences.autoSave}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>声音效果</Label>
                          <p className="text-sm text-muted-foreground">启用界面交互声音</p>
                        </div>
                        <Switch
                          checked={preferences.soundEnabled}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, soundEnabled: checked })}
                        />
                      </div>
                    </div>

                    <Button onClick={() => handleSave('偏好设置')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      保存设置
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      通知设置
                    </CardTitle>
                    <CardDescription>
                      管理您接收通知的方式和内容
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>邮件通知</Label>
                          <p className="text-sm text-muted-foreground">接收重要更新和生成结果</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>推送通知</Label>
                          <p className="text-sm text-muted-foreground">浏览器推送通知</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>短信通知</Label>
                          <p className="text-sm text-muted-foreground">重要安全提醒</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>营销通知</Label>
                          <p className="text-sm text-muted-foreground">产品更新和优惠信息</p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                        />
                      </div>
                    </div>

                    <Button onClick={() => handleSave('通知设置')} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      保存设置
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      安全设置
                    </CardTitle>
                    <CardDescription>
                      保护您的账户安全和隐私
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">当前密码</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="请输入当前密码"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">新密码</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="请输入新密码"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">确认新密码</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="再次输入新密码"
                        />
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        密码长度至少8位，包含字母、数字和特殊字符
                      </AlertDescription>
                    </Alert>

                    <Button onClick={() => handleSave('密码')} disabled={isLoading}>
                      <Key className="mr-2 h-4 w-4" />
                      更新密码
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>已登录设备</CardTitle>
                    <CardDescription>
                      管理您的登录设备和会话
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {connectedDevices.map((device, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {device.type === 'mobile' && <Smartphone className="w-5 h-5 text-muted-foreground" />}
                            {device.type === 'desktop' && <Monitor className="w-5 h-5 text-muted-foreground" />}
                            {device.type === 'tablet' && <Monitor className="w-5 h-5 text-muted-foreground" />}
                            <div>
                              <p className="font-medium">{device.name}</p>
                              <p className="text-sm text-muted-foreground">
                                最后活动: {device.lastSeen}
                                {device.current && <Badge variant="secondary" className="ml-2">当前设备</Badge>}
                              </p>
                            </div>
                          </div>
                          {!device.current && (
                            <Button variant="outline" size="sm">
                              注销
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing */}
              <TabsContent value="billing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      账单设置
                    </CardTitle>
                    <CardDescription>
                      管理您的订阅和支付方式
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        您当前使用的是高级套餐，下次续费时间：2024年4月15日
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">高级套餐</p>
                          <p className="text-sm text-muted-foreground">无限次AI起名 + 高级分析</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">¥99/月</p>
                          <Badge variant="outline">当前套餐</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        下载发票
                      </Button>
                      <Button variant="outline">
                        管理订阅
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Management */}
              <TabsContent value="data" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      数据管理
                    </CardTitle>
                    <CardDescription>
                      导出、删除或管理您的数据
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">导出数据</p>
                          <p className="text-sm text-muted-foreground">下载您的所有数据副本</p>
                        </div>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          导出
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                        <div>
                          <p className="font-medium text-destructive">删除账户</p>
                          <p className="text-sm text-muted-foreground">永久删除您的账户和所有数据</p>
                        </div>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          删除
                        </Button>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        删除账户是不可逆操作，请谨慎考虑
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>最近活动</CardTitle>
                    <CardDescription>
                      查看您的账户活动记录
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            <p className="text-sm text-muted-foreground">{activity.details}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}