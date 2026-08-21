import Image from 'next/image';
import { getMessages } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';

export async function HomeIntro() {
  const messages = await getMessages();
  const intro = messages.home.intro;

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <FadeIn>
            <SectionHeading
              eyebrow={intro.eyebrow}
              title={intro.title}
            />
            <p className="font-body text-walnut leading-relaxed mt-6 mb-8">
              {intro.body}
            </p>
            <Link
              href="/o-nas"
              className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
            >
              {intro.link} →
            </Link>
          </FadeIn>

          {/* Right: image */}
          <FadeIn delay={0.2}>
            <div className="home-heritage-frame relative overflow-hidden aspect-[5/4] border border-sand shadow-sm">
              <Image
                src="/images/mayr-domov-nasa-zgodba.jpeg"
                alt="Stari Mayr - naša zgodba"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="home-heritage-image home-heritage-image--story object-cover"
              />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
