import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/shared';

export const metadata: Metadata = { title: 'Nosotros' };

export default function Page() {
  return <ComingSoon title="Nosotros" phase="Fase 3" />;
}
