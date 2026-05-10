'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { VintageImage } from '@/components/shared/VintageImage';
import { Polaroid } from '@/components/shared/Polaroid';
import { FadeIn } from '@/components/shared/FadeIn';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const gallery = messages.gallery;

type Aspect = 'square' | 'video' | 'portrait' | 'landscape' | 'hero';

type GalleryItem = typeof gallery.images[0];

function GalleryItemCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  const imageEl = item.vintage ? (
    <VintageImage label={item.label} aspect={item.aspect as Aspect} />
  ) : (
    <PlaceholderImage label={item.label} aspect={item.aspect as Aspect} />
  );

  const inner = item.polaroid ? (
    <Polaroid caption={item.caption || ''} rotation={item.rotation || 0} className="w-full">
      {item.vintage ? (
        <VintageImage label={item.label} aspect={item.aspect as Aspect} />
      ) : (
        <PlaceholderImage label={item.label} aspect={item.aspect as Aspect} />
      )}
    </Polaroid>
  ) : imageEl;

  return (
    <button
      onClick={onClick}
      className="block w-full text-left cursor-pointer mb-6 group"
      aria-label={`Odpri fotografijo: ${item.caption}`}
    >
      <div className="transform transition-transform duration-700 group-hover:scale-[1.02]">
        {inner}
      </div>
    </button>
  );
}

export function GalerijaClient() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const prev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + gallery.images.length) % gallery.images.length);
  };
  const next = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % gallery.images.length);
  };

  const current = lightboxIndex !== null ? gallery.images[lightboxIndex] : null;

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-coffee">
        <div className="absolute inset-0">
          <Image
            src="/images/mayr-galarija-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[50%_62%]"
          />
          <div className="absolute inset-0 bg-coffee/55" />
        </div>
        <div className="relative z-10 text-center py-20 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {gallery.hero.eyebrow}
          </p>
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide">
            {gallery.hero.title}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <FadeIn>
          <p className="font-body text-walnut text-center max-w-xl mx-auto mb-16 leading-relaxed">
            {gallery.intro}
          </p>
        </FadeIn>

        {/* Masonry CSS columns */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-6">
          {gallery.images.map((item, i) => (
            <FadeIn key={i} delay={i * 0.04}>
              <GalleryItemCard item={item} onClick={() => setLightboxIndex(i)} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={(o) => !o && setLightboxIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-4xl bg-coffee border-coffee p-0 overflow-hidden"
        >
          {current && (
            <div className="relative">
              <div className="max-h-[80vh] overflow-hidden">
                {current.vintage ? (
                  <VintageImage label={current.label} aspect={current.aspect as Aspect} className="w-full" />
                ) : (
                  <PlaceholderImage label={current.label} aspect={current.aspect as Aspect} className="w-full" />
                )}
              </div>
              {current.caption && (
                <div className="bg-coffee/80 text-center py-4">
                  <p className="font-script text-cream text-lg">{current.caption}</p>
                </div>
              )}
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream transition-colors"
                aria-label="Prejšnja"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream transition-colors"
                aria-label="Naslednja"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
