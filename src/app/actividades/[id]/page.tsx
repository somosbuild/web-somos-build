import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActivityPage } from '@/components/activities/Activities';
import { EVENTS } from '@/lib/data';

export const dynamicParams = false;
export const generateStaticParams = () => EVENTS.map(e => ({ id: e.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const e = EVENTS.find(x => x.id === id);
  return e ? { title: e.title, description: e.desc } : {};
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!EVENTS.some(e => e.id === id)) notFound();
  return <ActivityPage id={id} />;
}
