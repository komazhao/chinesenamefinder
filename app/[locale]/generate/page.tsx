'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sparkles,
  User,
  Calendar,
  MapPin,
  Heart,
  Loader2,
  RefreshCw,
  Star,
  Copy,
  Download,
  Save,
  Info,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useAuth } from '@/components/providers/auth-provider'
import { Header } from '@/components/layout/header'
import { toast } from 'sonner'

interface GeneratedName {
  id: string
  chinese: string
  pinyin: string
  meaning: string
  culturalContext: string
  suitability: number
  elements?: string[]
}

export default function GeneratePage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])
  const [selectedName, setSelectedName] = useState<GeneratedName | null>(null)
  const [step, setStep] = useState(1)

  // Form Data
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    englishName: '',
    gender: 'neutral',
    birthYear: new Date().getFullYear(),

    // Step 2: Style Preferences
    style: 'modern',
    tone: 'elegant',
    length: 2,

    // Step 3: Cultural Preferences
    meaning: '',
    avoidWords: '',
    culturalElements: [] as string[],

    // Advanced Options
    includeRareCharacters: false,
    preferTraditional: false,
  })

  const styles = [
    { value: 'traditional', label: '传统经典', description: '源自古籍诗词' },
    { value: 'modern', label: '现代简约', description: '简洁易记' },
    { value: 'elegant', label: '优雅诗意', description: '富有文学气息' },
    { value: 'nature', label: '自然清新', description: '取自自然元素' },
    { value: 'literary', label: '文学典故', description: '引经据典' },
  ]

  const handleGenerate = async () => {
    if (!user) {
      toast.error('请先登录')
      router.push('/auth/login')
      return
    }

    if (profile?.credits_remaining === 0) {
      toast.error('积分不足，请充值')
      router.push('/pricing')
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('生成失败')
      }

      const data = await response.json()
      setGeneratedNames(data.names)
      setStep(4) // Move to results step
      toast.success('名字生成成功！')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('生成失败，请稍后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveName = async (name: GeneratedName) => {
    try {
      const response = await fetch('/api/names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chinese_name: name.chinese,
          pinyin: name.pinyin,
          meaning: name.meaning,
          cultural_context: name.culturalContext,
          generation_type: formData.style,
        }),
      })

      if (!response.ok) {
        throw new Error('保存失败')
      }

      toast.success('名字已保存到收藏')
    } catch (error) {
      console.error('Save error:', error)
      toast.error('保存失败，请稍后重试')
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-background to-red-50/20">
        <div className="container mx-auto px-4 py-8">
          {/* Credits Display */}
          <div className="flex justify-end mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="flex items-center gap-2 p-4">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  剩余次数: <span className="text-primary">{profile?.credits_remaining || 0}</span>
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <React.Fragment key={i}>
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-medium
                      ${step >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                    `}>
                      {i}
                    </div>
                    {i < 4 && (
                      <ChevronRight className={`h-4 w-4 ${step > i ? 'text-primary' : 'text-muted-foreground'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step Content */}
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>告诉我们一些基本信息，以便生成最适合的名字</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="englishName">英文名或原名</Label>
                    <Input
                      id="englishName"
                      placeholder="例如: John, Sarah, 或您的原名"
                      value={formData.englishName}
                      onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>性别偏好</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">男性</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">女性</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="neutral" id="neutral" />
                          <Label htmlFor="neutral">中性</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthYear">出生年份（可选）</Label>
                    <Input
                      id="birthYear"
                      type="number"
                      placeholder="例如: 1995"
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) })}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    <p className="text-xs text-muted-foreground">用于生肖和五行分析</p>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!formData.englishName}
                    >
                      下一步
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>风格偏好</CardTitle>
                  <CardDescription>选择您喜欢的名字风格</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>名字风格</Label>
                    <div className="grid gap-3">
                      {styles.map((style) => (
                        <div
                          key={style.value}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${formData.style === style.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                          onClick={() => setFormData({ ...formData, style: style.value })}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{style.label}</p>
                              <p className="text-sm text-muted-foreground">{style.description}</p>
                            </div>
                            {formData.style === style.value && (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>名字长度</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[formData.length]}
                        onValueChange={([value]) => setFormData({ ...formData, length: value })}
                        min={2}
                        max={3}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">{formData.length}字</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      上一步
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      下一步
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>文化偏好</CardTitle>
                  <CardDescription>个性化您的名字（可选）</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="meaning">期望寓意</Label>
                    <Textarea
                      id="meaning"
                      placeholder="例如：希望名字寓意智慧、勇敢、善良等"
                      value={formData.meaning}
                      onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avoidWords">避免使用的字</Label>
                    <Input
                      id="avoidWords"
                      placeholder="例如：某些不喜欢的字或音"
                      value={formData.avoidWords}
                      onChange={(e) => setFormData({ ...formData, avoidWords: e.target.value })}
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      AI将根据您的偏好生成最合适的名字。留空将使用默认设置。
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      上一步
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          生成名字
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 4 && generatedNames.length > 0 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>生成结果</CardTitle>
                    <CardDescription>为您生成了 {generatedNames.length} 个名字</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {generatedNames.map((name) => (
                        <Card
                          key={name.id}
                          className={`cursor-pointer transition-all ${
                            selectedName?.id === name.id
                              ? 'border-primary shadow-lg'
                              : 'hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedName(name)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-2xl font-bold font-chinese">{name.chinese}</h3>
                                  <span className="text-lg text-muted-foreground">{name.pinyin}</span>
                                  <Badge variant="secondary">
                                    匹配度 {name.suitability}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{name.meaning}</p>
                                <p className="text-xs text-muted-foreground italic">{name.culturalContext}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    copyToClipboard(`${name.chinese} (${name.pinyin})`)
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSaveName(name)
                                  }}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                      <Button variant="outline" onClick={() => setStep(3)}>
                        重新设置
                      </Button>
                      <Button onClick={handleGenerate}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        重新生成
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {selectedName && (
                  <Card>
                    <CardHeader>
                      <CardTitle>名字详情</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center py-8">
                        <h2 className="text-5xl font-bold font-chinese mb-4">{selectedName.chinese}</h2>
                        <p className="text-2xl text-muted-foreground mb-2">{selectedName.pinyin}</p>
                        <div className="flex justify-center gap-2 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < Math.floor(selectedName.suitability / 20)
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium mb-1">寓意解释</h4>
                          <p className="text-sm text-muted-foreground">{selectedName.meaning}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">文化背景</h4>
                          <p className="text-sm text-muted-foreground">{selectedName.culturalContext}</p>
                        </div>
                      </div>

                      <div className="flex justify-center gap-4">
                        <Button onClick={() => copyToClipboard(`${selectedName.chinese} (${selectedName.pinyin})`)}>
                          <Copy className="mr-2 h-4 w-4" />
                          复制名字
                        </Button>
                        <Button variant="outline" onClick={() => handleSaveName(selectedName)}>
                          <Save className="mr-2 h-4 w-4" />
                          保存到收藏
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}