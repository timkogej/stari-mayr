import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Share2 } from 'lucide-react';
import { FadeIn } from '@/components/shared/FadeIn';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { ContactForm } from './ContactForm';
import { getMessages } from '@/lib/content';

const messages = getMessages();
const contact = messages.contact;

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Obiščite gostilno Stari Mayr v starem mestnem jedru Kranja. Naslov, telefon, e-pošta in delovni čas.',
};

export default function KontaktPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-coffee flex items-center justify-center min-h-[35vh]">
        <div className="text-center py-20 px-6">
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide">
            {contact.hero.title}
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Contact info */}
          <FadeIn>
            <div className="bg-parchment border border-sand p-8 md:p-10 h-full">
              <h2 className="font-display text-2xl text-bronze tracking-wide mb-8">
                Informacije
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="w-4 h-4 text-honey mt-1 shrink-0" />
                  <div>
                    <p className="font-body text-coffee text-sm">{contact.address}</p>
                    <p className="font-body text-walnut/60 text-xs">{contact.addressNote}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-4 h-4 text-honey shrink-0" />
                  <p className="font-body text-coffee text-sm">{contact.phone}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-4 h-4 text-honey shrink-0" />
                  <a href={`mailto:${contact.email}`} className="font-body text-coffee text-sm hover:text-bronze transition-colors">
                    {contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="w-4 h-4 text-honey shrink-0" />
                  <p className="font-body text-coffee text-sm">{messages.footer.hours}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Share2 className="w-4 h-4 text-honey shrink-0" />
                  <a
                    href="https://www.facebook.com/search/top?q=gostilna%20stari%20mayr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-coffee text-sm hover:text-bronze transition-colors"
                  >
                    {messages.footer.facebookLabel}
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Right: Map */}
          <FadeIn delay={0.2}>
            <iframe
              src="https://www.google.com/maps?q=Glavni+trg+16,+4000+Kranj&output=embed"
              width="100%"
              height="400"
              style={{
                border: 0,
                filter: 'grayscale(0.2) contrast(0.95)',
                display: 'block',
              }}
              className="rounded border border-sand"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokacija Stari Mayr, Glavni trg 16, Kranj"
            />
          </FadeIn>
        </div>

        {/* Reservation buttons */}
        <FadeIn className="flex justify-center mb-20">
          <ReservationButtons />
        </FadeIn>

        {/* Contact form */}
        <FadeIn>
          <ContactForm />
        </FadeIn>
      </div>
    </>
  );
}
