import Link from 'next/link';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { VintageImage } from '@/components/shared/VintageImage';
import { Polaroid } from '@/components/shared/Polaroid';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const gallery = messages.home.gallery;

export function HomeGalleryPreview() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12">
          <SectionHeading
            eyebrow={gallery.eyebrow}
            title={gallery.title}
            align="center"
          />
        </FadeIn>

        {/* Balanced preview layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <FadeIn delay={0}>
            <Polaroid caption="Jedilnica, 1971" rotation={-2} className="w-full">
              <VintageImage label="jedilnica 1971" aspect="portrait" />
            </Polaroid>
          </FadeIn>
          <FadeIn delay={0.08}>
            <PlaceholderImage label="galerija — atrij danes" aspect="landscape" />
          </FadeIn>
          <FadeIn delay={0.16}>
            <VintageImage label="galerija — vhod 1965" aspect="landscape" />
          </FadeIn>
          <FadeIn delay={0.24}>
            <PlaceholderImage label="galerija — jedi" aspect="square" />
          </FadeIn>
          <FadeIn className="col-span-1" delay={0.32}>
            <Polaroid caption="Atrij, 1987" rotation={2} className="w-full">
              <VintageImage label="atrij 1987" aspect="square" />
            </Polaroid>
          </FadeIn>
          <FadeIn delay={0.4}>
            <PlaceholderImage label="galerija — letni vrt" aspect="square" />
          </FadeIn>
        </div>

        <FadeIn className="mt-12 text-center">
          <Link
            href="/galerija"
            className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
          >
            {gallery.link} →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
