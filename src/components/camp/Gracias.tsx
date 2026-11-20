'use client';

// Thank-you pages.
//  - /camp/gracias/?monto=…&plan=…  after paying with ONVO: sends the Purchase conversion.
//  - /camp/gracias2/?tipo=reserva|registro&monto=…&plan=…&ninos=…  after "Pagar después" (or a registration
//    without online payment): sends the Lead conversion.
// Each conversion is sent once (sessionStorage guard) and the query is removed from the URL,
// so a reload or a shared link doesn't count again.
import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { ButtonLink, Icon, Logo, Shape } from '@/components/ds';
import { asset } from '@/lib/asset';
import { track } from '@/lib/analytics';
import { planPago } from '@/lib/camp-pago';
import { WA_LINK } from '@/lib/camp';

const TEXTOS = {
  pago: { a: '¡Gracias!', b: 'Recibimos tu pago.', t: 'Te estamos enviando la información por correo. Te escribimos por WhatsApp para coordinar las semanas.' },
  reserva: { a: '¡Listo!', b: 'Te guardamos el cupo 24 horas.', t: 'Te enviamos el link de pago por WhatsApp y la información a tu correo. Tu cupo queda confirmado cuando se recibe el pago.' },
  registro: { a: '¡Gracias!', b: 'Recibimos tu registro.', t: 'Te escribimos por WhatsApp para confirmar tu cupo. También te enviamos la información a tu correo.' },
};

export function Gracias({ variante = 'pago' }: { variante?: 'pago' | 'pendiente' }) {
  const [tipo, setTipo] = useState<keyof typeof TEXTOS>(variante === 'pago' ? 'pago' : 'reserva');
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const monto = Number(q.get('monto')), planId = q.get('plan') ?? '', p = planPago(planId);
    const nombre = 'Camp' + (p ? ': ' + p.label : '');
    if (variante === 'pendiente' && q.get('tipo') === 'registro') setTipo('registro');
    if (q.size) {
      const clave = `build-${variante}:${location.search}`;
      let repetida = false;
      try { repetida = sessionStorage.getItem(clave) === '1'; sessionStorage.setItem(clave, '1'); } catch {}
      if (!repetida) {
        if (variante === 'pago' && monto > 0) track('Purchase', { value: monto, content_name: nombre });
        if (variante === 'pendiente') track('Lead', { content_name: nombre, num_items: Number(q.get('ninos')) || undefined, ...(monto > 0 ? { value: monto } : {}) });
      }
      history.replaceState(null, '', location.pathname);
    }
  }, [variante]);
  const tx = TEXTOS[tipo];

  return <main className={s.gracias}>
    <Shape name="68" size={280} color="var(--build-orange-light)" className={s.abs} style={{ right: -80, bottom: -90 }} />
    <div className={s.graciasCard}>
      <Link href="/camp/" aria-label="Build Summer Camp" className={s.graciasLogo}><Logo width={150} /></Link>
      <span className={s.graciasIcon}><Icon name="43" size={30} color="var(--build-beige)" /></span>
      <h1 className={s.graciasTitle}>{tx.a} <strong>{tx.b}</strong></h1>
      <p className={s.graciasText}>{tx.t}</p>
      <div className={s.ctas}>
        <ButtonLink size="lg" href={asset('/camp/')}>Volver al camp</ButtonLink>
        <ButtonLink variant="secondary" size="lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</ButtonLink>
      </div>
    </div>
  </main>;
}
