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
  const t = useTranslations('settings')
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
      toast.success(t('toast.profileSaved'))
    } catch (error) {
      toast.error(t('toast.saveFailed'))
    } finally {
      setIsLoading(false)
    }
  }

  const usageStats = [
    { label: t('stats.totalGenerations'), value: '156', icon: SettingsIcon },
    { label: t('stats.monthlyGenerations'), value: '23', icon: User },
    { label: t('stats.favoriteNames'), value: '8', icon: CheckCircle },
    { label: t('stats.accountCredits'), value: '1,250', icon: CreditCard }
  ]

  const recentActivity = [
    { action: t('activity.generateName'), details: t('activity.generateNameDetails'), time: t('activity.timeAgo.hoursAgo', { count: 2 }) },
    { action: t('activity.modifyPreferences'), details: t('activity.modifyPreferencesDetails'), time: t('activity.timeAgo.daysAgo', { count: 1 }) },
    { action: t('activity.downloadReport'), details: t('activity.downloadReportDetails'), time: t('activity.timeAgo.daysAgo', { count: 3 }) },
    { action: t('activity.accountRecharge'), details: t('activity.accountRechargeDetails'), time: t('activity.timeAgo.weeksAgo', { count: 1 }) }
  ]

  const connectedDevices = [
    { name: t('devices.iphone'), type: 'mobile', lastSeen: t('activity.timeAgo.justNow'), current: true },
    { name: t('devices.macbook'), type: 'desktop', lastSeen: t('activity.timeAgo.hoursAgo', { count: 2 }), current: false },
    { name: t('devices.ipad'), type: 'tablet', lastSeen: t('activity.timeAgo.daysAgo', { count: 1 }), current: false }
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-blue-50/20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4" variant="secondary">
              {t('pageTitle')}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('pageHeading')}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {t('pageDescription')}
            </p>
          </div>
        </section>

        {/* Usage Stats */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{t('usageOverview')}</h2>
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
                <TabsTrigger value="profile">{t('tabs.profile')}</TabsTrigger>
                <TabsTrigger value="preferences">{t('tabs.preferences')}</TabsTrigger>
                <TabsTrigger value="notifications">{t('tabs.notifications')}</TabsTrigger>
                <TabsTrigger value="security">{t('tabs.security')}</TabsTrigger>
                <TabsTrigger value="billing">{t('tabs.billing')}</TabsTrigger>
                <TabsTrigger value="data">{t('tabs.data')}</TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {t('profile.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('profile.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('profile.fullName')}</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('profile.email')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('profile.phone')}</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">{t('profile.birthDate')}</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={profile.birthDate}
                          onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">{t('profile.location')}</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">{t('profile.website')}</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t('profile.bioLabel')}</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <Button onClick={() => handleSave(t('profile.title'))} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {t('profile.saveProfile')}
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
                      {t('preferences.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('preferences.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="language">{t('preferences.interfaceLanguage')}</Label>
                        <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="zh-CN">{t('preferences.simplifiedChinese')}</SelectItem>
                            <SelectItem value="zh-TW">{t('preferences.traditionalChinese')}</SelectItem>
                            <SelectItem value="en-US">{t('preferences.english')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">{t('preferences.timezone')}</Label>
                        <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Asia/Shanghai">{t('preferences.chinaTime')}</SelectItem>
                            <SelectItem value="Asia/Tokyo">{t('preferences.japanTime')}</SelectItem>
                            <SelectItem value="America/New_York">{t('preferences.usEastTime')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">{t('preferences.currency')}</Label>
                        <Select value={preferences.currency} onValueChange={(value) => setPreferences({ ...preferences, currency: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CNY">{t('preferences.cny')}</SelectItem>
                            <SelectItem value="USD">{t('preferences.usd')}</SelectItem>
                            <SelectItem value="EUR">{t('preferences.eur')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="namingStyle">{t('preferences.defaultNamingStyle')}</Label>
                        <Select value={preferences.namingStyle} onValueChange={(value) => setPreferences({ ...preferences, namingStyle: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="traditional">{t('preferences.traditionalStyle')}</SelectItem>
                            <SelectItem value="modern">{t('preferences.modernStyle')}</SelectItem>
                            <SelectItem value="poetic">{t('preferences.poeticStyle')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('preferences.darkMode')}</Label>
                          <p className="text-sm text-muted-foreground">{t('preferences.darkModeDesc')}</p>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('preferences.autoSave')}</Label>
                          <p className="text-sm text-muted-foreground">{t('preferences.autoSaveDesc')}</p>
                        </div>
                        <Switch
                          checked={preferences.autoSave}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, autoSave: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('preferences.soundEffects')}</Label>
                          <p className="text-sm text-muted-foreground">{t('preferences.soundEffectsDesc')}</p>
                        </div>
                        <Switch
                          checked={preferences.soundEnabled}
                          onCheckedChange={(checked) => setPreferences({ ...preferences, soundEnabled: checked })}
                        />
                      </div>
                    </div>

                    <Button onClick={() => handleSave(t('preferences.title'))} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {t('preferences.savePreferences')}
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
                      {t('notifications.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('notifications.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('notifications.emailNotifications')}</Label>
                          <p className="text-sm text-muted-foreground">{t('notifications.emailNotificationsDesc')}</p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('notifications.pushNotifications')}</Label>
                          <p className="text-sm text-muted-foreground">{t('notifications.pushNotificationsDesc')}</p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('notifications.smsNotifications')}</Label>
                          <p className="text-sm text-muted-foreground">{t('notifications.smsNotificationsDesc')}</p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>{t('notifications.marketingNotifications')}</Label>
                          <p className="text-sm text-muted-foreground">{t('notifications.marketingNotificationsDesc')}</p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                        />
                      </div>
                    </div>

                    <Button onClick={() => handleSave(t('notifications.title'))} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {t('notifications.saveNotifications')}
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
                      {t('security.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('security.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">{t('security.currentPassword')}</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('security.currentPasswordPlaceholder')}
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
                        <Label htmlFor="newPassword">{t('security.newPassword')}</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder={t('security.newPasswordPlaceholder')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">{t('security.confirmPassword')}</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder={t('security.confirmPasswordPlaceholder')}
                        />
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {t('security.passwordRequirements')}
                      </AlertDescription>
                    </Alert>

                    <Button onClick={() => handleSave('密码')} disabled={isLoading}>
                      <Key className="mr-2 h-4 w-4" />
                      {t('security.updatePassword')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('security.connectedDevices')}</CardTitle>
                    <CardDescription>
                      {t('security.connectedDevicesDesc')}
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
                                {t('security.lastActivity')}: {device.lastSeen}
                                {device.current && <Badge variant="secondary" className="ml-2">{t('security.currentDevice')}</Badge>}
                              </p>
                            </div>
                          </div>
                          {!device.current && (
                            <Button variant="outline" size="sm">
                              {t('security.signOut')}
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
                      {t('billing.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('billing.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        {t('billing.currentPlan')}
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{t('billing.premiumPlan')}</p>
                          <p className="text-sm text-muted-foreground">{t('billing.premiumPlanDesc')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">¥99/月</p>
                          <Badge variant="outline">{t('billing.currentPlanBadge')}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        {t('billing.downloadInvoice')}
                      </Button>
                      <Button variant="outline">
                        {t('billing.manageSubscription')}
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
                      {t('data.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('data.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{t('data.exportData')}</p>
                          <p className="text-sm text-muted-foreground">{t('data.exportDataDesc')}</p>
                        </div>
                        <Button variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          {t('data.export')}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                        <div>
                          <p className="font-medium text-destructive">{t('data.deleteAccount')}</p>
                          <p className="text-sm text-muted-foreground">{t('data.deleteAccountDesc')}</p>
                        </div>
                        <Button variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('data.delete')}
                        </Button>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {t('data.deleteWarning')}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('data.recentActivity')}</CardTitle>
                    <CardDescription>
                      {t('data.recentActivityDesc')}
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