import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAlternateLanguages, getLocalizedUrl } from '@/i18n/alternates';

const routes: Array<{
  pathname: keyof typeof routing.pathnames;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { pathname: '/', changeFrequency: 'monthly', priority: 1 },
  { pathname: '/sobe', changeFrequency: 'monthly', priority: 0.9 },
  { pathname: '/ponudba', changeFrequency: 'monthly', priority: 0.7 },
  { pathname: '/o-nas', changeFrequency: 'yearly', priority: 0.7 },
  { pathname: '/kontakt', changeFrequency: 'yearly', priority: 0.7 },
  { pathname: '/pogoji-poslovanja', changeFrequency: 'yearly', priority: 0.3 },
  { pathname: '/politika-zasebnosti', changeFrequency: 'yearly', priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.flatMap(({ pathname, changeFrequency, priority }) =>
    routing.locales.map((locale) => ({
      url: getLocalizedUrl(pathname, locale),
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: getAlternateLanguages(pathname),
      },
    }))
  );
}
