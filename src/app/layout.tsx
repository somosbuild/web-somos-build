import type { Metadata, Viewport } from 'next';
import './globals.css';
import { gilroy, lilita, recoleta } from './fonts';

// Landing previa a la apertura. El sitio completo (header, footer, SiteProvider) vive en la rama `sitio-completo`.
export const metadata: Metadata = {
  // Netlify define URL con la dirección principal del sitio en cada deploy.
  metadataBase: new URL(process.env.URL ?? 'https://www.somosbuild.com'),
  title: { default: 'Build — Family hub · Abrimos en diciembre 2026', template: '%s · Build' },
  description: 'Build es un family hub en City Place, Santa Ana, para familias que esperan un bebé, que ya tienen uno o que siguen creciendo juntas. Abrimos en diciembre 2026.',
  openGraph: {
    title: 'Build — Family hub',
    description: 'La familia no ocurre por casualidad, se construye. Abrimos en diciembre 2026 en City Place, Santa Ana.',
    images: ['/fotos/hero-familia.webp'],
    locale: 'es_CR',
    type: 'website',
  },
};

export const viewport: Viewport = { themeColor: '#fcf3ea' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${recoleta.variable} ${gilroy.variable} ${lilita.variable}`}>
      <body>{children}</body>
    </html>
  );
}
