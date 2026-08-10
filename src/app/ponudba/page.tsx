import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const ponudba = messages.ponudba;

export const metadata: Metadata = {
  title: 'Ponudba',
  description: 'Zajtrk, vrt, notranji atrij in prenočišče v stoletni hiši v starem mestnem jedru Kranja.',
};

export default function PonudbaPage() {
  return (
    <>
      {/* Hero strip */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-coffee">
        <Image
          src="/images/mayr-ponudba-hero.jpeg"
          alt=""
          fill
          priority
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
          <div className="relative overflow-hidden aspect-video border border-sand shadow-sm">
            <Image
              src="/images/mayr-ponudba-vibe.jpeg"
              alt={ponudba.roof.imageLabel}
              fill
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover object-[center_88%]"
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
