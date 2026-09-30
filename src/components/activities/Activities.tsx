'use client';

import { useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import s from './activities.module.css';
import { Badge, Button, Card, Icon, Shape } from '@/components/ds';
import { Accordion, Carousel, Em, EventCard, Eyebrow, H2, ImageSlot, PageTitle, SectionHead, StickyTabs, Tag, Wrap, anchorClass, scrollToId } from '@/components/site/shared';
import { useSite } from '@/components/site/SiteProvider';
import { EVENTS, FAC, FAQ, MEMBER, PILLARS, STEPS, aboutOf, dayOf, isPillar, onColorInk, pillarOf, type BuildEvent, type Facilitator } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
const pillarVars = (e: BuildEvent): Vars => ({ '--bg': `var(--build-${pillarOf(e.pillar).color})` });

export function FacCard({ f, compactMobile }: { f: Facilitator; compactMobile?: boolean }) {
  return <div className={cx(s.fac, compactMobile && s.facCompact)}>
    <span className={s.facPhoto}><ImageSlot placeholder="Foto" circle /></span>
    <div className={s.facText}><span className={s.facName}>{f.name}</span><span className={s.facRole}>{f.role}</span></div>
  </div>;
}

export function CatalogCard({ e }: { e: BuildEvent }) {
  return <Link href={`/actividades/${e.id}/`} className={s.cardLink}>
    <Card interactive padding={20} className={s.cardLink} media={<div className={s.catMedia} style={pillarVars(e)}><ImageSlot placeholder="Foto" /></div>}>
      <Badge color="greige" className={s.selfStart}>{e.stage}</Badge>
      <h3 className={s.catTitle}>{e.title}</h3>
      <div className={s.catDesc}>{e.desc}</div>
      <span className={s.catMore}>Ver actividad →</span>
    </Card>
  </Link>;
}

/** Catalogue grouped by pillar. `?pillar=` scrolls to that pillar. */
export function ActivitiesScreen() {
  const pillar = useSearchParams().get('pillar');
  useEffect(() => { if (isPillar(pillar)) setTimeout(() => scrollToId('pilar-' + pillar), 60); }, [pillar]);
  return <div className={s.index}>
    <Wrap className={s.intro}>
      <PageTitle sub="Todo lo que ofrecemos, organizado por pilar. Para ver cuándo, andá a la Agenda.">Nuestras <b>actividades</b></PageTitle>
    </Wrap>
    <StickyTabs items={PILLARS.map(p => ({ id: 'pilar-' + p.k, label: p.name, color: p.color }))} />
    <Wrap className={s.pillars}>
      {PILLARS.map(p => <section key={p.k} id={'pilar-' + p.k} className={cx(s.pillarSection, anchorClass)}>
        <div className={s.pillarCard} style={{ '--bg': `var(--build-${p.color})`, '--fg': onColorInk(p.color) ? 'var(--build-ink)' : '#fff' } as Vars}>
          <Shape name={p.shape} size={60} sizeMobile={44} color="var(--build-beige)" />
          <div className={s.pillarText}><h2 style={{ margin: 0 }} className={s.pillarName}>{p.name}</h2><span className={s.pillarDesc}>{p.text}</span></div>
        </div>
        <div className={s.catGrid}>{EVENTS.filter(e => e.pillar === p.k).map(e => <CatalogCard key={e.id} e={e} />)}</div>
      </section>)}
    </Wrap>
  </div>;
}

export function ActivityPage({ id }: { id: string }) {
  const { openEvent, reserveEvent } = useSite();
  const e = EVENTS.find(x => x.id === id) ?? EVENTS[0];
  const p = pillarOf(e.pillar);
  const d = dayOf(e.day);
  const related = EVENTS.filter(x => x.pillar === e.pillar && x.id !== e.id).slice(0, 3);
  const cta = e.spots ? 'Reservar' : 'Lista de espera';
  const meta: [string, string][] = [['04', e.stage], ['19', e.dur], ['16', e.price]];

  return <div className={s.page}>
    <Wrap className={s.back}><Link href="/actividades/" className={s.backLink}>← Actividades</Link></Wrap>

    <Wrap className={s.hero}>
      <div className={s.heroCopy}>
        <span className="desktop-only"><Tag pillar={e.pillar} size="md" /></span>
        <span className="mobile-only"><Tag pillar={e.pillar} size="sm" /></span>
        <h1 className={s.title}>{e.title}</h1>
        <div className={s.meta}>{meta.map(([i, t]) => <span key={t} className={cx(s.metaChip, t === MEMBER && s.metaMember)}><Icon name={i} size={18} color="var(--build-orange)" />{t}</span>)}</div>
        <div className={cx(s.heroCtas, 'desktop-only')}>
          <Button size="lg" onClick={() => reserveEvent(e)}>{cta}</Button>
          <Button size="lg" variant="secondary" onClick={() => scrollToId('fechas')}>Ver próximas fechas</Button>
        </div>
      </div>
      <div className={s.frame} style={pillarVars(e)}>
        <div className={s.framePhoto}><ImageSlot placeholder={'Foto principal: ' + e.title} /></div>
        <Shape name={p.shape} size={70} sizeMobile={48} color="var(--build-beige)" className={s.frameShape} />
      </div>
    </Wrap>

    <Wrap className={cx(s.block, s.what)}>
      <div className={s.whatText}>
        <H2>Qué es y <Em>qué desarrolla</Em></H2>
        {aboutOf(e).map((t, i) => <p key={i} className={s.para}>{t}</p>)}
      </div>
      <div className={s.side}><Eyebrow>Facilitador</Eyebrow><FacCard f={FAC[e.fac]} /></div>
    </Wrap>

    <Wrap className={s.block}>
      <div className={s.h2Gap}><H2>Cómo es <Em>una sesión</Em></H2></div>
      <div className={s.steps}>
        {STEPS[e.pillar].map(([ic, t, desc], i) => <div key={t} className={s.step}>
          <span className={s.stepIcon} style={pillarVars(e)}><Icon name={ic} size={30} sizeMobile={26} color="var(--build-beige)" /><span className={s.stepNum}>{i + 1}</span></span>
          <div className={s.stepText}><span className={s.stepTitle}>{t}</span><span className={s.stepDesc}>{desc}</span></div>
        </div>)}
      </div>
    </Wrap>

    <Wrap className={s.block}>
      <div id="fechas" className={cx(s.h2Gap, anchorClass)}><H2>Próximas <Em>fechas</Em></H2></div>
      <div className={s.dates}>
        <EventCard e={e} onOpen={openEvent} onReserve={reserveEvent} compactMobile />
        {['Próxima semana', 'En dos semanas'].map(t => <div key={t} className={s.dateSoon}>
          <Badge color="greige" className={s.selfStart}>{t} · {d.name} {e.time}</Badge>
          <span className={s.dateSoonText}>Las reservas abren el lunes anterior.</span>
        </div>)}
      </div>
    </Wrap>

    <Wrap className={cx(s.block, s.faq)}>
      <H2>Preguntas <Em>frecuentes</Em></H2>
      <Accordion items={FAQ} />
    </Wrap>

    {!!related.length && <Wrap className={s.block}>
      <SectionHead title={<>Más de <Em>{p.name}</Em></>} link="Ver todas" href={`/actividades/?pillar=${p.k}`} />
      <Carousel min={280} cols="repeat(3,minmax(0,1fr))">{related.map(r => <CatalogCard key={r.id} e={r} />)}</Carousel>
    </Wrap>}

    <div className={s.bar}>
      <div className={s.barText}><span className={s.barTitle}>{e.title}</span><span className={s.barMeta}>{d.name} {e.time} · {e.price}</span></div>
      <Button onClick={() => reserveEvent(e)}>{cta}</Button>
    </div>
  </div>;
}
