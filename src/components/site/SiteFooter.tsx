import Link from 'next/link';
import type { CSSProperties } from 'react';
import s from './site.module.css';
import { Icon } from '@/components/ds';
import { ADDRESS, CONTACT, HOURS } from '@/lib/data';
import { asset } from '@/lib/asset';
import { Wrap } from './shared';

const LINKS: { icon: string; label: string; href: string }[] = [
  { icon: '20', label: 'Cómo llegar', href: '/nosotros/' },
  { icon: '42', label: 'WhatsApp', href: CONTACT.whatsapp },
  { icon: '40', label: 'Instagram', href: CONTACT.instagram },
  { icon: '39', label: 'Escribinos', href: CONTACT.email },
];

export function SiteFooter() {
  return <footer className={s.footer}>
    <div className={s.footerPattern} style={{ '--pattern': `url(${asset('/brand/patterns/patron-8.png')})` } as CSSProperties} />
    <Wrap className={s.footerInner}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset('/brand/logos/icono-maestro-6.png')} alt="" width={480} height={483} className={s.footerMark} />
      <div className={s.footerBrand}>
        <div className={s.footerWord}>BUILD</div>
        <div className={s.footerDescriptor}>BUILDING COMMUNITY TOGETHER</div>
        <div className={s.footerAddress}>{ADDRESS}<br />{HOURS}</div>
      </div>
      <div className={s.footerLinks}>
        {LINKS.map(l => <Link key={l.label} href={l.href} className={s.footerLink}><Icon name={l.icon} size={20} color="var(--build-beige)" />{l.label}</Link>)}
      </div>
    </Wrap>
  </footer>;
}
