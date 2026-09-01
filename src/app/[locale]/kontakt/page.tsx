import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import Image from 'next/image';
import { MapPin, Phone, Mail, Share2 } from 'lucide-react';
import { getMessages, getTranslations } from 'next-intl/server';
import { FadeIn } from '@/components/shared/FadeIn';
import { ReservationButtons } from '@/components/shared/ReservationButtons';
import { ContactForm } from './ContactForm';
import { getAlternateLanguages } from '@/i18n/alternates';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return {
    title: t('hero.title'),
    description:
      locale === 'sl'
        ? 'Kontaktirajte Guesthouse Stari Mayr v Kranju po telefonu, e-pošti ali prek spletnega obrazca.'
        : 'Contact Guesthouse Stari Mayr in Kranj by phone, email or through the website form.',
    alternates: {
      languages: getAlternateLanguages('/kontakt'),
    },
  };
}

export default async function KontaktPage() {
  const messages = await getMessages();
  const contact = messages.contact;

  return (
    <>
      {/* Hero */}
      <section className="relative bg-coffee flex items-center justify-center min-h-[50vh] overflow-hidden">
        <Image
          src="/images/stari-mayr-kontakt-hero-2.jpeg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-50"
        />
        <div className="absolute inset-0 bg-coffee/40" />
        <div className="relative z-10 text-center py-20 px-6">
          <p className="font-display uppercase tracking-[0.3em] text-xs text-honey mb-4">
            {contact.hero.eyebrow}
          </p>
          <h1 className="font-display italic text-cream text-5xl md:text-7xl tracking-wide mb-4">
            {contact.hero.title}
          </h1>
          <p className="font-body text-cream/70 text-sm max-w-lg mx-auto">
            {contact.hero.lead}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Contact info */}
          <FadeIn>
            <div className="bg-parchment border border-sand p-8 md:p-10 h-full">
              <h2 className="font-display text-2xl text-bronze tracking-wide mb-8">
                {contact.infoHeading}
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
                  <Share2 className="w-4 h-4 text-honey shrink-0" />
                  <a
                    href="https://www.facebook.com/search/top?q=stari%20mayr%20kranj"
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
              title={contact.mapTitle}
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
