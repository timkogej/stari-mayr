'use client';

import { useTranslations } from 'next-intl';
import { COOKIE_CONSENT_OPEN_SETTINGS_EVENT } from '@/lib/cookie-consent';

export function CookieSettingsButton() {
  const t = useTranslations('footer');

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_OPEN_SETTINGS_EVENT))}
      className="hover:text-cream/80 transition-colors"
    >
      {t('cookieSettings')}
    </button>
  );
}
