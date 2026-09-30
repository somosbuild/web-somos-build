'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import s from './agenda.module.css';
import { Button, Tabs, useEscape } from '@/components/ds';
import { DayStrip, EventCard, Wrap } from '@/components/site/shared';
import { useSite } from '@/components/site/SiteProvider';
import { DAYS, EVENTS, PILLARS, STAGES, WEEK_LABEL, isPillar, onColorInk, pillarOf, type BuildEvent, type DayKey, type PillarKey } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string | undefined>;
type View = 'grid' | 'week';
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
const toMin = (t: string) => { const [h, mm] = t.split(':').map(Number); return h * 60 + mm; };
const dayIdx = (k: DayKey) => DAYS.findIndex(d => d.k === k);

function Chip({ on, onClick, children, pillar, removable }: { on: boolean; onClick: () => void; children: ReactNode; pillar?: PillarKey; removable?: boolean }) {
  const c = pillar ? pillarOf(pillar).color : undefined;
  const v: Vars = c ? { '--chip': `var(--build-${c})`, '--chip-fg': onColorInk(c) ? 'var(--build-ink)' : '#fff' } : {};
  return <button onClick={onClick} aria-pressed={removable ? undefined : on} className={cx(s.chip, on && s.chipOn)} style={v}>
    {c && !on && <span className={s.chipDot} />}{children}{removable && <span aria-hidden="true" className={s.chipX}>×</span>}
  </button>;
}

function FilterGroups({ stage, setStage, pillars, togglePillar }: { stage: string; setStage: (v: string) => void; pillars: PillarKey[]; togglePillar: (k: PillarKey) => void }) {
  return <>
    <div role="group" aria-label="Etapa"><div className={s.groupLabel}>Etapa</div><div className={s.chipRow}>{STAGES.map(x => <Chip key={x} on={stage === x} onClick={() => setStage(x)}>{x}</Chip>)}</div></div>
    <div role="group" aria-label="Pilar"><div className={s.groupLabel}>Pilar</div><div className={s.chipRow}>{PILLARS.map(p => <Chip key={p.k} on={pillars.includes(p.k)} pillar={p.k} onClick={() => togglePillar(p.k)}>{p.name}</Chip>)}</div></div>
  </>;
}

function WeekView({ list, onOpen }: { list: BuildEvent[]; onOpen: (e: BuildEvent) => void }) {
  return <div className={s.week}>
    {DAYS.map(d => {
      const items = list.filter(e => e.day === d.k);
      return <div key={d.k} className={s.weekCol}>
        <div className={s.weekHead}><span className={s.weekDay}>{d.name}</span><span className={s.weekDate}>{d.date}</span></div>
        {items.map(e => <button key={e.id} onClick={() => onOpen(e)} className={s.weekItem}>
          <div className={s.weekStripe} style={{ '--bg': `var(--build-${pillarOf(e.pillar).color})` } as Vars} />
          <div className={s.weekBody}>
            <span className={s.weekTime}>{e.time} · {e.dur}</span>
            <span className={s.weekTitle}>{e.title}</span>
            <span className={cx(s.weekSpots, !e.spots && s.weekFull)}>{e.spots ? e.spots + ' cupos' : 'Lleno'}</span>
          </div>
        </button>)}
        {!items.length && <div className={s.weekNone}>Sin actividades</div>}
      </div>;
    })}
  </div>;
}

function FilterSheet({ count, onClose, clear, children }: { count: number; onClose: () => void; clear: () => void; children: ReactNode }) {
  useEscape(onClose);
  return <div className={s.sheetScrim} onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label="Filtros" className={s.sheet} onClick={e => e.stopPropagation()}>
      <div className={s.sheetHandle} />
      <div className={s.sheetHead}><span className={s.sheetTitle}>Filtros</span><button className={s.sheetClear} onClick={clear}>Limpiar</button></div>
      {children}
      <Button size="lg" fullWidth onClick={onClose}>Ver {count} {count === 1 ? 'actividad' : 'actividades'}</Button>
    </div>
  </div>;
}

