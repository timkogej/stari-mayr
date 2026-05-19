import Link from 'next/link';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const atrium = messages.home.atrium;

export function HomeAtriumShowcase() {
  return (
    <section className="py-20 lg:py-32 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image */}
          <FadeIn>
            <div className="border border-sand shadow-sm">
              <PlaceholderImage label={atrium.imageLabel} aspect="landscape" />
            </div>
          </FadeIn>

          {/* Right: text */}
          <FadeIn delay={0.2}>
            <SectionHeading
              eyebrow={atrium.eyebrow}
              title={atrium.title}
            />
            <p className="font-body text-walnut leading-relaxed mt-6 mb-6">
              {atrium.body}
            </p>
            <Link
              href="/ponudba"
              className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
            >
              {atrium.link} →
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
