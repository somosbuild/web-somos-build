import type { Metadata } from 'next';
import { AboutScreen } from '@/components/about/About';

export const metadata: Metadata = { title: 'Nosotros' };

export default function Page() {
  return <AboutScreen />;
}