/** Reads ?pillar=, ?view=week, ?sheet=1 once on mount (same URL states as the prototype). */
export function AgendaScreen() {
  const q = useSearchParams();
  const initPillar = q.get('pillar');
  const { openEvent, reserveEvent, setSheetLock } = useSite();
  const [day, setDay] = useState<DayKey | 'todos'>('todos');
  const [stage, setStage] = useState('Todos');
  const [pillars, setPillars] = useState<PillarKey[]>(isPillar(initPillar) ? [initPillar] : []);
  const [view, setView] = useState<View>(q.get('view') === 'week' ? 'week' : 'grid');
  const [sheet, setSheet] = useState(q.get('sheet') === '1');

  useEffect(() => { setSheetLock(sheet); return () => setSheetLock(false); }, [sheet, setSheetLock]);

  const togglePillar = (k: PillarKey) => setPillars(ps => ps.includes(k) ? ps.filter(x => x !== k) : [...ps, k]);
  const clear = () => { setStage('Todos'); setPillars([]); };
  const base = EVENTS
    .filter(e => (stage === 'Todos' || e.stage === stage) && (!pillars.length || pillars.includes(e.pillar)))
    .sort((a, b) => dayIdx(a.day) - dayIdx(b.day) || toMin(a.time) - toMin(b.time));
  const list = base.filter(e => day === 'todos' || e.day === day);
  const groups = DAYS.map(d => ({ d, items: list.filter(e => e.day === d.k) })).filter(g => g.items.length);
  const activeCount = (stage !== 'Todos' ? 1 : 0) + pillars.length;
  const filterProps = { stage, setStage, pillars, togglePillar };

  return <div className={s.page}>
    <Wrap className={s.intro}>
      <h1 className={s.title}>Agenda <b>de la semana</b></h1>
      <p className={s.lead}>{WEEK_LABEL} · Todas las actividades son con papás o cuidadores presentes.</p>
    </Wrap>

    <div className={s.bar}>
      <Wrap className={s.barInner}>
        <DayStrip value={day} onChange={setDay} />
        <div className={cx(s.chipsMobile, 'mobile-only')}>
          <Chip on={false} onClick={() => setSheet(true)}>Filtros{activeCount ? ' · ' + activeCount : ''}</Chip>
          {stage !== 'Todos' && <Chip on removable onClick={() => setStage('Todos')}>{stage}</Chip>}
          {pillars.map(k => <Chip key={k} on removable pillar={k} onClick={() => togglePillar(k)}>{pillarOf(k).name}</Chip>)}
        </div>
        <div className={cx(s.filtersDesktop, 'desktop-only')}>
          <FilterGroups {...filterProps} />
          <div className={s.tabs}><Tabs label="Vista" tabs={[{ value: 'grid', label: 'Tarjetas' }, { value: 'week', label: 'Semana' }]} value={view} onChange={setView} /></div>
        </div>
      </Wrap>
    </div>

    <Wrap className={s.results}>
      {!list.length && <div className={s.empty}>
        <span className={s.emptyText}>No hay actividades con estos filtros.</span>
        <Button variant="secondary" size="sm" onClick={() => { clear(); setDay('todos'); }}>Quitar filtros</Button>
      </div>}
      {!!list.length && view === 'week' && <div className="desktop-only"><WeekView list={list} onOpen={openEvent} /></div>}
      {/* Mobile always shows cards; desktop shows them unless week view is selected. */}
      {!!list.length && <div className={cx(s.groups, view === 'week' && 'mobile-only')}>
        {groups.map(({ d, items }) => <section key={d.k}>
          <h2 className={s.dayHead}><span className={s.dayName}>{d.name}</span><span className={s.dayMeta}>{d.date} {d.month} · {items.length} {items.length === 1 ? 'actividad' : 'actividades'}</span></h2>
          <div className={s.cards}>{items.map(e => <EventCard key={e.id} e={e} onOpen={openEvent} onReserve={reserveEvent} compactMobile />)}</div>
        </section>)}
      </div>}
    </Wrap>

    {sheet && <FilterSheet count={list.length} onClose={() => setSheet(false)} clear={clear}><FilterGroups {...filterProps} /></FilterSheet>}
  </div>;
}
