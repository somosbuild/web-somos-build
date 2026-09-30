import type { Metadata } from 'next';
import { BirthdaysScreen } from '@/components/birthdays/Birthdays';

export const metadata: Metadata = { title: 'Cumpleaños' };

export default function Page() {
  return <BirthdaysScreen />;
}
