import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const preview = messages.home.rooms_preview;

const roomCardImages = [
  '/images/mayr-sobe-dvoposteljna.jpeg',
  '/images/mayr-sobe-troposteljna.jpeg',
  '/images/mayr-sobe-stiriposteljna.jpeg',
];

const roomCardFilters = [
  'room-heritage-image--double',
  'room-heritage-image--triple',
  'room-heritage-image--family',
];

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
              <div className="room-heritage-frame group relative aspect-[3/4] overflow-hidden border border-sand shadow-sm">
                <Image
                  src={roomCardImages[i]}
                  alt={card.imageLabel}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={`room-heritage-image ${roomCardFilters[i] ?? ''} object-cover`}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(44,31,23,0.92) 0%, rgba(44,31,23,0.55) 32%, rgba(44,31,23,0.05) 60%, transparent 75%)',
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-display uppercase tracking-widest text-honey text-xs mb-1">
                    {card.eyebrow}
                  </p>
                  <h3 className="font-display italic text-2xl text-cream mb-2">
                    {card.name}
                  </h3>
                  <p
                    className="font-body text-sm text-cream/85 leading-relaxed max-h-0 opacity-0
                    -translate-y-1 overflow-hidden transition-all duration-500 ease-out
                    group-hover:max-h-32 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    {card.description}
                  </p>
                </div>
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
