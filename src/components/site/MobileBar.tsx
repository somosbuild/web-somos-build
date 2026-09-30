'use client';

import { useRouter } from 'next/navigation';
import s from './site.module.css';
import { Button, Icon } from '@/components/ds';
import { CONTACT } from '@/lib/data';

/** Mobile-only sticky CTA bar + WhatsApp FAB (hidden on desktop via CSS). */
export function MobileBar({ hidden }: { hidden: boolean }) {
  const router = useRouter();
  if (hidden) return null;
  return <>
    <a href={CONTACT.whatsapp} aria-label="Escribinos por WhatsApp" className={s.fab}><Icon name="42" size={28} color="var(--build-beige)" /></a>
    <div className={s.mobileBar}>
      <Button variant="secondary" fullWidth onClick={() => router.push('/agenda/')}>Ver agenda</Button>
      <Button fullWidth onClick={() => router.push('/agenda/')}>Reservar</Button>
    </div>
  </>;
}
