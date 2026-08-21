import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import { getMessages, getTranslations } from 'next-intl/server';
import { LegalDocument } from '@/components/sections/LegalDocument';
import { getAlternateLanguages } from '@/i18n/alternates';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy_policy' });

  return {
    title: t('title'),
    alternates: {
      languages: getAlternateLanguages('/politika-zasebnosti'),
    },
  };
}

export default async function PolitikaZasebnostiPage() {
  const messages = await getMessages();
  const privacyPolicy = messages.privacy_policy as {
    eyebrow: string;
    title: string;
    subtitle: string;
    coming_soon: string;
  };

  const email = 'mayr.doo@siol.net';
  const [before, after] = privacyPolicy.coming_soon.split(email);

  return (
    <LegalDocument eyebrow={privacyPolicy.eyebrow} title={privacyPolicy.title} subtitle={privacyPolicy.subtitle}>
      {/* TODO: replace with real Privacy Policy content once the owner provides it — likely a similarly-structured v8 update */}
      <p className="font-body text-sm md:text-base text-walnut leading-relaxed text-center">
        {before}
        <a href={`mailto:${email}`} className="text-bronze hover:underline">
          {email}
        </a>
        {after}
      </p>
    </LegalDocument>
  );
}
