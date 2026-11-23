import type { Metadata } from 'next';
import { FichaForm } from '@/components/camp/FichaForm';

// Hidden page: the camp's "ficha de ingreso". Not linked from the site and kept out of search engines;
// Build sends the link to families once their spot is confirmed.
export const metadata: Metadata = {
  title: { absolute: 'Ficha de ingreso · Build Summer Camp' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FichaForm />;
}
