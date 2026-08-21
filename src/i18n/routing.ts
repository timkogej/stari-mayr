import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['sl', 'en'],
  defaultLocale: 'sl',
  localePrefix: {
    mode: 'as-needed',
  },
  pathnames: {
    '/': '/',
    '/ponudba': { sl: '/ponudba', en: '/offer' },
    '/sobe': { sl: '/sobe', en: '/rooms' },
    '/o-nas': { sl: '/o-nas', en: '/about' },
    '/kontakt': { sl: '/kontakt', en: '/contact' },
    '/pogoji-poslovanja': { sl: '/pogoji-poslovanja', en: '/terms' },
    '/politika-zasebnosti': { sl: '/politika-zasebnosti', en: '/privacy-policy' },
  },
});

export type AppLocale = (typeof routing.locales)[number];
