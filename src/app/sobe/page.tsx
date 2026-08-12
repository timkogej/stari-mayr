import type { Metadata } from 'next';
import Image from 'next/image';
import { Bath, Wifi } from 'lucide-react';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { BookingRating } from '@/components/shared/BookingRating';
import { Testimonials } from '@/components/sections/Testimonials';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const rooms = messages.rooms;

export const metadata: Metadata = {
  title: 'Sobe',
  description:
    'Osem sob v prvem in drugem nadstropju stoletne hiše v središču Kranja, z lastno kopalnico in brezplačnim WiFi.',
};

const roomAmenities = [
  { icon: Bath, label: 'Lastna kopalnica' },
  { icon: Wifi, label: 'Brezplačen WiFi' },
];

const roomTypeImages: Record<string, string> = {
  dvoposteljna: '/images/mayr-sobe-dvoposteljna.jpeg',
  troposteljna: '/images/mayr-sobe-troposteljna.jpeg',
  stiriposteljna: '/images/mayr-sobe-stiriposteljna.jpeg',
};

const roomImageFilters: Record<string, string> = {
  dvoposteljna: 'room-heritage-image--double',
  troposteljna: 'room-heritage-image--triple',
  stiriposteljna: 'room-heritage-image--family',
};

export default function SobePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-coffee">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/mayr-sobe-hero-closeup.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_65%]"
          />
        </div>
        <div className="relative z-10 text-center py-24 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {rooms.hero.eyebrow}
          </p>
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide mb-4">
            {rooms.hero.title}
          </h1>
          <p className="font-body text-cream/70 text-sm max-w-lg mx-auto">
            {rooms.hero.lead}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <FadeIn>
          <p className="font-body text-walnut text-center max-w-xl mx-auto mb-10 leading-relaxed">
            {rooms.intro}
          </p>
        </FadeIn>

        <FadeIn className="flex justify-center mb-16">
          <BookingRating />
        </FadeIn>

        {/* Room type cards: zigzag */}
        <div className="space-y-24">
          {rooms.types.map((room, i) => (
            <FadeIn key={room.id}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                {/* Image */}
                {roomTypeImages[room.id] ? (
                  <div className="room-heritage-frame relative overflow-hidden aspect-[4/3] border border-sand shadow-sm">
                    <Image
                      src={roomTypeImages[room.id]}
                      alt={room.imageLabel}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className={`room-heritage-image ${roomImageFilters[room.id] ?? ''} object-cover`}
                    />
                  </div>
                ) : (
                  <PlaceholderImage label={room.imageLabel} aspect="landscape" />
                )}

                {/* Text */}
                <div>
                  <p className="font-display uppercase tracking-[0.3em] text-xs text-bronze mb-2">
                    {room.eyebrow}
                  </p>
                  <h2 className="font-display italic text-3xl md:text-4xl text-coffee tracking-wide mb-1">
                    {room.name}
                  </h2>
                  <p className="font-body text-walnut/60 text-xs uppercase tracking-widest mb-4">
                    {room.count}
                  </p>
                  <p className="font-body text-walnut leading-relaxed mb-6">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-4 mb-8">
                    {roomAmenities.map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-xs font-body text-bronze">
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                  <ReservationButtons />
                </div>
              </div>

              {i < rooms.types.length - 1 && <SectionDivider className="mt-24" />}
            </FadeIn>
          ))}
        </div>

        {/* Included section */}
        <FadeIn className="mt-24">
          <SectionDivider className="mb-12" />
          <h2 className="font-display text-2xl md:text-3xl text-bronze text-center tracking-wide mb-12">
            {rooms.amenities.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {rooms.amenities.groups.map((group) => (
              <div key={group.heading}>
                <h3 className="font-display uppercase tracking-[0.25em] text-xs text-bronze mb-4">
                  {group.heading}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-body text-sm text-walnut leading-relaxed">
                      <span className="text-honey mt-0.5">◆</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Air conditioning note */}
          <div className="max-w-3xl mx-auto mt-12 bg-sand/40 border-l-2 border-bronze px-5 py-4 text-sm text-walnut">
            <p className="font-body">{rooms.airConditioningNote}</p>
          </div>

          {/* Accessibility note */}
          <div className="max-w-3xl mx-auto mt-4 bg-sand/40 border-l-2 border-bronze px-5 py-4">
            <p className="font-body text-sm text-walnut">{rooms.accessibilityNote}</p>
          </div>
        </FadeIn>

        <Testimonials />

        {/* V bližini */}
        <FadeIn className="mt-8">
          <SectionDivider className="mb-12" />
          <h2 className="font-display text-2xl md:text-3xl text-bronze text-center tracking-wide mb-8">
            {rooms.nearby.title}
          </h2>
          <div className="max-w-xl mx-auto space-y-0">
            {rooms.nearby.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between border-b border-sand py-3">
                <span className="font-body text-sm text-walnut">{item.label}</span>
                <span className="font-body text-sm text-honey">{item.distance}</span>
              </div>
            ))}
          </div>
          <p className="font-body text-xs text-walnut/70 text-center mt-4">{rooms.nearby.note}</p>
        </FadeIn>

        {/* Bottom CTA */}
        <FadeIn className="mt-20 text-center">
          <h3 className="font-display italic text-2xl text-coffee mb-4">{rooms.cta.title}</h3>
          <p className="font-body text-sm text-walnut mb-6">{rooms.cta.lead}</p>
          {/* TODO: dodaj prave cene ko bodo znane */}
          <p className="font-display italic text-lg text-honey mb-6">{rooms.priceNote}</p>
          <div className="flex justify-center">
            <ReservationButtons />
          </div>
        </FadeIn>
      </div>
    </>
  );
}
