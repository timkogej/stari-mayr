import type { Metadata } from 'next';
import Image from 'next/image';
import { Wifi, Coffee, Bath, Car, Bed, BadgeCheck, Clock } from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';
import type { ReactNode } from 'react';

const messages = getMessages();
const rooms = messages.rooms;

export const metadata: Metadata = {
  title: 'Sobe',
  description: 'Pet sob v zgodovinski stavbi v starem mestnem jedru Kranja. Zajtrk vključen, lastna kopalnica, brezžični internet.',
};

const amenityIcons: Record<string, ReactNode> = {
  'WiFi': <Wifi className="w-4 h-4" />,
  'Zajtrk vključen': <Coffee className="w-4 h-4" />,
  'Lastna kopalnica': <Bath className="w-4 h-4" />,
  'Parkirišče v bližini': <Car className="w-4 h-4" />,
  'Zakonska postelja': <Bed className="w-4 h-4" />,
  'Enojna postelja': <Bed className="w-4 h-4" />,
  'Dve postelji': <Bed className="w-4 h-4" />,
};

const includedIcons: Record<string, ReactNode> = {
  'Zajtrk': <Coffee className="w-4 h-4 text-bronze" />,
  'Brezžični internet': <Wifi className="w-4 h-4 text-bronze" />,
  'DDV': <BadgeCheck className="w-4 h-4 text-bronze" />,
  'Posteljnina in brisače': <Bath className="w-4 h-4 text-bronze" />,
  'Parkirišče v bližini': <Car className="w-4 h-4 text-bronze" />,
  'Jutranja kava': <Clock className="w-4 h-4 text-bronze" />,
};

const roomImages = [
  '/images/mayr-soba-1.jpg',
  '/images/mayr-soba-2.jpg',
  '/images/mayr-soba-3.jpg',
  '/images/mayr-soba-4.jpg',
  '/images/mayr-soba-5.jpg',
];

export default function SobePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-coffee">
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/mayr-sobe-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
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
          <p className="font-body text-walnut text-center max-w-xl mx-auto mb-16 leading-relaxed">
            {rooms.intro}
          </p>
        </FadeIn>

        {/* Room cards: zigzag */}
        <div className="space-y-24">
          {rooms.items.map((room, i) => (
            <FadeIn key={room.id}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3] border border-sand/80 bg-coffee/5">
                  <Image
                    src={roomImages[i] || '/images/mayr-soba-1.jpg'}
                    alt={room.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Text */}
                <div>
                  <p className="font-display uppercase tracking-[0.3em] text-xs text-bronze mb-2">
                    {room.eyebrow}
                  </p>
                  <h2 className="font-display italic text-3xl md:text-4xl text-coffee tracking-wide mb-1">
                    {room.name}
                  </h2>
                  <p className="font-body text-walnut/60 text-xs uppercase tracking-widest mb-4">
                    {room.type}
                  </p>
                  <p className="font-body text-walnut leading-relaxed mb-6">
                    {room.description}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {room.amenities.map((amenity) => (
                      <div key={amenity} className="flex items-center gap-1.5 text-xs font-body text-walnut bg-parchment px-3 py-1.5 border border-sand">
                        {amenityIcons[amenity] || <Bed className="w-4 h-4" />}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                  <p className="font-display italic text-xl text-honey mb-6">{room.price}</p>
                  <ReservationButtons />
                </div>
              </div>

              {i < rooms.items.length - 1 && <SectionDivider className="mt-24" />}
            </FadeIn>
          ))}
        </div>

        {/* Included section */}
        <FadeIn className="mt-24">
          <SectionDivider className="mb-12" />
          <h2 className="font-display text-2xl md:text-3xl text-bronze text-center tracking-wide mb-8">
            {rooms.included.title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {rooms.included.items.map((item) => (
              <div key={item} className="flex flex-col items-center gap-2 text-center">
                <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center">
                  {includedIcons[item] || <BadgeCheck className="w-4 h-4 text-bronze" />}
                </div>
                <span className="font-body text-xs text-walnut">{item}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Bottom CTA */}
        <FadeIn className="mt-20 text-center">
          <h3 className="font-display italic text-2xl text-coffee mb-6">{rooms.cta.title}</h3>
          <div className="flex justify-center">
            <ReservationButtons />
          </div>
        </FadeIn>
      </div>
    </>
  );
}
