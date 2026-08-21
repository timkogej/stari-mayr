import type sl from './messages/sl.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof import('./src/i18n/routing'))['routing']['locales'][number];
    Messages: typeof sl;
  }
}
