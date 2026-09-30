'use client';

import { Children, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import s from './site.module.css';
import { Badge, Button, Card, PillarTag } from '@/components/ds';
import { DAYS, MEMBER, dayOf, onColorInk, pillarOf, type BrandColor, type BuildEvent, type DayKey, type PillarKey } from '@/lib/data';

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
export function Carousel({ children, min = 280, minMobile, cols, gap = 16 }: { children: ReactNode; min?: number; minMobile?: number; cols?: string; gap?: number }) {
  const v: Vars = { '--min': `${min}px`, '--min-m': minMobile ? `${minMobile}px` : undefined, '--cols': cols, '--gap': `${gap}px` };
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


export function SectionHead({ title, link, href, linkDesktopOnly }: { title: ReactNode; link?: string; href?: string; linkDesktopOnly?: boolean }) {
  return <div className={s.head}>
    <H2>{title}</H2>
    {link && href && <Link href={href} className={cx(s.headLink, linkDesktopOnly && 'desktop-only')}>{link} →</Link>}
  </div>;
}

/** Bold, orange emphasis inside a section title. */
export const Em = ({ children }: { children: ReactNode }) => <b className={s.headEm}>{children}</b>;

export function Eyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return <span className={s.eyebrow} style={{ '--c': color } as Vars}>{children}</span>;
}

export function PageTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return <div className={s.pageTitle}>
    <h1 className={s.pageH1}>{children}</h1>
    {sub && <p className={s.pageSub}>{sub}</p>}
  </div>;
}

export function Accordion({ items }: { items: [string, ReactNode][] }) {
  const [open, setOpen] = useState(0);
  return <div className={s.acc}>
    {items.map(([q, a], i) => {
      const on = open === i;
      return <div key={q} className={cx(s.accItem, on && s.accOn)}>
        <button onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className={s.accBtn}>{q}<span className={s.accPlus} aria-hidden="true">+</span></button>
        <div className={s.accPanel}><div className={s.accInner} inert={!on}><div className={s.accBody}>{a}</div></div></div>
      </div>;
    })}
  </div>;
}

/** Id of the last section whose top has scrolled past the sticky tabs. */
export function useSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  const key = ids.join();
  useEffect(() => {
    const f = () => {
      const limit = window.matchMedia('(max-width: 767px)').matches ? 170 : 200;
      let cur = ids[0];
      for (const id of ids) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < limit) cur = id; }
      setActive(cur);
    };
    window.addEventListener('scroll', f, { passive: true });
    f();
    return () => window.removeEventListener('scroll', f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return active;
}

export const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/** Sticky pill tabs that jump to page sections (class `anchor` sets the landing offset). */
export function StickyTabs({ items }: { items: { id: string; label: string; color?: BrandColor }[] }) {
  const active = useSpy(items.map(i => i.id));
  return <div className={s.stickyTabs}>
    <Wrap className={s.stickyTabsInner}>
      {items.map(i => <button key={i.id} aria-current={active === i.id ? 'true' : undefined} onClick={() => scrollToId(i.id)}
        className={cx(s.stickyTab, active === i.id && s.stickyTabOn)}
        style={i.color ? { '--c': `var(--build-${i.color})`, '--c-fg': onColorInk(i.color) ? 'var(--build-ink)' : '#fff' } as Vars : undefined}>{i.label}</button>)}
    </Wrap>
  </div>;
}

export const anchorClass = s.anchor;
