import type { Metadata, Viewport } from 'next';
import './globals.css';
import { gilroy, lilita, recoleta } from './fonts';
import { SiteProvider } from '@/components/site/SiteProvider';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';

export const metadata: Metadata = {
  title: { default: 'Build — Family hub', template: '%s · Build' },
  description: 'Build es un family hub para papás en cada etapa, del embarazo a los primeros 5 años.',
  // Rama de prueba (sitio-completo): no indexar hasta la apertura.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: '#fcf3ea' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${recoleta.variable} ${gilroy.variable} ${lilita.variable}`}>
      <body>
        <SiteProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </SiteProvider>
      </body>
    </html>
  );
}
