'use client';

import { AVISO_COOKIES, MEDICION_ACTIVA } from '@/lib/analytics';
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import s from './camp.module.css';
import { Button, ButtonLink, Icon, Logo, Shape } from '@/components/ds';
import { asset } from '@/lib/asset';
import {
  CAMP, GRUPO_SHAPE, RESERVA_LINK, WA_LINK, color, crc, grupo, inscripcionesAbiertas, isPh, paquetes,
} from '@/lib/camp';

type Vars = CSSProperties & Record<`--${string}`, string | undefined>;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/* ---------- Registration state ---------- */

export type CtaMode = 'form' | 'link';
/**
 * The CTA opens the registration form until a payment link (Onvo) is confirmed; only then, from
 * inscripciones.abren on, it becomes "Reservá tu cupo" -> payment link. WhatsApp keeps its own button.
 * `abiertas` (date) only changes copy: the stamp, the bar text and the form texts.
 * Rendered closed on the server; the date is checked in the browser. `?simular=antes|despues` previews either state.
 */
export function useInscripciones() {
  const [abiertas, setAbiertas] = useState(false);
  useEffect(() => { setAbiertas(inscripcionesAbiertas(new Date(), new URLSearchParams(location.search).get('simular'))); }, []);
  const { ctas } = CAMP.sitio;
  return abiertas && RESERVA_LINK
    ? { abiertas, label: ctas.despues, mode: 'link' as CtaMode, href: RESERVA_LINK, external: true }
    : { abiertas, label: ctas.antes, mode: 'form' as CtaMode, href: '#', external: false };
}

/* ---------- Group chip / card ---------- */

export function GrupoChip({ id, size = 'md' }: { id: string; size?: 'sm' | 'md' }) {
  const g = grupo(id), bg = color(g.color), shape = GRUPO_SHAPE[g.id];
  return <span className={cx(s.chip, size === 'sm' && s.chipSm)} style={{ '--bg': bg } as Vars}>
    <span className={s.chipDot}><Shape name={shape} size={size === 'sm' ? 12 : 15} color={bg} /></span>
    <span className={s.chipName}>{g.nombre}</span>
    <span className={s.chipAge}>{g.edad}</span>
  </span>;
}

export function GrupoCard({ id }: { id: string }) {
  const g = grupo(id);
  return <article className={s.gcard}>
    <div className={s.gcardHead} style={{ '--bg': color(g.color) } as Vars}>
      <Shape name={GRUPO_SHAPE[g.id]} size={150} color="var(--build-beige)" className={s.abs} style={{ right: -34, top: -30 }} />
      <span className={s.gcardAge}>{g.edad}</span>
      <h3 className={s.gcardName}>{g.nombre}</h3>
    </div>
    <div className={s.gcardBody}>
      <p className={s.gcardTitle}>{g.titular_web}</p>
      <p className={s.gcardText}>{g.texto_web}</p>
    </div>
  </article>;
}

/* ---------- Timeline ---------- */

type Row = { hora: string; que: string; texto?: string };
export function Cronograma({ tipo, dot }: { tipo: 'dia'; dot: string }) {
  const rango = (a: string, b: string) => a + ' a ' + b;
  let rows: Row[] = [];
  if (tipo === 'dia') rows = CAMP.horario.dia_tipo.map(r => ({ hora: r.hora, que: r.que, texto: r.fin ? rango(r.hora, r.fin) : '' }));
  return <div className={s.tl} style={{ '--col': '84px', '--fs': '20px', '--dot': dot } as Vars}>
    {rows.map(r => <div key={r.hora + r.que} className={s.tlRow}>
      {/* Pending hours are left blank on the public site. */}
      <div className={s.tlHora}>{!isPh(r.hora) && <span className={s.tlHoraTxt}>{r.hora}</span>}</div>
      <div className={s.tlRail}><span className={s.tlLine} /><span className={s.tlDot} /></div>
      <div className={s.tlBody}><span className={s.tlQue}>{r.que}</span>{r.texto && <span className={s.tlTexto}>{r.texto}</span>}</div>
    </div>)}
  </div>;
}

/* ---------- Decorative pieces ---------- */

const FRAME: Record<string, string> = { orange: 'var(--build-orange)', yellow: 'var(--build-yellow)', olive: 'var(--build-olive)', celeste: 'var(--build-celeste)' };
/** Photo slot with a brand-colour frame, scattered shapes and an optional card (logo) on top. */
export function FotoPlaceholder({ desc, src, frame = 'yellow', ratio = '4 / 5', shapeSize = 72, children }: { desc: string; src?: { full: string; small: string }; frame?: string; ratio?: string; shapeSize?: number; children?: ReactNode }) {
  const others = ['orange', 'celeste', 'olive', 'yellow'].filter(k => k !== frame), S = shapeSize;
  return <div className={s.photo}>
    <div className={s.photoFrame} style={{ '--frame': FRAME[frame] } as Vars}>
      {src
        ? <div className={s.photoInner} style={{ '--ratio': ratio } as Vars}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={s.photoImg} src={asset(src.full)} srcSet={`${asset(src.small)} 640w, ${asset(src.full)} 1024w`} sizes="(max-width: 767px) 100vw, 560px" alt={desc} width={1024} height={1024} />
          </div>
        : <div className={s.photoInner} style={{ '--ratio': ratio } as Vars} role="img" aria-label={'Foto: ' + desc}>
            <Icon name="09" size={32} color="var(--build-ink-3)" />
            <span className={s.photoLabel}>Foto</span>
            <span className={s.photoDesc}>{desc}</span>
          </div>}
    </div>
    <Shape name="01" size={S} color={FRAME[others[0]]} className={s.abs} style={{ right: -S * 0.35, top: -S * 0.35, transform: 'rotate(12deg)' }} />
    <Shape name="52" size={S} color={FRAME[others[1]]} className={s.abs} style={{ left: -S * 0.3, bottom: S * 0.9, transform: 'rotate(-8deg)' }} />
    <Shape name="02" size={S} color={FRAME[others[2]]} className={s.abs} style={{ right: S * 0.6, bottom: -S * 0.4 }} />
    {children && <div className={s.photoCard}>{children}</div>}
  </div>;
}

