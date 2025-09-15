'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, Settings, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { user, profile, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
      setIsProfileOpen(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const navigation = [
    { name: '首页', href: '/' },
    { name: 'AI起名', href: '/generate' },
    { name: '功能特色', href: '/#features' },
    { name: '定价方案', href: '/pricing' },
    { name: '文化故事', href: '/stories' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg font-bold">
            文
          </div>
          <span className="font-bold text-xl text-foreground">
            文化伴侣
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-2">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {profile?.display_name?.[0] || user.email?.[0] || 'U'}
                  </div>
                  <span className="text-sm">
                    {profile?.display_name || '用户'}
                  </span>
                </Button>

                {isProfileOpen && (
                  <Card className="absolute right-0 top-full mt-2 w-64 p-4 shadow-lg z-50">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          {profile?.display_name?.[0] || user.email?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">
                            {profile?.display_name || '用户'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2 border-t">
                        <span className="text-sm text-muted-foreground">剩余积分</span>
                        <span className="font-medium">
                          {profile?.credits_remaining || 0}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span className="text-sm">个人中心</span>
                        </Link>

                        <Link
                          href="/settings"
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">设置</span>
                        </Link>

                        <Link
                          href="/pricing"
                          className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm">购买积分</span>
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-muted transition-colors text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">退出登录</span>
                        </button>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">登录</Link>
                </Button>
                <Button variant="chinese" size="sm" asChild>
                  <Link href="/auth/register">免费注册</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <Card className="m-4 p-6">
              <div className="space-y-6">
                {/* Navigation Links */}
                <div className="space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth */}
                <div className="pt-4 border-t">
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
                      </div>
                    </div>
                  ) : user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          {profile?.display_name?.[0] || user.email?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-medium">
                            {profile?.display_name || '用户'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            剩余积分: {profile?.credits_remaining || 0}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link href="/dashboard">
                            <User className="w-4 h-4 mr-2" />
                            个人中心
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Link href="/pricing">
                            <CreditCard className="w-4 h-4 mr-2" />
                            购买积分
                          </Link>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            handleSignOut()
                            setIsMenuOpen(false)
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          退出登录
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/auth/login">登录</Link>
                      </Button>
                      <Button
                        variant="chinese"
                        className="w-full"
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/auth/register">免费注册</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </nav>

      {/* Click outside to close profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </header>
  )
}