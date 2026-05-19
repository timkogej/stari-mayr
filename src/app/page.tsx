import { Hero } from '@/components/sections/Hero';
import { HomeIntro } from '@/components/sections/HomeIntro';
import { HomeRoomsPreview } from '@/components/sections/HomeRoomsPreview';
import { HomeGalleryPreview } from '@/components/sections/HomeGalleryPreview';
import { HomeAtriumShowcase } from '@/components/sections/HomeAtriumShowcase';
import { HomeContactCTA } from '@/components/sections/HomeContactCTA';
import { SectionDivider } from '@/components/shared/SectionDivider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Domov',
  description: 'Dobrodošli v Stari Mayr — sobe in tradicija v starem mestnem jedru Kranja.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionDivider className="mt-0" />
      <HomeIntro />
      <SectionDivider />
      <HomeRoomsPreview />
      <SectionDivider />
      <HomeGalleryPreview />
      <SectionDivider />
      <HomeAtriumShowcase />
      <HomeContactCTA />
    </>
  );
}
