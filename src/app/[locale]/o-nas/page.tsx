import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import Image from 'next/image';
import { getMessages, getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { getAlternateLanguages } from '@/i18n/alternates';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('hero.title'),
    description: t('hero.lead'),
    alternates: {
      languages: getAlternateLanguages('/o-nas'),
    },
  };
}

export default async function ONasPage() {
  const messages = await getMessages();
  const about = messages.about;

  return (
    <>
      {/* Hero with image */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-coffee">
        <div className="absolute inset-0">
          <Image
            src="/images/stari-mayr-o-nas-hero-3.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[58%_50%] md:object-center"
          />
          <div className="absolute inset-0 bg-coffee/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-coffee/35 via-coffee/25 to-coffee/65" />
        </div>
        <div className="relative z-10 text-center py-24 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {about.hero.eyebrow}
          </p>
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide mb-4 drop-shadow-sm">
            {about.hero.title}
          </h1>
          <p className="font-body text-cream/80 text-sm max-w-lg mx-auto drop-shadow-sm">
            {about.hero.lead}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        {/* Section 1: Začetki */}
        <FadeIn>
          <h2 className="font-display text-3xl md:text-4xl text-bronze tracking-wide mb-6">
            {about.section1.title}
          </h2>
          <p className="font-body text-walnut leading-relaxed">
            {about.section1.body}
          </p>
        </FadeIn>
      </div>

      {/* Image break */}
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <div className="home-heritage-frame relative overflow-hidden aspect-video border border-sand shadow-sm">
            <Image
              src="/images/stari-mayr-atrij-3.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="home-heritage-image home-heritage-image--atrium object-cover object-center"
            />
          </div>
        </FadeIn>
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        {/* TODO: zamenjaj z avtentično zgodovino hiše, ko jo pošlje lastnik */}
        {/* Section 3: Skozi generacije */}
        <FadeIn>
          <h2 className="font-display text-3xl md:text-4xl text-bronze tracking-wide mb-6">
            {about.section3.title}
          </h2>
          <p className="font-body text-walnut leading-relaxed">
            {about.section3.body}
          </p>
        </FadeIn>

        <SectionDivider className="my-16" />

        {/* Section 4: Danes */}
        <FadeIn>
          <h2 className="font-display text-3xl md:text-4xl text-bronze tracking-wide mb-6">
            {about.section4.title}
          </h2>
          <p className="font-body text-walnut leading-relaxed">
            {about.section4.body}
          </p>
        </FadeIn>

        {/* Pull quote */}
        <FadeIn className="mt-20">
          <blockquote className="text-center">
            <p className="font-display italic text-2xl md:text-3xl text-bronze leading-relaxed">
              {about.quote}
            </p>
          </blockquote>
        </FadeIn>
      </div>
    </>
  );
}
