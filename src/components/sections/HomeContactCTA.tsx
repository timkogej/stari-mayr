import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { FadeIn } from '@/components/shared/FadeIn';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const contact = messages.home.contact;

export function HomeContactCTA() {
  return (
    <section className="bg-walnut text-cream py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="text-center max-w-xl mx-auto">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {contact.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-5xl text-cream tracking-wide mb-6">
            {contact.title}
          </h2>
          <p className="font-body text-cream/70 mb-8 leading-relaxed">
            {contact.body}
          </p>
          <div className="space-y-2 font-body text-sm text-cream/60 mb-10">
            <p>{contact.address}</p>
            <p>{contact.phone}</p>
            <p>{contact.email}</p>
          </div>
          <div className="flex justify-center">
            <ReservationButtons />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
