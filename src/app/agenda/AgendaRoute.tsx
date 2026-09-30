'use client';

import { useSearchParams } from 'next/navigation';
import { AgendaScreen } from '@/components/agenda/Agenda';

/** Remount on query change so /agenda/?pillar=x links re-seed the filters. */
export function AgendaRoute() {
  const q = useSearchParams();
  return <AgendaScreen key={q.toString()} />;
}
