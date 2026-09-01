// v1.0.1
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Italianno } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/shared/CookieConsent';
import { Analytics } from '@/components/shared/Analytics';
import { routing } from '@/i18n/routing';

const fontDisplay = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const fontBody = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

const fontScript = Italianno({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: requested } = await params;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'site' });

  const title = t('name') + (locale === 'sl' ? ' — ' + t('tagline') : '');
  const description = t('description');

  return {
    metadataBase: new URL('https://stari-mayr.si'),
    title: {
      default: title,
      template: '%s · Stari Mayr',
    },
    description,
    openGraph: {
      type: 'website',
      locale: locale === 'sl' ? 'sl_SI' : 'en_US',
      siteName: 'Stari Mayr',
      url: locale === 'sl' ? 'https://stari-mayr.si' : 'https://stari-mayr.si/en',
      title,
      description,
      // TODO: replace with a real photo-based OG image once hero photography is finalized.
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Stari Mayr, Kranj' }],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable} font-body antialiased`}>
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
