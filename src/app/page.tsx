import { ScrollVideoHero } from '@/components/sections/ScrollVideoHero';
import { HomeIntro } from '@/components/sections/HomeIntro';
import { HomeRoomsPreview } from '@/components/sections/HomeRoomsPreview';
import { HomeAtriumShowcase } from '@/components/sections/HomeAtriumShowcase';
import { HomeContactCTA } from '@/components/sections/HomeContactCTA';
import { SectionDivider } from '@/components/shared/SectionDivider';
import { StructuredData } from '@/components/shared/StructuredData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  description:
    'Sobe v stoletni hiši v središču Kranja. Brezplačen WiFi, zajtrk, vrt in notranji atrij. 8 km od letališča, 30 km od Bleda.',
};

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
