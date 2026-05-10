export const locales = ['sl'] as const;
export const defaultLocale = 'sl' as const;
export type Locale = (typeof locales)[number];
