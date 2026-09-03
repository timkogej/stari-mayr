import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import Image from 'next/image';
import heroImage from '../../../../public/images/mayr-ponudba-hero.jpeg';
import { getMessages, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getAlternateLanguages } from '@/i18n/alternates';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ponudba' });

  return {
    title: t('hero.title'),
    description:
      locale === 'sl'
        ? 'Stavba, sobe, zajtrk in atrij — odkrijte ponudbo Stari Mayr v Kranju.'
        : 'Rooms, breakfast and a courtyard at Stari Mayr in Kranj — discover what awaits you.',
    alternates: {
      languages: getAlternateLanguages('/ponudba'),
    },
  };
}

export default async function PonudbaPage() {
  const messages = await getMessages();
  const ponudba = messages.ponudba;

  return (
    <>
      {/* Hero strip */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-coffee">
        <Image
          src={heroImage}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-coffee/40" />
        <div className="relative z-10 text-center py-24 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {ponudba.hero.eyebrow}
          </p>
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide mb-4">
            {ponudba.hero.title}
          </h1>
          <p className="font-body text-cream/70 text-sm max-w-lg mx-auto">
            {ponudba.hero.lead}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        {/* Section 1: Pod isto streho */}
        <FadeIn className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-coffee tracking-wide mb-6">
            {ponudba.roof.title}
          </h2>
          <p className="font-body text-walnut leading-relaxed">
            {ponudba.roof.body}
          </p>
        </FadeIn>

        <SectionDivider className="mb-16" />

        {/* Section 2: Full-width image break */}
        <FadeIn className="mb-16">
          <div className="home-heritage-frame relative overflow-hidden aspect-video border border-sand shadow-sm">
            <Image
              src="/images/stari-mayr-predprostor-4.jpg"
              alt={ponudba.roof.imageLabel}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="home-heritage-image home-heritage-image--atrium object-cover object-center"
            />
          </div>
        </FadeIn>

        <SectionDivider className="mb-16" />

        {/* Section 3: Zajtrk */}
        <FadeIn className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-coffee tracking-wide mb-6">
            {ponudba.zajtrk.title}
          </h2>
          <p className="font-body text-walnut leading-relaxed">
            {ponudba.zajtrk.body}
          </p>
        </FadeIn>

        <SectionDivider className="mb-16" />

        {/* Section 4: Atrij */}
        <FadeIn className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-coffee tracking-wide mb-6">
                {ponudba.atrij.title}
              </h2>
              <p className="font-body text-walnut leading-relaxed">
                {ponudba.atrij.body}
              </p>
            </div>
            <div className="relative overflow-hidden aspect-[4/3] border border-sand shadow-sm">
              <Image
                src="/images/mayr-domov-atrij.jpeg"
                alt={messages.home.atrium.imageLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </FadeIn>

        <SectionDivider className="mb-16" />

        {/* Section 5: Kranj */}
        <FadeIn className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-coffee tracking-wide mb-6">
            {ponudba.kranj.title}
          </h2>
          <p className="font-body text-walnut leading-relaxed">
            {ponudba.kranj.body}
          </p>
        </FadeIn>

        <SectionDivider className="mb-16" />

        {/* Section 6: Closing */}
        <FadeIn className="mb-16">
          <h2 className="font-display text-3xl md:text-4xl text-coffee tracking-wide mb-6">
            {ponudba.closing.title}
          </h2>
          <p className="font-body text-walnut leading-relaxed mb-4">
            {ponudba.closing.body}
          </p>
          <Link
            href="/sobe"
            className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
          >
            {ponudba.closing.link} →
          </Link>
        </FadeIn>

        {/* Bottom CTA */}
        <FadeIn className="flex justify-center">
          <ReservationButtons />
        </FadeIn>
      </div>
    </>
  );
}
