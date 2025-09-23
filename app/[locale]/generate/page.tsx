'use client'


import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Sparkles,
  Loader2,
  RefreshCw,
  Star,
  Copy,
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
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useAuth } from '@/components/providers/auth-provider'
import { Header } from '@/components/layout/header'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'

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
  const t = useTranslations()
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
    {
      value: 'traditional',
      label: t('generate.form.styles.traditional.label'),
      description: t('generate.form.styles.traditional.description')
    },
    {
      value: 'modern',
      label: t('generate.form.styles.modern.label'),
      description: t('generate.form.styles.modern.description')
    },
    {
      value: 'elegant',
      label: t('generate.form.styles.elegant.label'),
      description: t('generate.form.styles.elegant.description')
    },
    {
      value: 'nature',
      label: t('generate.form.styles.nature.label'),
      description: t('generate.form.styles.nature.description')
    },
    {
      value: 'literary',
      label: t('generate.form.styles.literary.label'),
      description: t('generate.form.styles.literary.description')
    },
  ]

  const handleGenerate = async () => {
    if (!user) {
      toast.error(t('generate.errors.pleaseLogin'))
      router.push('/auth/login')
      return
    }

    if (profile?.credits_remaining === 0) {
      toast.error(t('generate.errors.insufficientCredits'))
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
        throw new Error('Generation failed')
      }

      const data = await response.json()
      setGeneratedNames(data.names)
      setStep(4) // Move to results step
      toast.success(t('generate.results.savedSuccessfully'))
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(t('generate.errors.generationFailed'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveName = async (name: GeneratedName) => {
    if (!user) {
      toast.error(t('generate.errors.pleaseLogin'))
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast.error(t('generate.errors.pleaseLogin'))
        return
      }

      const response = await fetch('/api/names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          english_name: formData.englishName || 'Generated Name',
          chinese_name: name.chinese,
          pinyin: name.pinyin,
          meaning: name.meaning,
          style: formData.style,
          is_favorite: false,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Save failed')
      }

      toast.success(t('generate.results.savedSuccessfully'))
    } catch (error) {
      console.error('Save error:', error)
      toast.error(t('generate.results.saveFailed'))
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(t('generate.results.copiedToClipboard'))
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
                  {t('generate.creditsRemaining')}: <span className="text-primary">{profile?.credits_remaining || 0}</span>
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
                  <CardTitle>{t('generate.form.basicInfoTitle')}</CardTitle>
                  <CardDescription>{t('generate.form.basicInfoDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="englishName">{t('generate.form.englishName')}</Label>
                    <Input
                      id="englishName"
                      placeholder={t('generate.form.englishNamePlaceholder')}
                      value={formData.englishName}
                      onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('generate.form.genderPreference')}</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">{t('generate.form.male')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">{t('generate.form.female')}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="neutral" id="neutral" />
                          <Label htmlFor="neutral">{t('generate.form.neutral')}</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthYear">{t('generate.form.birthYear')}</Label>
                    <Input
                      id="birthYear"
                      type="number"
                      placeholder={t('generate.form.birthYearPlaceholder')}
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) })}
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                    <p className="text-xs text-muted-foreground">{t('generate.form.birthYearHint')}</p>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!formData.englishName}
                    >
                      {t('generate.form.next')}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('generate.form.styleTitle')}</CardTitle>
                  <CardDescription>{t('generate.form.styleDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>{t('generate.form.nameStyle')}</Label>
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
                    <Label>{t('generate.form.nameLength')}</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[formData.length]}
                        onValueChange={([value]) => setFormData({ ...formData, length: value })}
                        min={2}
                        max={3}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-center font-medium">{formData.length}{t('generate.form.characters')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      {t('generate.form.previous')}
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      {t('generate.form.next')}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('generate.form.culturalTitle')}</CardTitle>
                  <CardDescription>{t('generate.form.culturalDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="meaning">{t('generate.form.expectedMeaning')}</Label>
                    <Textarea
                      id="meaning"
                      placeholder={t('generate.form.expectedMeaningPlaceholder')}
                      value={formData.meaning}
                      onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avoidWords">{t('generate.form.avoidWords')}</Label>
                    <Input
                      id="avoidWords"
                      placeholder={t('generate.form.avoidWordsPlaceholder')}
                      value={formData.avoidWords}
                      onChange={(e) => setFormData({ ...formData, avoidWords: e.target.value })}
                    />
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {t('generate.form.aiNote')}
                    </AlertDescription>
                  </Alert>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      {t('generate.form.previous')}
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('generate.form.generating')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          {t('generate.form.generateNames')}
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
                    <CardTitle>{t('generate.results.title')}</CardTitle>
                    <CardDescription>
                      {t('generate.results.description', { count: generatedNames.length })}
                    </CardDescription>
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
                                    {t('generate.results.matchRate')} {name.suitability}%
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
                        {t('generate.results.resetSettings')}
                      </Button>
                      <Button onClick={handleGenerate}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        {t('generate.results.regenerate')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {selectedName && (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('generate.results.nameDetails')}</CardTitle>
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
                          <h4 className="font-medium mb-1">{t('generate.results.meaningExplanation')}</h4>
                          <p className="text-sm text-muted-foreground">{selectedName.meaning}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{t('generate.results.culturalBackground')}</h4>
                          <p className="text-sm text-muted-foreground">{selectedName.culturalContext}</p>
                        </div>
                      </div>

                      <div className="flex justify-center gap-4">
                        <Button onClick={() => copyToClipboard(`${selectedName.chinese} (${selectedName.pinyin})`)}>
                          <Copy className="mr-2 h-4 w-4" />
                          {t('generate.results.copyName')}
                        </Button>
                        <Button variant="outline" onClick={() => handleSaveName(selectedName)}>
                          <Save className="mr-2 h-4 w-4" />
                          {t('generate.results.saveToCollection')}
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
