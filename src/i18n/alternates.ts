import { routing, type AppLocale } from './routing';
import { getPathname } from './navigation';

const BASE_URL = 'https://stari-mayr.si';

type CanonicalPathname = keyof typeof routing.pathnames;

export function getAlternateLanguages(pathname: CanonicalPathname) {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = BASE_URL + getPathname({ href: pathname, locale });
  }
  languages['x-default'] = BASE_URL + getPathname({ href: pathname, locale: routing.defaultLocale });

  return languages;
}

export function getLocalizedUrl(pathname: CanonicalPathname, locale: AppLocale) {
  return BASE_URL + getPathname({ href: pathname, locale });
}
