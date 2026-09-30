import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AgendaRoute } from './AgendaRoute';

export const metadata: Metadata = { title: 'Agenda de la semana' };

export default function Page() {
  // useSearchParams needs a Suspense boundary in a static export.
  return <Suspense><AgendaRoute /></Suspense>;
}
