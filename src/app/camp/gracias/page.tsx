import type { Metadata } from 'next';
import { Gracias } from '@/components/camp/Gracias';

// Where ONVO sends the family after a successful payment (redirectUrl in netlify/functions/onvo-checkout.mts).
export const metadata: Metadata = {
  title: { absolute: '¡Gracias! · Build Summer Camp' },
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Gracias />;
}
