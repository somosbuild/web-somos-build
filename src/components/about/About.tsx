'use client';

import type { CSSProperties } from 'react';
import s from './about.module.css';
import { Button, Icon, PillarTag, Shape } from '@/components/ds';
import { FacCard } from '@/components/activities/Activities';
import { Testimonials } from '@/components/home/Home';
import { Em, Eyebrow, H2, ImageSlot, PageTitle, SectionHead, StickyTabs, Wrap, anchorClass } from '@/components/site/shared';
import { ADDRESS, FAC, HOURS, LOCATION, PILLARS, onColorInk, type BrandColor } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
const bg = (c: string): Vars => ({ '--bg': c.startsWith('var(') ? c : `var(--build-${c})` });

const SECTIONS = [
  { id: 'quienes', label: 'Quiénes somos' }, { id: 'metodo', label: 'El método' }, { id: 'espacio', label: 'El espacio' },
  { id: 'seguridad', label: 'Seguridad' }, { id: 'facilitadores', label: 'Facilitadores' }, { id: 'familias', label: 'Familias' }, { id: 'llegar', label: 'Cómo llegar' },
];
const SPACES: [string, string, string, BrandColor][] = [
  ['01', 'Sala flexible', 'Se adapta a talleres, juego libre o encuentros.', 'orange'], ['37', 'Zona de lactancia', 'Un rincón tranquilo y privado.', 'celeste'],
  ['21', 'Área de juego', 'Piso acolchado y materiales por edad.', 'yellow'], ['50', 'Espacio seguro', 'Protocolos claros, papás presentes.', 'olive'],
  ['23', 'Sandbox', 'Arena, texturas y juego libre para explorar.', 'yellow'], ['34', 'Café', 'Para conversar mientras los peques juegan cerca.', 'orange'],
];
const SAFETY: [string, string, string][] = [
  ['50', 'Protocolos claros, papás presentes', 'Todas las actividades son con papás o cuidadores. Build no es una guardería.'],
  ['52', 'Limpieza y desinfección', 'Superficies, juguetes y colchonetas se limpian entre cada sesión.'],
  ['07', 'Capacidad máxima', 'Cupos limitados por actividad para que cada familia tenga su espacio.'],
  ['21', 'Materiales por edad', 'Seleccionados y revisados para cada etapa, de 0 a 5 años.'],
];
const METHOD: [string, string, string, BrandColor][] = [
  ['35', 'Elegimos con intención', 'Cada experiencia responde a una necesidad real de las familias en una etapa concreta.', 'orange'],
  ['29', 'Equilibramos', 'Juego, aprendizaje y conexión en la misma semana, para papás y para peques.', 'yellow'],
  ['07', 'Acompañamos', 'Facilitadores especializados y un equipo que conoce a cada familia por su nombre.', 'celeste'],
];
const FACS = ['Laura V.', 'Ana M.', 'Diego R.', 'Sofía P.', 'Dr. Mora', 'Carla J.'].map(k => FAC[k]);

const Chips = ({ items, className }: { items: string[]; className?: string }) =>
  <div className={cx(s.chips, className)}>{items.map(x => <span key={x} className={s.chip}>{x}</span>)}</div>;

function Pillars() {
  return <div className={s.pillars}>
    {PILLARS.map((p, i) => {
      const main = i === 0;
      return <div key={p.k} className={cx(s.pillar, main && s.pillarMain)} style={{ ...bg(p.color), '--fg': onColorInk(p.color) ? 'var(--build-ink)' : '#fff' } as Vars}>
        <Shape name={p.shape} size={main ? 88 : 60} sizeMobile={48} color="var(--build-beige)" />
        <div className={s.pillarCol}>
          <h3 className={s.pillarName}>{p.name}</h3>
          <span className={s.pillarTag}>{p.tag}</span>
          <span className={s.pillarText}>{p.text}</span>
          <Chips items={p.examples} className={main ? 'mobile-only' : undefined} />
        </div>
        {main && <div className={cx(s.pillarCol, 'desktop-only')}>
          <span className={s.pillarExtra}>Community es el corazón de Build: la red de papás que se acompañan, comparten y crecen juntos. Todos los demás pilares se construyen sobre ella.</span>
          <Chips items={p.examples} />
        </div>}
      </div>;
    })}
  </div>;
}

