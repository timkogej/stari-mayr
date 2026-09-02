import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import { getMessages, getTranslations } from 'next-intl/server';
import { LegalDocument } from '@/components/sections/LegalDocument';
import { Link } from '@/i18n/navigation';
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
  const t = await getTranslations({ locale, namespace: 'terms' });

  return {
    title: t('title'),
    description:
      locale === 'sl'
        ? 'Pogoji poslovanja za neposredne rezervacije nastanitve Guesthouse Stari Mayr v Kranju.'
        : 'Terms and conditions for direct reservations at Guesthouse Stari Mayr in Kranj.',
    alternates: {
      languages: getAlternateLanguages('/pogoji-poslovanja'),
    },
  };
}

export default async function PogojiPoslovanjaPage() {
  const messages = await getMessages();
  const terms = messages.terms as {
    eyebrow: string;
    title: string;
    subtitle: string;
    sections: LegalSectionData[];
  };

  const sections = terms.sections.map((section) => {
    if (section.number === '13' || section.number === '15') {
      return {
        ...section,
        body: section.body.map((paragraph) => linkifyEmail(paragraph)),
      };
    }
    if (section.number === '14') {
      return {
        ...section,
        body: section.body.map((paragraph, i) =>
          i === 1 ? linkifyPrivacyPolicy(paragraph) : paragraph
        ),
      };
    }
    return section;
  });

  return (
    <LegalDocument eyebrow={terms.eyebrow} title={terms.title} subtitle={terms.subtitle} sections={sections} />
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

function linkifyPrivacyPolicy(text: string) {
  const markers = [
    'Politiki zasebnosti, objavljeni na naši spletni strani',
    'Privacy Policy available on our website',
  ];
  const marker = markers.find((m) => text.includes(m));
  if (!marker) return text;
  const [before, after] = text.split(marker);
  return (
    <>
      {before}
      <Link href="/politika-zasebnosti" className="text-bronze hover:underline">
        {marker}
      </Link>
      {after}
    </>
  );
}
