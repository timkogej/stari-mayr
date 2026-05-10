import { Hero } from '@/components/sections/Hero';
import { HomeIntro } from '@/components/sections/HomeIntro';
import { HomeMenuPreview } from '@/components/sections/HomeMenuPreview';
import { HomeGalleryPreview } from '@/components/sections/HomeGalleryPreview';
import { HomeRoomsTeaser } from '@/components/sections/HomeRoomsTeaser';
import { HomeContactCTA } from '@/components/sections/HomeContactCTA';
import { SectionDivider } from '@/components/shared/SectionDivider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Domov',
  description: 'Dobrodošli v Stari Mayr — tradicionalni gostilni z več kot stoletno tradicijo v starem mestnem jedru Kranja.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionDivider className="mt-0" />
      <HomeIntro />
      <SectionDivider />
      <HomeMenuPreview />
      <SectionDivider />
      <HomeGalleryPreview />
      <SectionDivider />
      <HomeRoomsTeaser />
      <HomeContactCTA />
    </>
  );
}
