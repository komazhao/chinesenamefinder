import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t('title')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('description')}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('sections.products')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/generate" className="hover:text-foreground transition-colors">{t('links.ai_naming')}</Link></li>
              <li><Link href="/stories" className="hover:text-foreground transition-colors">{t('links.stories')}</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition-colors">{t('links.pricing')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('sections.support')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/help" className="hover:text-foreground transition-colors">{t('links.help')}</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">{t('links.contact')}</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground transition-colors">{t('links.dashboard')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">{t('sections.about')}</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">{t('links.about')}</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">{t('links.privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">{t('links.terms')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}