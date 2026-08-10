// TODO: Zamenjaj placeholderje s pravimi mnenji z Booking.com profila.
// Ne izmišljuj mnenj — objava neresničnih mnenj gostov je v EU prepovedana
// (Direktiva 2005/29/ES, dopolnjena z Omnibus direktivo 2019/2161).
import { FadeIn } from '@/components/shared/FadeIn';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const testimonials = messages.testimonials;

export function Testimonials() {
  const items = testimonials.items.filter((item) => !item.quote.startsWith('TODO'));

  if (items.length === 0) return null;

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-16 text-center">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-bronze mb-3">
            {testimonials.eyebrow}
          </p>
          <h2 className="font-display italic text-3xl md:text-4xl text-coffee">
            {testimonials.heading}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <FadeIn key={`${item.author}-${i}`} delay={i * 0.08}>
              <blockquote>
                <p className="font-display italic text-lg text-coffee leading-relaxed mb-6">
                  “{item.quote}”
                </p>
                <div className="border-t border-sand pt-4">
                  <p className="font-body text-xs uppercase tracking-widest text-walnut">
                    {item.author} — {item.country}
                  </p>
                </div>
              </blockquote>
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-12 text-center">
          <p className="font-body text-xs text-walnut/70">{testimonials.source_note}</p>
        </FadeIn>
      </div>
    </section>
  );
}
