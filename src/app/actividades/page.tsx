import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ActivitiesScreen } from '@/components/activities/Activities';

export const metadata: Metadata = { title: 'Actividades' };

export default function Page() {
  // useSearchParams (?pillar=) needs a Suspense boundary in a static export.
  return <Suspense><ActivitiesScreen /></Suspense>;
}
