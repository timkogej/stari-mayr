import type { Metadata } from 'next';
import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const about = messages.about;

export const metadata: Metadata = {
  title: 'O nas',
  description: 'Zgodba hiše Stari Mayr v starem mestnem jedru Kranja — več kot stoletje gostoljubja.',
};

export default function ONasPage() {
  return (
    <>
      {/* Hero with image */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-coffee">
        <div className="absolute inset-0">
          <Image
            src="/images/mayr-o-nas-hero-2.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-coffee/50" />
        </div>
        <div className="relative z-10 text-center py-24 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {about.hero.eyebrow}
          </p>
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide mb-4">
            {about.hero.title}
          </h1>
          <p className="font-body text-cream/70 text-sm max-w-lg mx-auto">
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

      {/* Full-width image break */}
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src="/images/mayr-terasa.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
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
              »{about.quote}«
            </p>
          </blockquote>
        </FadeIn>
      </div>
    </>
  );
}
