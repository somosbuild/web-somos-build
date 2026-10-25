'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import s from './camp.module.css';
import { Badge, Button, ButtonLink, Icon, Logo, Shape } from '@/components/ds';
import {
  CAMP, GRUPO_SHAPE, PILAR_SHAPE, RESERVA_LINK, WA_LINK, color, crc, deep, grupo, inscripcionesAbiertas, isPending, isPh, paquetes, type Semana,
} from '@/lib/camp';

type Vars = CSSProperties & Record<`--${string}`, string | undefined>;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/* ---------- Registration state ---------- */

export type CtaMode = 'form' | 'link';
/**
 * Before inscripciones.abren: "Avisame cuando abran" opens the interest form.
 * After: "Reservá tu cupo" goes to the payment link, or to WhatsApp while that link is pending.
 * Rendered closed on the server; the date is checked in the browser. `?simular=antes|despues` previews either state.
 */
export function useInscripciones() {
  const [abiertas, setAbiertas] = useState(false);
  useEffect(() => { setAbiertas(inscripcionesAbiertas(new Date(), new URLSearchParams(location.search).get('simular'))); }, []);
  const { ctas } = CAMP.sitio;
  return abiertas
    ? { abiertas, label: ctas.despues, mode: 'link' as CtaMode, href: RESERVA_LINK ?? WA_LINK, external: true }
    : { abiertas, label: ctas.antes, mode: 'form' as CtaMode, href: '#', external: false };
}

/* ---------- Group chip / dot / card ---------- */

export function GrupoChip({ id, variant = 'chip', size = 'md' }: { id: string; variant?: 'chip' | 'dot'; size?: 'sm' | 'md' }) {
  const g = grupo(id), bg = color(g.color), shape = GRUPO_SHAPE[g.id];
  if (variant === 'dot') return <span className={s.dot}><Shape name={shape} size={16} color={bg} />{g.nombre}</span>;
  return <span className={cx(s.chip, size === 'sm' && s.chipSm)} style={{ '--bg': bg } as Vars}>
    <span className={s.chipDot}><Shape name={shape} size={size === 'sm' ? 12 : 15} color={bg} /></span>
    <span className={s.chipName}>{g.nombre}</span>
    <span className={s.chipAge}>{g.edad}</span>
  </span>;
}

export function GrupoCard({ id }: { id: string }) {
  const g = grupo(id), [a, b] = String(g.razon_adulto_nino).split(':');
  return <article className={s.gcard}>
    <div className={s.gcardHead} style={{ '--bg': color(g.color) } as Vars}>
      <Shape name={GRUPO_SHAPE[g.id]} size={150} color="var(--build-beige)" className={s.abs} style={{ right: -34, top: -30 }} />
      <span className={s.gcardAge}>{g.edad}</span>
      <h3 className={s.gcardName}>{g.nombre}</h3>
    </div>
    <div className={s.gcardBody}>
      <div className={s.block}><span className={s.label} style={{ '--c': deep(g.color) } as Vars}>En las {CAMP.semanas.length} semanas</span><p className={s.gcardGoal}>{g.objetivo_temporada}</p></div>
      <div className={s.block}><span className={s.label} style={{ '--c': deep(g.color) } as Vars}>Por qué funciona</span><p className={s.p15}>{g.por_que}</p></div>
      <p className={s.p15m}>{g.formato}</p>
      <div className={s.badges}><Badge color="greige">{a} adulto cada {b} niños</Badge><Badge color="greige">{g.cupo} cupos por semana</Badge></div>
    </div>
  </article>;
}

/* ---------- Timeline ---------- */

