import Link from 'next/link';
import { PlaceholderImage } from '@/components/shared/PlaceholderImage';
import { FadeIn } from '@/components/shared/FadeIn';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const dishes = messages.home.dishes;

export function HomeMenuPreview() {
  return (
    <section className="py-20 lg:py-32 bg-parchment">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12">
          <SectionHeading
            eyebrow={dishes.eyebrow}
            title={dishes.title}
            lead={dishes.lead}
            align="center"
          />
        </FadeIn>

        <SectionDivider className="mb-12" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {dishes.items.map((dish, i) => (
            <FadeIn key={dish.name} delay={i * 0.08}>
              <div className="group">
                <div className="overflow-hidden mb-4">
                  <div className="transform transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                    <PlaceholderImage label={dish.imageLabel} aspect="square" />
                  </div>
                </div>
                <h3 className="font-display italic text-lg text-coffee mb-1 leading-tight">
                  {dish.name}
                </h3>
                <p className="font-body text-walnut text-xs leading-relaxed mb-2">
                  {dish.description}
                </p>
                <p className="font-body text-honey font-medium text-sm">{dish.price}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 text-center">
          <Link
            href="/meni"
            className="font-body text-sm text-bronze border-b border-bronze/40 hover:border-bronze transition-colors pb-0.5"
          >
            {dishes.menuLink} →
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
