import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import { getMessages, getTranslations } from 'next-intl/server';
import { LegalDocument } from '@/components/sections/LegalDocument';
import { getAlternateLanguages } from '@/i18n/alternates';

type LegalSectionData = {
  number: string;
  heading: string;
  body: string[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy_policy' });

  return {
    title: t('title'),
    description:
      locale === 'sl'
        ? 'Politika zasebnosti za spletno stran Guesthouse Stari Mayr v Kranju.'
        : 'Privacy Policy for the Guesthouse Stari Mayr website in Kranj.',
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
    intro: string[];
    sections: LegalSectionData[];
  };

  const intro = privacyPolicy.intro.map((paragraph) => linkifyEmail(paragraph));

  const sections = privacyPolicy.sections.map((section) => {
    if (section.number === '15') {
      return {
        ...section,
        body: section.body.map((paragraph) => linkifyEmail(paragraph)),
      };
    }
    return section;
  });

  return (
    <LegalDocument
      eyebrow={privacyPolicy.eyebrow}
      title={privacyPolicy.title}
      subtitle={privacyPolicy.subtitle}
      intro={intro}
      sections={sections}
    />
  );
}

function linkifyEmail(text: string) {
  const email = 'stari-mayr@t-2.net';
  if (!text.includes(email)) return text;
  const [before, after] = text.split(email);
  return (
    <>
      {renderWithBreaks(before)}
      <a href={`mailto:${email}`} className="text-bronze hover:underline">
        {email}
      </a>
      {renderWithBreaks(after)}
    </>
  );
}

function renderWithBreaks(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}