type Row = { hora: string; que: string; texto?: string };
export function Cronograma({ tipo, dot, evento: eventoId }: { tipo: 'dia' | 'semana' | 'viernes' | 'evento'; dot: string; evento?: string }) {
  const rango = (a: string, b: string) => a + ' a ' + b;
  let rows: Row[] = [];
  if (tipo === 'dia') rows = CAMP.horario.dia_tipo.map(r => ({ hora: r.hora, que: r.que, texto: r.fin ? rango(r.hora, r.fin) : '' }));
  if (tipo === 'semana') rows = CAMP.arco_semana.map(r => ({ hora: r.dia, que: r.titulo, texto: r.texto }));
  if (tipo === 'viernes') {
    const v = CAMP.horario.viernes_en_familia;
    rows = [
      { hora: v.muestra.inicio, que: 'Los niños muestran lo que construyeron', texto: rango(v.muestra.inicio, v.muestra.fin) + '. ' + v.muestra.precio + '.' },
      { hora: v.actividad_en_familia.inicio, que: 'Actividad para hacer juntos', texto: rango(v.actividad_en_familia.inicio, v.actividad_en_familia.fin) + '. ' + v.actividad_en_familia.precio + '.' },
    ];
  }
  if (tipo === 'evento') rows = (CAMP.eventos.find(e => e.id === eventoId) ?? CAMP.eventos[0]).agenda.map(r => ({ hora: r.hora, que: r.que }));
  const col = tipo === 'semana' ? '120px' : tipo === 'evento' ? '140px' : '84px';
  return <div className={s.tl} style={{ '--col': col, '--fs': tipo === 'semana' ? '18px' : '20px', '--dot': dot } as Vars}>
    {rows.map(r => <div key={r.hora + r.que} className={s.tlRow}>
      {/* Pending hours are left blank on the public site. */}
      <div className={s.tlHora}>{!isPh(r.hora) && <span className={s.tlHoraTxt}>{r.hora}</span>}</div>
      <div className={s.tlRail}><span className={s.tlLine} /><span className={s.tlDot} /></div>
      <div className={s.tlBody}><span className={s.tlQue}>{r.que}</span>{r.texto && <span className={s.tlTexto}>{r.texto}</span>}</div>
    </div>)}
  </div>;
}

/* ---------- Decorative pieces ---------- */

const SNOW: [number, number, string, number][] = [[8, 14, '01', 14], [22, 62, '05', 8], [38, 22, '01', 10], [52, 70, '05', 6], [64, 12, '05', 9], [46, 44, '01', 8], [14, 82, '05', 7], [30, 40, '05', 5]];
export const Snow = ({ points = SNOW }: { points?: [number, number, string, number][] }) =>
  <>{points.map(([x, y, n, sz], i) => <Shape key={i} name={n} size={sz * 1.4} color="var(--build-beige)" className={s.abs} style={{ left: x + '%', top: y + '%' }} />)}</>;

/** Christmas tree stacked from square bricks + a star. */
export function PinoBloques({ size, star = 'var(--build-yellow)', pine = 'var(--build-olive)', style }: { size: number; star?: string; pine?: string; style?: CSSProperties }) {
  const W = size, orn = ['var(--build-orange)', 'var(--build-celeste)'];
  const g = W * 0.045, sq = (W - 2 * g) / 3, st = sq * 1.05;
  const y1 = st * 0.82, y2 = y1 + sq + g, y3 = y2 + sq + g, yt = y3 + sq + g, tr = sq * 0.55;
  const P: [string, number, string, number, number][] = [
    ['58', sq, pine, (W - sq) / 2, y1],
    ['58', sq, pine, (W - 2 * sq - g) / 2, y2], ['58', sq, orn[0], (W - 2 * sq - g) / 2 + sq + g, y2],
    ['58', sq, orn[1], 0, y3], ['58', sq, pine, sq + g, y3], ['58', sq, pine, 2 * (sq + g), y3],
    ['58', tr, 'var(--build-orange-deep)', (W - tr) / 2, yt],
    ['01', st, star, (W - st) / 2, 0],
  ];
  return <div aria-hidden="true" style={{ position: 'absolute', width: W, height: Math.round(yt + tr), ...style }}>
    {P.map(([n, sz, c, x, y], i) => <Shape key={i} name={n} size={sz} color={c} className={s.abs} style={{ left: x, top: y }} />)}
  </div>;
}

