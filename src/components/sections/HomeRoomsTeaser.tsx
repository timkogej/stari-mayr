import Link from 'next/link';
import Image from 'next/image';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const rooms = messages.home.rooms;

export function HomeRoomsTeaser() {
  return (
    <section className="py-20 lg:py-32 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: image */}
          <FadeIn>
            <div className="relative w-full aspect-[4/3] overflow-hidden border border-sand/80">
              <Image
                src="/images/mayr-soba-5.jpg"
                alt={rooms.imageLabel}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          {/* Right: text */}
          <FadeIn delay={0.2}>
            <SectionHeading
              eyebrow={rooms.eyebrow}
              title={rooms.title}
            />
            <p className="font-body text-walnut leading-relaxed mt-6 mb-8">
              {rooms.body}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <ReservationButtons variant="room" context="light" />
              <Link
                href="/sobe"
                className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
              >
                {rooms.link} →
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
