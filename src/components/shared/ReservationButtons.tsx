'use client';

import { useLocale, useTranslations } from 'next-intl';
import type { AppLocale } from '@/i18n/routing';

// External HBook booking site — not an internal route, so this deliberately
// bypasses the locale-aware <Link> from @/i18n/navigation.
const BOOKING_URLS: Record<AppLocale, string> = {
  sl: 'https://book.stari-mayr.si/sl/glavna-stran/',
  en: 'https://book.stari-mayr.si/',
};

export function ReservationButtons() {
  const t = useTranslations('cta');
  const locale = useLocale() as AppLocale;
  const href = BOOKING_URLS[locale] ?? BOOKING_URLS.sl;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block font-body uppercase tracking-[0.15em] text-xs px-5 py-3 transition-colors duration-300 bg-terracotta hover:bg-terracotta/90 text-cream"
    >
      {t('reserveRoom')}
    </a>
  );
}