export function SelloPronto() {
  return <div className={s.stamp}>
    <div className={s.stampDisc} /><div className={s.stampRing} />
    <div className={s.stampText}><span className={s.stampTop}>Inscripciones</span><span className={s.stampMain}>{CAMP.inscripciones.abren_texto}</span></div>
  </div>;
}

/* ---------- Prices ---------- */

/** Week + packages as cards; with `diaAbajo` the single-day price moves to a "Walk-in" strip below. */
export function PrecioBloque({ minCol = 230, diaAbajo = false }: { minCol?: number; diaAbajo?: boolean }) {
  const p = CAMP.precios, paqs = paquetes();
  const top = paqs.reduce((a, b) => (b.n > a.n ? b : a), paqs[0]);
  const dia = { id: 'dia', label: 'Día suelto', nombre: 'Un día', total: crc(p.dia_suelto.precio), sub: p.dia_suelto.condicion + '.', ahorro: '' };
  const items = [
    ...(diaAbajo ? [] : [dia]),
    { id: 'semana', label: 'Por semana', nombre: 'Una semana', total: crc(p.semana), sub: p.aplica_a, ahorro: '' },
    ...paqs.map(k => ({ id: k.id, label: k.semanasTxt, nombre: k.nombre, total: k.totalTxt, sub: k.porSemanaTxt + ' por semana', ahorro: 'Ahorrás ' + k.ahorroTxt })),
  ];
  return <div className={s.prices}>
    <div className={s.priceGrid} style={{ '--min': `${minCol}px` } as Vars}>
      {items.map(it => <div key={it.id} className={cx(s.price, it.id === top.id && s.priceTop)}>
        {it.id === top.id && <Shape name="52" size={84} color="var(--build-beige)" className={s.abs} style={{ right: -18, top: -14, transform: 'rotate(-12deg)' }} />}
        <span className={s.priceLabel}>{it.label}</span>
        <h4 className={s.priceName}>{it.nombre}</h4>
        <strong className={s.priceTotal}>{it.total}</strong>
        <span className={s.priceSub}>{it.sub}</span>
        {it.ahorro && <span className={s.save}>{it.ahorro}</span>}
      </div>)}
    </div>
    {diaAbajo && <div className={s.walkin}><span className={s.walkinLabel}>Walk-in</span><strong className={s.walkinPrice}>{dia.total} por día</strong><span className={s.walkinSub}>{dia.sub}</span></div>}
    <div className={s.notes}><div className={s.notesBlock}><span className={s.notesLabel}>Incluye</span><span>{p.incluye.join(', ')}.</span></div></div>
  </div>;
}

/* ---------- Contact footer card ---------- */

export function ContactoFooter({ titulo, bold, cta, onCta, ctaHref }: { titulo: string; bold: string; cta: string; onCta?: () => void; ctaHref?: string }) {
  const k = CAMP.contacto;
  const items = [
    { icon: '42', txt: k.whatsapp, href: WA_LINK },
    { icon: '40', txt: k.instagram, href: 'https://instagram.com/' + k.instagram.replace('@', '') },
    { icon: '20', txt: CAMP.lugar.nombre + ', ' + CAMP.lugar.zona },
    { icon: '01', txt: k.web, href: 'https://' + k.web },
  ];
  return <footer className={s.cf}>
    <Shape name="68" size={260} color="var(--build-orange-light)" className={s.abs} style={{ right: -60, bottom: -70 }} />
    <div className={s.cfGrid}>
      <div className={s.cfLeft}>
        <div className={s.cfLogo}><Logo width={200} /></div>
        <h2 className={s.cfTitle}>{titulo} <strong>{bold}</strong></h2>
        <div className={s.ctas}>
          {onCta ? <Button variant="sunny" size="lg" onClick={onCta}>{cta}</Button>
            : <ButtonLink variant="sunny" size="lg" href={ctaHref} target="_blank" rel="noopener noreferrer">{cta}</ButtonLink>}
          <ButtonLink variant="secondary" size="lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">{CAMP.sitio.ctas.whatsapp}</ButtonLink>
        </div>
      </div>
      <ul className={s.cfList}>
        {items.map(it => <li key={it.icon}>
          <span className={s.cfIcon}><Icon name={it.icon} size={24} color="var(--build-orange-deep)" /></span>
          {it.href ? <a href={it.href} target="_blank" rel="noopener noreferrer">{it.txt}</a> : <span>{it.txt}</span>}
        </li>)}
      </ul>
    </div>
    {MEDICION_ACTIVA && <p className={s.cfCookies}>{AVISO_COOKIES}</p>}
  </footer>;
}

