import type { Metadata } from 'next';
import { Gracias } from '@/components/camp/Gracias';

// Where the camp form sends families who chose "Pagar después" (or registered without online payment).
// Counts those registrations as Lead (see Gracias.tsx).
export const metadata: Metadata = {
  title: { absolute: '¡Listo! · Build Summer Camp' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Gracias variante="pendiente" />;
}
