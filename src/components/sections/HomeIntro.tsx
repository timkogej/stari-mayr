import Link from 'next/link';
import Image from 'next/image';
import { VintageImage } from '@/components/shared/VintageImage';
import { Polaroid } from '@/components/shared/Polaroid';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const intro = messages.home.intro;

export function HomeIntro() {
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

          {/* Right: layered images */}
          <FadeIn delay={0.2} className="relative flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Background modern image */}
              <div className="relative ml-20 aspect-[3/4] overflow-hidden border border-sand/80">
                <Image
                  src="/images/mayr-home-2.jpg"
                  alt="Stari Mayr - Naša zgodba"
                  fill
                  sizes="(max-width: 1024px) 80vw, 28rem"
                  className="object-cover object-[72%_center]"
                />
              </div>
              {/* Polaroid overlapping */}
              <div className="absolute -left-4 bottom-16 z-10 w-48">
                <Polaroid caption="Atrij, 1987" rotation={-3}>
                  <VintageImage label="atrij 1987" aspect="square" />
                </Polaroid>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
