import { Metadata } from 'next'
import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { PricingSection } from '@/components/sections/pricing-section'
import { CTASection } from '@/components/sections/cta-section'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: '专业AI中文起名服务',
  description: '文化伴侣为全球用户提供专业、智能的中文名生成服务，融合传统文化与现代AI技术，让每个名字都富有深刻的文化内涵。',
  keywords: [
    'AI中文起名',
    '智能起名',
    '中国文化',
    '五行起名',
    '诗意命名',
    '文化伴侣',
    'Chinese name generator'
  ],
  openGraph: {
    title: '文化伴侣 - 专业AI中文起名服务',
    description: '融合传统文化与现代AI技术的专业中文起名平台',
    type: 'website',
    images: [
      {
        url: '/og-homepage.jpg',
        width: 1200,
        height: 630,
        alt: '文化伴侣 - AI中文起名',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}