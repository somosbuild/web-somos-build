import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/shared';

export const metadata: Metadata = { title: 'Cumpleaños' };

export default function Page() {
  return <ComingSoon title="Cumpleaños" phase="Fase 2" />;
}