export function AboutScreen() {
  const contact: [string, string, string][] = [
    ['20', 'Dirección', `${ADDRESS} · ${LOCATION.local}`], ['58', 'Parqueo', LOCATION.parking], ['19', 'Horario', HOURS],
    ['42', 'WhatsApp', LOCATION.phone], ['39', 'Correo', LOCATION.email],
  ];
  return <div className={s.page}>
    <Wrap className={s.intro}><PageTitle>Nosotros</PageTitle></Wrap>
    <StickyTabs items={SECTIONS} />

    <Wrap className={s.body}>
      <section id="quienes" className={cx(s.who, anchorClass)}>
        <div className={s.whoText}>
          <Eyebrow>Quiénes somos</Eyebrow>
          <H2>Build nace de una convicción: la familia <Em>se construye.</Em></H2>
          <p className={s.p}>El desarrollo de la familia, la comunidad y nuestros hijos no ocurre por casualidad. Cada experiencia, cada juego, cada interacción y cada aprendizaje se convierten en los cimientos sobre los que crecen la confianza, la creatividad y las conexiones.</p>
          <p className={cx(s.p, s.pMuted)}>[Historia corta de los fundadores: quiénes son, qué buscaban cuando fueron papás y por qué crearon Build en Santa Ana.]</p>
        </div>
        <div className={s.photoSquare}><ImageSlot placeholder="Foto: fundadores de Build" /></div>
      </section>

      <section className={s.pad}>
        <div className={s.withYou}>
          <Shape name="68" size={220} sizeMobile={110} color="rgba(252,243,234,.25)" className={s.withYouShape} />
          <h2 className={s.withYouTitle}>Nos construimos <b>con vos.</b></h2>
          <p className={s.withYouText}>Build crece junto con sus familias. Escuchamos lo que necesitás en cada etapa y lo convertimos en nuevas experiencias en la agenda.</p>
          <span className="desktop-only"><PillarTag pillar="community" size="md" label="BUILDING COMMUNITY TOGETHER" className={s.withYouTag} /></span>
          <span className="mobile-only"><PillarTag pillar="community" size="sm" label="BUILDING COMMUNITY TOGETHER" className={s.withYouTag} /></span>
        </div>
      </section>

      <section className={s.pad}>
        <SectionHead title={<>Los cuatro <Em>pilares</Em></>} />
        <Pillars />
      </section>

      <section id="metodo" className={cx(s.pad, anchorClass)}>
        <SectionHead title={<>El <Em>método</Em></>} />
        <div className={s.grid3}>
          {METHOD.map(([ic, t, d, c]) => <div key={t} className={s.card}>
            <span className={s.tile} style={bg(c)}><Icon name={ic} size={30} color="var(--build-beige)" /></span>
            <h3 className={s.methodTitle}>{t}</h3>
            <span className={s.methodDesc}>{d}</span>
          </div>)}
        </div>
      </section>

      <section id="espacio" className={cx(s.pad, s.space, anchorClass)}>
        <div className={s.spaceText}>
          <H2>El <Em>espacio</Em></H2>
          <p className={s.lead}>Un centro con flexibilidad dentro del espacio para compartir en cada etapa de la crianza.</p>
          <div className={s.spaceGrid}>
            {SPACES.map(([ic, t, d, c]) => <div key={t} className={cx(s.card, s.spaceCard)}>
              <span className={cx(s.tile, s.spaceTile)} style={bg(c)}><Icon name={ic} size={28} color="var(--build-beige)" /></span>
              <div className={s.spaceTitle}>{t}</div>
              <div className={s.small}>{d}</div>
            </div>)}
          </div>
        </div>
        <div className={s.spacePhoto}><ImageSlot placeholder="Foto del espacio" /></div>
      </section>

      <section id="seguridad" className={cx(s.pad, anchorClass)}>
        <div className={s.safety}>
          <H2>Seguridad <b>y cuidado</b></H2>
          <div className={s.safetyGrid}>
            {SAFETY.map(([ic, t, d], i) => <div key={t} className={s.safetyItem}>
              <span className={cx(s.tile, s.safetyTile)} style={bg(i === 0 ? 'orange' : 'var(--build-celeste-deep)')}><Icon name={ic} size={26} color="var(--build-beige)" /></span>
              <div className={s.safetyText}><span className={s.safetyTitle}>{t}</span><span className={s.small}>{d}</span></div>
            </div>)}
          </div>
        </div>
      </section>

      <section id="facilitadores" className={cx(s.pad, anchorClass)}>
        <SectionHead title={<>Facilitadores <Em>y aliados</Em></>} />
        <div className={s.facs}>{FACS.map(f => <FacCard key={f.name} f={f} compactMobile />)}</div>
      </section>
    </Wrap>

    <div id="familias" className={cx(s.pad, anchorClass)}><Testimonials /></div>

    <Wrap>
      <section id="llegar" className={cx(s.reach, anchorClass)}>
        <div className={s.map}><ImageSlot placeholder="Mapa: City Place Santa Ana" /></div>
        <div className={s.reachInfo}>
          <H2>Cómo <Em>llegar</Em></H2>
          {contact.map(([ic, l, v]) => <div key={l} className={s.row}>
            <span className={s.rowIcon}><Icon name={ic} size={22} color="var(--build-orange)" /></span>
            <span className={s.rowText}><span className={s.rowLabel}>{l}</span><span className={s.rowValue}>{v}</span></span>
          </div>)}
          <div className={s.reachCtas}>
            <Button fullWidthMobile onClick={() => { window.location.href = LOCATION.waze; }}>Abrir en Waze</Button>
            <Button fullWidthMobile variant="secondary" onClick={() => { window.location.href = LOCATION.maps; }}>Google Maps</Button>
          </div>
        </div>
      </section>
    </Wrap>
  </div>;
}
