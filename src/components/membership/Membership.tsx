'use client';

import type { CSSProperties, ReactNode } from 'react';
import s from './membership.module.css';
import { Badge, Button, Icon, Shape } from '@/components/ds';
import { Accordion, Carousel, Em, Eyebrow, H2, Wrap } from '@/components/site/shared';
import { useSite } from '@/components/site/SiteProvider';
import { PLANS, POLICIES, onColorInk, type Plan } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const Check = ({ on }: { on: boolean }) => on
  ? <Icon name="43" size={18} color="var(--build-olive-deep)" title="Sí" />
  : <span className={s.dash} aria-label="No">—</span>;
const val = (v: string | boolean) => typeof v === 'boolean' ? <Check on={v} /> : v;

function PlanCard({ p, onPick }: { p: Plan; onPick: (p: Plan) => void }) {
  const rows: [string, string | boolean][] = [['Actividades por mes', p.perMonth], ['Descuentos', p.discount], ['Reserva preferencial', p.priority], ['Café', p.cafe], ['Eventos exclusivos', p.events]];
  return <div className={cx(s.plan, p.featured && s.planFeatured)}>
    <div className={s.planHead} style={{ '--bg': `var(--build-${p.color})`, '--fg': onColorInk(p.color) ? 'var(--build-ink)' : '#fff' } as Vars}>
      {p.featured && <span className={s.planBadge}><Badge color="beige">Más elegida</Badge></span>}
      <h3 style={{ margin: 0 }} className={s.planName}>{p.name}</h3>
      <span className={s.planFor}>{p.for}</span>
      <span className={s.planPrice}><span className={s.planAmount}>{p.price}</span><span className={s.planPer}>/ mes</span></span>
    </div>
    <div className={s.planBody}>
      {rows.map(([l, v]) => <div key={l} className={s.planRow}><span className={s.planLabel}>{l}</span><span className={s.planValue}>{val(v)}</span></div>)}
      <Button fullWidth size="lg" variant={p.featured ? 'primary' : 'secondary'} className={s.planCta} onClick={() => onPick(p)}>Elegir plan</Button>
    </div>
  </div>;
}

function CompareTable() {
  const rows: [string, (p: Plan) => ReactNode][] = [
    ['Para quién', p => p.for], ['Actividades por mes', p => p.perMonth], ['Descuentos', p => p.discount],
    ['Reserva preferencial', p => <Check on={p.priority} />], ['Beneficio en el café', p => p.cafe], ['Eventos exclusivos', p => <Check on={p.events} />],
    ['Congelamiento', () => 'Hasta 30 días/año'], ['Precio mensual', p => p.price],
  ];
  return <div className={s.tableScroll}>
    <table className={s.table}>
      <thead><tr><th scope="col">Incluye</th>{PLANS.map(p => <th key={p.k} scope="col" style={{ '--c': `var(--build-${p.color})` } as Vars}>{p.name}</th>)}</tr></thead>
      <tbody>{rows.map(([l, f]) => <tr key={l}><td>{l}</td>{PLANS.map(p => <td key={p.k}>{f(p)}</td>)}</tr>)}</tbody>
    </table>
  </div>;
}

export function MembershipScreen() {
  const { say } = useSite();
  // Simulated (Fase 1–3 prototype): confirmation only, follow-up by WhatsApp.
  const pick = (p: Plan) => say('Elegiste ' + p.name + '. Te escribimos por WhatsApp para completar tu membresía.');
  return <div className={s.page}>
    <Wrap className={s.heroWrap}>
      <div className={s.hero}>
        <Shape name="04" size={140} sizeMobile={80} color="var(--build-orange)" className={s.heroShapeA} />
        <Shape name="39" size={120} sizeMobile={70} color="var(--build-beige)" className={s.heroShapeB} />
        <Eyebrow color="var(--build-ink)">Membresía</Eyebrow>
        <h1 className={s.heroTitle}>Ser parte de la comunidad <b>Build</b></h1>
        <p className={s.heroText}>Volvé cada semana, cada vez por una razón distinta. Nos construimos con vos.</p>
      </div>
    </Wrap>

    <Wrap className={s.block}>
      <div className={s.h2Gap}><H2>Elegí <Em>tu plan</Em></H2></div>
      <Carousel min={300} cols="repeat(3,minmax(0,1fr))" gap={20}>{PLANS.map(p => <PlanCard key={p.k} p={p} onPick={pick} />)}</Carousel>
    </Wrap>

    <Wrap className={s.block}>
      <div className="desktop-only">
        <div className={s.h2Gap}><H2>Comparar <Em>planes</Em></H2></div>
        <CompareTable />
      </div>
      <div className="mobile-only"><Accordion items={[['Comparar planes', <CompareTable key="t" />]]} /></div>
    </Wrap>

    <Wrap className={cx(s.block, s.policies)}>
      <div className={s.policiesIntro}><H2>Políticas</H2><p className={s.policiesText}>Claras y flexibles, para que la membresía se adapte a tu familia.</p></div>
      <Accordion items={POLICIES} />
    </Wrap>
  </div>;
}
