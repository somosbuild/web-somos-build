import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/shared';

export const metadata: Metadata = { title: 'Membresía' };

export default function Page() {
  return <ComingSoon title="Membresía" phase="Fase 2" />;
}
