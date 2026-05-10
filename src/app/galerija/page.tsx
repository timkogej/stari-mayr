import type { Metadata } from 'next';
import { GalerijaClient } from './GalerijaClient';

export const metadata: Metadata = {
  title: 'Galerija',
  description: 'Fotografije gostilne Stari Mayr skozi čas — jedilnica, atrij, sobe in jedi.',
};

export default function GalerijaPage() {
  return <GalerijaClient />;
}
