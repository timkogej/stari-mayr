// v1.0.1
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Italianno } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TestimonialsMarquee } from '@/components/sections/TestimonialsMarquee';

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

export const metadata: Metadata = {
  title: {
    default: 'Stari Mayr — Sobe in tradicija v starem mestnem jedru',
    template: '%s · Stari Mayr',
  },
  description: 'Tradicionalna gostilna in prenočišče v starem mestnem jedru Kranja. Sobe, atrij in domača kuhinja z dušo.',
  openGraph: {
    title: 'Stari Mayr — Sobe in tradicija v starem mestnem jedru',
    description: 'Tradicionalna gostilna in prenočišče v starem mestnem jedru Kranja. Sobe, atrij in domača kuhinja z dušo.',
    locale: 'sl_SI',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className={`${fontDisplay.variable} ${fontBody.variable} ${fontScript.variable} font-body antialiased`}>
        <Header />
        <main>{children}</main>
        <TestimonialsMarquee />
        <Footer />
      </body>
    </html>
  );
}
