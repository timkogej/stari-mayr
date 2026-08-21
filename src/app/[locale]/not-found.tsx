import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center px-6">
        <p className="font-script text-honey text-2xl mb-4">404</p>
        <h1 className="font-display italic text-4xl md:text-6xl text-coffee mb-6 tracking-wide">
          {t('title')}
        </h1>
        <p className="font-body text-walnut mb-8">{t('body')}</p>
        <Link
          href="/"
          className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
        >
          {t('link')} →
        </Link>
      </div>
    </div>
  );
}
