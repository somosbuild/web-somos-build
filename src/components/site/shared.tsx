'use client';

import { Children, type CSSProperties, type ReactNode } from 'react';
import s from './site.module.css';
import { Badge, Button, Card, PillarTag } from '@/components/ds';
import { DAYS, MEMBER, dayOf, pillarOf, type BuildEvent, type DayKey, type PillarKey } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string | undefined>;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

export function Wrap({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={cx(s.wrap, className)} style={style}>{children}</div>;
}

export function H2({ children, className, as: Tag = 'h2' }: { children: ReactNode; className?: string; as?: 'h1' | 'h2' }) {
  return <Tag className={cx(s.h2, className)}>{children}</Tag>;
}

/** Pillar descriptor tag using the pillar's own label. */
export function Tag({ pillar, size = 'sm', className }: { pillar: PillarKey; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return <PillarTag pillar={pillar} size={size} label={pillarOf(pillar).tag} className={className} />;
}

/**
 * Photo placeholder standing in for the prototype's <image-slot>.
 * Pass `src` once real brand photography is available.
 */
export function ImageSlot({ src, alt = '', placeholder, circle, style }: { src?: string; alt?: string; placeholder: string; circle?: boolean; style?: CSSProperties }) {
  return <div className={cx(s.slot, circle && s.slotCircle)} style={style}>
    {src
      // eslint-disable-next-line @next/next/no-img-element
      ? <img className={s.slotImg} src={src} alt={alt} loading="lazy" />
      : <div className={s.slotEmpty} role="img" aria-label={placeholder}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
          <span>{placeholder}</span>
        </div>}
    {!src && <span className={s.slotRing} />}
  </div>;
}

/** Grid on desktop; horizontal scroll-snap row on mobile. */
export function Carousel({ children, min = 280, minMobile, cols }: { children: ReactNode; min?: number; minMobile?: number; cols?: string }) {
  const v: Vars = { '--min': `${min}px`, '--min-m': minMobile ? `${minMobile}px` : undefined, '--cols': cols };
  return <div className={s.carousel} style={v}>
    {Children.map(children, c => <div className={s.carouselItem}>{c}</div>)}
  </div>;
}

export function DayStrip({ value, onChange, withAll = true }: { value: DayKey | 'todos'; onChange: (k: DayKey | 'todos') => void; withAll?: boolean }) {
  const btn = (k: DayKey | 'todos', top: string, bottom: string | number) =>
    <button key={k} aria-pressed={value === k} onClick={() => onChange(k)} className={cx(s.dayBtn, value === k && s.dayBtnOn)}>
      <span className={s.dayTop}>{top}</span>
      <span className={s.dayBottom}>{bottom}</span>
    </button>;
  return <div className={s.dayStrip}>
    {withAll && btn('todos', 'Semana', 'Todo')}
    {DAYS.map(d => btn(d.k, d.short, d.date))}
  </div>;
}

export function EventCard({ e, onOpen, onReserve, compactMobile }: { e: BuildEvent; onOpen: (e: BuildEvent) => void; onReserve: (e: BuildEvent) => void; compactMobile?: boolean }) {
  const d = dayOf(e.day);
  const member = e.price === MEMBER;
  return <Card interactive padding={20} onClick={() => onOpen(e)} className={cx(s.evCard, compactMobile && s.evCompact)}
    media={<div className={s.evMedia}><ImageSlot placeholder="Foto de la actividad" /></div>}>
    <div className={s.evRow}><Badge color="yellow">{d.name} {e.time}</Badge><Badge color="greige">{e.stage}</Badge></div>
    <h3 style={{ margin: 0 }} className={s.evTitle}>{e.title}</h3>
    <Tag pillar={e.pillar} className={s.selfStart} />
    <div className={s.evMeta}>
      <span>{e.dur}</span><span className={member ? s.evMember : undefined}>{e.price}</span><span>con {e.fac}</span>
    </div>
    <div className={s.evFoot}>
      <span className={cx(s.spots, !e.spots && s.spotsFull)}>{e.spots ? e.spots + ' cupos libres' : 'Lleno'}</span>
      <Button size="sm" variant={e.spots ? 'primary' : 'secondary'} onClick={ev => { ev.stopPropagation(); onReserve(e); }}>{e.spots ? 'Reservar' : 'Lista de espera'}</Button>
    </div>
  </Card>;
}

export function ComingSoon({ title, phase }: { title: string; phase: string }) {
  return <Wrap className={s.soon}>
    <span className={s.soonPhase}>{phase} · en diseño</span>
    <h1 className={s.soonTitle}>{title}</h1>
    <p className={s.soonText}>Esta página llega en la {phase} del brief v3.</p>
  </Wrap>;
}