const FRAME: Record<string, string> = { orange: 'var(--build-orange)', yellow: 'var(--build-yellow)', olive: 'var(--build-olive)', celeste: 'var(--build-celeste)' };
/** Photo slot with a brand-colour frame, scattered shapes and an optional card (logo) on top. */
export function FotoPlaceholder({ desc, frame = 'yellow', ratio = '4 / 5', shapeSize = 72, children }: { desc: string; frame?: string; ratio?: string; shapeSize?: number; children?: ReactNode }) {
  const others = ['orange', 'celeste', 'olive', 'yellow'].filter(k => k !== frame), S = shapeSize;
  return <div className={s.photo}>
    <div className={s.photoFrame} style={{ '--frame': FRAME[frame] } as Vars}>
      <div className={s.photoInner} style={{ '--ratio': ratio } as Vars} role="img" aria-label={'Foto: ' + desc}>
        <Icon name="09" size={32} color="var(--build-ink-3)" />
        <span className={s.photoLabel}>Foto</span>
        <span className={s.photoDesc}>{desc}</span>
      </div>
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

/* ---------- Week card ---------- */

export function SemanaCard({ sem }: { sem: Semana }) {
  const navidad = sem.modo === 'navidad';
  // Ally: name until the logo arrives; hidden while the ally itself is pending.
  const ally = isPending(sem.aliado) ? null : sem.aliado.nombre;
  return <article className={s.week} data-modo={sem.modo}>
    <div className={s.weekHead} style={{ '--bg': color(sem.pilar) } as Vars}>
      {navidad
        ? <><Snow /><PinoBloques size={84} star={sem.pilar === 'skills' ? 'var(--build-orange)' : 'var(--build-yellow)'} pine={sem.pilar === 'joy' ? 'var(--build-beige)' : 'var(--build-olive)'} style={{ right: 22, bottom: -6 }} /></>
        : <Shape name={PILAR_SHAPE[sem.pilar] ?? '04'} size={170} color="var(--build-beige)" className={s.abs} style={{ right: -40, bottom: -46 }} />}
      <span className={s.datePill}>{sem.fechas_corto}</span>
      <div className={s.weekNum}><span className={s.weekNumWord}>Semana</span><span className={s.weekNumN}>{sem.n}</span></div>
    </div>
    <div className={s.weekBody}>
      <h3 className={s.weekTema}>{sem.tema}</h3>
      <p className={s.p15m}>{sem.lema}</p>
      <div className={s.goal}><span className={s.label} style={{ '--c': deep(sem.pilar) } as Vars}>Objetivo de la semana</span><strong>{sem.objetivo}</strong></div>
      <div className={s.weekGroups}>
        {CAMP.grupos.map(g => <div key={g.id} className={s.weekGroup}><div><GrupoChip id={g.id} variant="dot" /></div><p className={s.p15}>{sem.objetivos[g.id]}</p></div>)}
      </div>
      {ally && <div className={s.ally}><span className={s.label}>Aliado</span><div className={s.allyBox}>{ally}</div></div>}
    </div>
  </article>;
}

/* ---------- Prices ---------- */

export function PrecioBloque() {
  const p = CAMP.precios, paqs = paquetes();
  const top = paqs.reduce((a, b) => (b.n > a.n ? b : a), paqs[0]);
  const items = [
    { id: 'dia', label: 'Día suelto', nombre: 'Un día', total: crc(p.dia_suelto.precio), sub: p.dia_suelto.condicion + '.', ahorro: '' },
    { id: 'semana', label: 'Por semana', nombre: 'Una semana', total: crc(p.semana), sub: p.aplica_a, ahorro: '' },
    ...paqs.map(k => ({ id: k.id, label: k.semanasTxt, nombre: k.nombre, total: k.totalTxt, sub: k.porSemanaTxt + ' por semana', ahorro: 'Ahorrás ' + k.ahorroTxt })),
  ];
  return <div className={s.prices}>
    <div className={s.priceGrid}>
      {items.map(it => <div key={it.id} className={cx(s.price, it.id === top.id && s.priceTop)}>
        {it.id === top.id && <Shape name="52" size={84} color="var(--build-beige)" className={s.abs} style={{ right: -18, top: -14, transform: 'rotate(-12deg)' }} />}
        <span className={s.priceLabel}>{it.label}</span>
        <h4 className={s.priceName}>{it.nombre}</h4>
        <strong className={s.priceTotal}>{it.total}</strong>
        <span className={s.priceSub}>{it.sub}</span>
        {it.ahorro && <span className={s.save}>{it.ahorro}</span>}
      </div>)}
    </div>
    <div className={s.notes}><div className={s.block}><span className={s.label} style={{ '--c': 'var(--build-orange-deep)' } as Vars}>Incluye</span><span>{p.incluye.join(', ')}.</span></div></div>
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
  </footer>;
}

