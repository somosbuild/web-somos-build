import Link from 'next/link';
import { Wrap } from '@/components/site/shared';

export default function NotFound() {
  return <Wrap style={{ padding: '64px 32px 96px' }}>
    <h1 style={{ margin: 0, font: '400 56px/1.05 var(--font-display)', color: 'var(--text-heading)' }}>No encontramos <b>esta página</b></h1>
    <p style={{ font: '500 17px/1.5 var(--font-sans)', color: 'var(--text-muted)' }}><Link href="/">Volver al inicio</Link></p>
  </Wrap>;
}
