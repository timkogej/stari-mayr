import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://stari-mayr.si';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/meni`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/galerija`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/o-nas`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/sobe`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/kontakt`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ];
}
