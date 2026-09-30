'use client';

import { useState, type CSSProperties } from 'react';
import Link from 'next/link';
import s from './site.module.css';
import { Badge, Button, Checkbox, Dialog, Icon, IconButton, Input, Select, useEscape } from '@/components/ds';
import { STAGES, dayOf, pillarOf, type BuildEvent } from '@/lib/data';
import { ImageSlot, Tag } from './shared';

function Fact({ icon, label, value }: { icon: string; label: string; value: string }) {
  return <div className={s.fact}>
    <span className={s.factIcon}><Icon name={icon} size={20} color="var(--build-orange)" /></span>
    <span className={s.factText}><span className={s.factLabel}>{label}</span><span className={s.factValue}>{value}</span></span>
  </div>;
}

/** Side panel on desktop, bottom sheet on mobile. */
export function EventDetail({ e, onClose, onReserve }: { e: BuildEvent; onClose: () => void; onReserve: (e: BuildEvent) => void }) {
  useEscape(onClose);
  const d = dayOf(e.day);
  const p = pillarOf(e.pillar);
  return <div className={s.detailScrim} onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-label={e.title} className={s.detail} onClick={ev => ev.stopPropagation()}>
      <div className={s.detailMedia} style={{ '--bg': `var(--build-${p.color})` } as CSSProperties}>
        <ImageSlot placeholder="Foto de la actividad" />
        <div className={s.detailClose}><IconButton label="Cerrar" onClick={onClose}><span className={s.detailX}>×</span></IconButton></div>
      </div>
      <div className={s.detailBody}>
        <Tag pillar={e.pillar} className={s.selfStart} />
        <h2 className={s.detailTitle}>{e.title}</h2>
        <div className={s.evRow}><Badge color="yellow">{d.name} {d.date} · {e.time}</Badge><Badge color="greige">{e.stage}</Badge><Badge color="greige">{e.dur}</Badge></div>
        <p className={s.detailDesc}>{e.desc}</p>
        <div className={s.detailFacts}><Fact icon="44" label="Facilitador" value={e.fac} /><Fact icon="16" label="Precio" value={e.price} /></div>
        <div>
          <div className={s.sectionLabel}>Qué llevar</div>
          <ul className={s.bring}>{e.bring.map(b => <li key={b}><Icon name="43" size={16} color="var(--build-olive)" />{b}</li>)}</ul>
        </div>
        <div className={s.note}>Actividad con papás o cuidadores presentes.</div>
        <div className={s.detailCta}>
          <Button size="lg" fullWidth variant={e.spots ? 'primary' : 'secondary'} onClick={() => onReserve(e)}>{e.spots ? `Reservar · ${e.spots} cupos` : 'Unirme a la lista de espera'}</Button>
          <Link href={`/actividades/${e.id}/`} onClick={onClose} className={s.detailLink}>Ver página de la actividad →</Link>
        </div>
      </div>
    </div>
  </div>;
}

export function ReserveDialog({ event, onClose, onDone }: { event: BuildEvent; onClose: () => void; onDone: (e: BuildEvent, name: string) => void }) {
  const [name, setName] = useState('');
  const p = pillarOf(event.pillar);
  const d = dayOf(event.day);
  const ok = name.trim().length > 0;
  return <Dialog onClose={onClose} accent={`var(--build-${p.color})`} width={500} title={event.title}
    actions={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button disabled={!ok} onClick={() => onDone(event, name)}>Confirmar cupo</Button></>}>
    <form className={s.reserveBody} onSubmit={ev => { ev.preventDefault(); if (ok) onDone(event, name); }}>
      <span className={s.muted}>{d.name} {d.date} · {event.time} · {event.dur} · {event.price}</span>
      <Input label="Tu nombre" placeholder="Ej. Sofía Mora" value={name} onChange={ev => setName(ev.target.value)} autoFocus autoComplete="name" />
      <Select label="Etapa" options={STAGES.slice(1)} defaultValue={event.stage} />
      <Checkbox label="Voy con acompañante" />
    </form>
  </Dialog>;
}
