import Link from 'next/link';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const preview = messages.home.rooms_preview;

export function HomeRoomsPreview() {
  return (
    <section className="py-20 lg:py-32 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12">
          <SectionHeading
            eyebrow={preview.eyebrow}
            title={preview.title}
            lead={preview.lead}
            align="center"
          />
        </FadeIn>

        <SectionDivider className="mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {preview.cards.map((card, i) => (
            <FadeIn key={card.name} delay={i * 0.08}>
              <div className="group">
                <div className="overflow-hidden mb-4">
                  <div className="transform transition-transform duration-500 ease-out group-hover:scale-[1.03]">
                    <PlaceholderImage label={card.imageLabel} aspect="portrait" />
                  </div>
                </div>
                <p className="font-display uppercase tracking-widest text-bronze text-xs mb-1">
                  {card.eyebrow}
                </p>
                <h3 className="font-display italic text-2xl text-coffee mb-2 transition-colors duration-500 group-hover:text-terracotta">
                  {card.name}
                </h3>
                <p className="font-body text-sm text-walnut leading-relaxed">
                  {card.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 flex flex-col items-center gap-4">
          <Link
            href="/sobe"
            className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
          >
            {preview.link} →
          </Link>
          <ReservationButtons />
        </FadeIn>
      </div>
    </section>
  );
}
