import type { Metadata } from 'next';
import { CampPage } from '@/components/camp/CampPage';
import { CAMP, EDADES, RANGO } from '@/lib/camp';

const title = `${CAMP.camp.nombre} · Camp de vacaciones en City Place, Santa Ana`;
const description = `${CAMP.camp.tagline} ${RANGO}, ${EDADES.toLowerCase()}, en City Place, Santa Ana. ${CAMP.camp.descripcion_corta}`;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/camp/' },
  openGraph: { title: CAMP.camp.nombre, description, url: '/camp/', locale: 'es_CR', type: 'website' },
};

// Structured data so search engines and AI assistants can read dates, place, ages and price.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: CAMP.camp.nombre,
  description: CAMP.camp.descripcion_corta,
  startDate: CAMP.semanas[0].inicio,
  endDate: CAMP.semanas[CAMP.semanas.length - 1].fin,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  typicalAgeRange: `${CAMP.camp.edades.min}-${CAMP.camp.edades.max}`,
  location: { '@type': 'Place', name: 'City Place', address: { '@type': 'PostalAddress', addressLocality: 'Santa Ana', addressRegion: 'San José', addressCountry: 'CR' } },
  organizer: { '@type': 'Organization', name: 'Build', url: 'https://www.somosbuild.com' },
  offers: { '@type': 'Offer', price: CAMP.precios.semana, priceCurrency: 'CRC', description: CAMP.precios.aplica_a, url: 'https://www.somosbuild.com/camp/' },
};

export default function Page() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <CampPage />
  </>;
}
