import { getMessages } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { RoomPreviewCard } from '@/components/sections/RoomPreviewCard';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';

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

export async function HomeRoomsPreview() {
  const messages = await getMessages();
  const preview = messages.home.rooms_preview;

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
              <RoomPreviewCard
                src={roomCardImages[i]}
                filterClass={roomCardFilters[i] ?? ''}
                eyebrow={card.eyebrow}
                name={card.name}
                description={card.description}
                imageLabel={card.imageLabel}
                revealLabel={`${card.name} — ${preview.revealHint}`}
              />
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
