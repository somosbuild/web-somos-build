import type { Metadata } from 'next';
import { ComingSoon } from '@/components/site/shared';

export const metadata: Metadata = { title: 'Actividades' };

export default function Page() {
  return <ComingSoon title="Actividades" phase="Fase 2" />;
}
