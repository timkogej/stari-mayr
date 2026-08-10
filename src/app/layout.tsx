// v1.0.1
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Italianno } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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

const defaultTitle = 'Stari Mayr — Prenočišče v starem mestnem jedru Kranja';
const defaultDescription =
  'Deset klimatiziranih sob v stoletni hiši v središču Kranja. Brezplačen WiFi, zajtrk, vrt in notranji atrij. 8 km od letališča, 30 km od Bleda.';

export const metadata: Metadata = {
  title: {
    default: defaultTitle,
    template: '%s · Stari Mayr',
  },
  description: defaultDescription,
  openGraph: {
    type: 'website',
    locale: 'sl_SI',
    siteName: 'Stari Mayr',
    url: 'https://stari-mayr.si',
    title: defaultTitle,
    description: defaultDescription,
    // TODO: dodaj /public/og-image.jpg (1200x630)
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Stari Mayr, Kranj' }],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable} font-body antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
