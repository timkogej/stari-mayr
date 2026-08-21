import type { Metadata } from 'next';
import type { AppLocale } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import { ScrollVideoHero } from '@/components/sections/ScrollVideoHero';
import { HomeIntro } from '@/components/sections/HomeIntro';
import { HomeRoomsPreview } from '@/components/sections/HomeRoomsPreview';
import { HomeAtriumShowcase } from '@/components/sections/HomeAtriumShowcase';
import { HomeContactCTA } from '@/components/sections/HomeContactCTA';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { StructuredData } from '@/components/shared/StructuredData';
import { getAlternateLanguages } from '@/i18n/alternates';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    description: t('description'),
    alternates: {
      languages: getAlternateLanguages('/'),
    },
  };
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <ScrollVideoHero />
      <SectionDivider className="mt-0" />
      <HomeIntro />
      <SectionDivider />
      <HomeRoomsPreview />
      <SectionDivider />
      <HomeAtriumShowcase />
      <HomeContactCTA />
    </>
  );
}
