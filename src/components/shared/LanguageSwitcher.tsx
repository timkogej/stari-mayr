'use client';
import { useLocale, useMessages } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const messages = useMessages();
  const labels = messages.languageSwitcher;

  const switchTo = (target: 'sl' | 'en') => {
    router.replace(pathname, { locale: target });
  };

  return (
    <div className="flex items-center gap-2 font-body text-xs uppercase tracking-widest">
      <button
        type="button"
        onClick={() => switchTo('sl')}
        className={
          locale === 'sl'
            ? 'text-bronze font-medium'
            : 'text-walnut/60 hover:text-walnut transition-colors'
        }
      >
        {labels.sl}
      </button>
      <span className="border-l border-sand h-3" />
      <button
        type="button"
        onClick={() => switchTo('en')}
        className={
          locale === 'en'
            ? 'text-bronze font-medium'
            : 'text-walnut/60 hover:text-walnut transition-colors'
        }
      >
        {labels.en}
      </button>
    </div>
  );
}
