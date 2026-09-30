'use client';

import { useState, type CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import s from './home.module.css';
import { Button, Icon, Logo, Shape } from '@/components/ds';
import { Carousel, DayStrip, Em, EventCard, H2, ImageSlot, SectionHead, Wrap } from '@/components/site/shared';
import { useSite } from '@/components/site/SiteProvider';
import { EVENTS, PILLARS, TESTIMONIALS, ZONES, onColorInk, type DayKey, type Pillar } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

function Hero() {
  const router = useRouter();
  return <Wrap className={s.hero}>
    <div className={s.heroCopy}>
      <h1 className={s.heroTitle}>La familia no ocurre por casualidad, <b>se construye.</b></h1>
      <p className={s.heroLead}>Build es un family hub para papás en cada etapa, del embarazo a los primeros 5 años.</p>
      <div className={s.heroCtas}>
        <Button size="lg" fullWidthMobile onClick={() => router.push('/agenda/')}>Ver la agenda</Button>
        <Button size="lg" fullWidthMobile variant="secondary" onClick={() => router.push('/nosotros/')}>Conocer Build</Button>
      </div>
    </div>
    <div className={s.frame}>
      <div className={s.framePhoto}><ImageSlot placeholder="Foto cálida: niños / familia jugando" /></div>
      <div className={s.frameLogo}><Logo width="100%" /></div>
      <Shape name="04" size={70} sizeMobile={48} color="var(--build-orange)" className={cx(s.shape, s.s04)} />
      <Shape name="03" size={62} sizeMobile={42} color="var(--build-beige)" className={cx(s.shape, s.s03)} />
      <Shape name="02" size={58} sizeMobile={40} color="var(--build-celeste)" className={cx(s.shape, s.s02)} />
      <Shape name="01" size={54} sizeMobile={38} color="var(--build-olive)" className={cx(s.shape, s.s01)} />
    </div>
  </Wrap>;
}

function ThisWeek() {
  const router = useRouter();
  const { openEvent, reserveEvent } = useSite();
  const [day, setDay] = useState<DayKey | 'todos'>('todos');
  const list = EVENTS.filter(e => day === 'todos' || e.day === day).slice(0, 6);
  return <Wrap className={s.section}>
    <SectionHead title={<>Esta semana <Em>en Build</Em></>} link="Ver agenda completa" href="/agenda/" linkDesktopOnly />
    <div className={s.dayRow}><DayStrip value={day} onChange={setDay} /></div>
    {list.length
      ? <Carousel min={300} minMobile={290}>{list.map(e => <EventCard key={e.id} e={e} onOpen={openEvent} onReserve={reserveEvent} />)}</Carousel>
      : <div className={s.empty}>No hay actividades este día. Probá con otro.</div>}
    <Button variant="secondary" fullWidth className={cx(s.moreBtn, 'mobile-only')} onClick={() => router.push('/agenda/')}>Ver agenda completa</Button>
  </Wrap>;
}

function PillarCard({ p, featured }: { p: Pillar; featured: boolean }) {
  const router = useRouter();
  const v: Vars = { '--bg': `var(--build-${p.color})`, '--fg': onColorInk(p.color) ? 'var(--build-ink)' : 'var(--build-white)' };
  return <button onClick={() => router.push(`/agenda/?pillar=${p.k}`)} className={cx(s.pillar, featured && s.featured)} style={v}>
    <div className={s.pillarTop}>
      <Shape name={p.shape} size={featured ? 72 : 52} sizeMobile={52} color="var(--build-beige)" />
      <span className={s.pillarArrow} aria-hidden="true">→</span>
    </div>
    <div className={s.pillarName}>{p.name}</div>
    <div className={s.pillarText}>{p.text}</div>
    <div className={s.pillarEx}>
      <div className={s.pillarExInner}><div className={s.pillarChips}>
        {p.examples.slice(0, featured ? 4 : 3).map(x => <span key={x} className={s.pillarChip}>{x}</span>)}
      </div></div>
    </div>
  </button>;
}

function Pillars() {
  return <Wrap className={s.section}>
    <SectionHead title={<>Nuestros <Em>pilares</Em></>} />
    <div className={s.pillars}>{PILLARS.map((p, i) => <PillarCard key={p.k} p={p} featured={i === 0} />)}</div>
  </Wrap>;
}

function Spaces() {
  return <Wrap className={s.section}>
    <SectionHead title={<>Un espacio pensado <Em>para cada etapa</Em></>} link="Conocé el espacio" href="/nosotros/#espacio" />
    <Carousel min={200} minMobile={250} cols="repeat(5,minmax(0,1fr))">
      {ZONES.map(z => <div key={z.k} className={s.zone}>
        <div className={s.zonePhoto}>
          <ImageSlot placeholder={'Foto: ' + z.name} />
          <span className={s.zoneIcon} style={{ '--bg': `var(--build-${z.color})` } as Vars}><Icon name={z.icon} size={24} color="var(--build-beige)" /></span>
        </div>
        <h3 className={s.zoneName}>{z.name}</h3>
        <div className={s.zoneText}>{z.text}</div>
      </div>)}
    </Carousel>
  </Wrap>;
}

const PERKS: [string, string][] = [['04', 'Actividades incluidas cada mes'], ['15', 'Reserva preferencial en la agenda'], ['34', 'Beneficios en el café y eventos exclusivos']];

function MembershipTeaser() {
  const router = useRouter();
  const cta = (className: string) => <Button size="lg" className={className} fullWidthMobile onClick={() => router.push('/membresia/')}>Ver membresías</Button>;
  return <Wrap className={s.section}>
    <div className={cx(s.promo, s.membership)}>
      <Shape name="39" size={150} sizeMobile={90} color="var(--build-orange)" className={s.membershipShape} />
      <div className={s.promoCopy}>
        <span className={s.eyebrow}>Membresía</span>
        <H2>Sé parte de <b>la comunidad Build</b></H2>
        <p className={s.promoText}>Una membresía para volver cada semana, cada vez por una razón distinta.</p>
        <div className="desktop-only">{cta('')}</div>
      </div>
      <div className={s.perks}>
        {PERKS.map(([i, t]) => <div key={t} className={s.perk}><span className={s.perkIcon}><Icon name={i} size={22} color="var(--build-beige)" /></span><span className={s.perkText}>{t}</span></div>)}
      </div>
      {cta('mobile-only')}
    </div>
  </Wrap>;
}

const QUOTE_COLORS = ['orange', 'celeste', 'olive'];

export function Testimonials({ className }: { className?: string }) {
  return <Wrap className={cx(s.section, className)}>
    <SectionHead title={<>Familias <Em>Build</Em></>} />
    <Carousel min={280} minMobile={290} cols="repeat(3,minmax(0,1fr))">
      {TESTIMONIALS.map((t, i) => <figure key={t.id} className={s.quote}>
        <Shape name="02" size={28} color={`var(--build-${QUOTE_COLORS[i]})`} />
        <blockquote className={s.quoteText}>“{t.quote}”</blockquote>
        <figcaption className={s.quoteBy}>
          <span className={s.avatar}><ImageSlot placeholder="Foto" circle /></span>
          <span className={s.quoteWho}><b className={s.quoteName}>{t.name}</b><span className={s.quoteStage}>{t.stage}</span></span>
        </figcaption>
      </figure>)}
    </Carousel>
  </Wrap>;
}

function BirthdayTeaser() {
  const router = useRouter();
  return <Wrap className={cx(s.section, s.lastSection)}>
    <div className={cx(s.promo, s.birthday)}>
      <div className={s.birthdayCopy}>
        <span className={s.eyebrow}>Cumpleaños de 1 a 5 años</span>
        <H2>Celebrá en Build, <b>en familia</b></H2>
        <p className={s.promoText}>Paquetes con juego, espacio y todo listo para que vos solo disfrutés.</p>
      </div>
      <div className={s.birthdayShapes}>
        <Shape name="57" size={56} color="var(--build-yellow)" /><Shape name="52" size={72} color="var(--build-orange)" /><Shape name="62" size={60} color="var(--build-beige)" />
      </div>
      <Button size="lg" variant="sunny" fullWidthMobile onClick={() => router.push('/cumpleanos/')}>Cotizá tu fiesta</Button>
    </div>
  </Wrap>;
}

export function HomeScreen() {
  return <><Hero /><ThisWeek /><Pillars /><Spaces /><MembershipTeaser /><Testimonials /><BirthdayTeaser /></>;
}
