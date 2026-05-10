import type { Metadata } from 'next';
import Image from 'next/image';
import { VintageImage } from '@/components/shared/VintageImage';
import { Polaroid } from '@/components/shared/Polaroid';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const menu = messages.menu;

export const metadata: Metadata = {
  title: 'Meni',
  description: 'Tradicionalne slovenske jedi pripravljene z ljubeznijo. Pregled našega menija.',
};

function MenuItem({ name, price }: { name: string; price: string }) {
  return (
    <div className="flex items-baseline gap-3 py-2 border-b border-sand/50 last:border-0">
      <span className="font-display italic text-lg text-coffee">{name}</span>
      <span className="flex-1 border-b border-dotted border-sand mb-1" />
      <span className="font-body text-honey font-medium text-sm shrink-0">{price}</span>
    </div>
  );
}

type CategoryWithAccent = {
  name: string;
  items: { name: string; price: string }[];
  accent?: boolean;
  note?: string;
};

export default function MeniPage() {
  return (
    <>
      {/* Hero strip */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/mayr-hero-meni.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-coffee/60" />
        </div>
        <div className="relative z-10 text-center py-20 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {menu.hero.eyebrow}
          </p>
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide">
            {menu.hero.title}
          </h1>
          <p className="font-body text-cream/70 text-sm mt-4 max-w-lg mx-auto">
            {menu.hero.lead}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        {/* Intro paragraph */}
        <FadeIn>
          <p className="font-body text-walnut leading-relaxed text-center mb-16">
            {menu.intro}
          </p>
        </FadeIn>

        {/* Menu categories */}
        <div className="relative">
          {/* Floating polaroid — desktop aside */}
          <div className="hidden xl:block absolute -right-48 top-96 w-44">
            <Polaroid caption="Kuhinja, 1962" rotation={3}>
              <VintageImage label="kuhinja 1962" aspect="square" />
            </Polaroid>
          </div>

          {(menu.categories as CategoryWithAccent[]).map((category, idx) => (
            <FadeIn key={category.name} delay={idx * 0.05} className="mb-12">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-1">
                  <p
                    className={`font-display uppercase tracking-[0.3em] text-sm ${
                      category.accent ? 'text-terracotta' : 'text-bronze'
                    }`}
                  >
                    {category.name}
                  </p>
                  {category.note && (
                    <span className="font-body text-xs text-walnut/60 italic">
                      — {category.note}
                    </span>
                  )}
                </div>
                <div className="h-px bg-sand w-full" />
              </div>

              {category.items.length > 0 ? (
                <div>
                  {category.items.map((item) => (
                    <MenuItem key={item.name} name={item.name} price={item.price} />
                  ))}
                </div>
              ) : (
                category.note && (
                  <p className="font-body text-walnut/70 text-sm italic">{category.note}</p>
                )
              )}

              {idx < menu.categories.length - 1 && <SectionDivider className="mt-8" />}
            </FadeIn>
          ))}
        </div>

        {/* Bottom CTA */}
        <FadeIn className="mt-16 text-center">
          <ReservationButtons variant="table" />
        </FadeIn>
      </div>
    </>
  );
}
