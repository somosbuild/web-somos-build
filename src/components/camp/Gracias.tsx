'use client';

// Thank-you page after paying with ONVO (/camp/gracias/?monto=…&plan=…).
// Sends the Purchase conversion (Meta, GA4, Google Ads) once, then removes monto/plan from the URL,
// so a reload or a shared link doesn't count again.
import { useEffect } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { ButtonLink, Icon, Logo, Shape } from '@/components/ds';
import { asset } from '@/lib/asset';
import { track } from '@/lib/analytics';
import { planPago } from '@/lib/camp-pago';
import { WA_LINK } from '@/lib/camp';

export function Gracias() {
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const monto = Number(q.get('monto')), p = planPago(q.get('plan') ?? '');
    if (monto > 0) {
      const clave = `build-compra:${monto}:${q.get('plan') ?? ''}`;
      let repetida = false;
      try { repetida = sessionStorage.getItem(clave) === '1'; sessionStorage.setItem(clave, '1'); } catch {}
      if (!repetida) track('Purchase', { value: monto, content_name: 'Camp' + (p ? ': ' + p.label : '') });
    }
    if (q.has('monto') || q.has('plan')) history.replaceState(null, '', location.pathname);
  }, []);

  return <main className={s.gracias}>
    <Shape name="68" size={280} color="var(--build-orange-light)" className={s.abs} style={{ right: -80, bottom: -90 }} />
    <div className={s.graciasCard}>
      <Link href="/camp/" aria-label="Build Summer Camp" className={s.graciasLogo}><Logo width={150} /></Link>
      <span className={s.graciasIcon}><Icon name="43" size={30} color="var(--build-beige)" /></span>
      <h1 className={s.graciasTitle}>¡Gracias! <strong>Recibimos tu pago.</strong></h1>
      <p className={s.graciasText}>Te estamos enviando la información por correo. Te escribimos por WhatsApp para coordinar las semanas.</p>
      <div className={s.ctas}>
        <ButtonLink size="lg" href={asset('/camp/')}>Volver al camp</ButtonLink>
        <ButtonLink variant="secondary" size="lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</ButtonLink>
      </div>
    </div>
  </main>;
}
