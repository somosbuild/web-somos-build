'use client';

import { useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { Badge, Button, ButtonLink, Checkbox, Dialog, Icon, Input, Logo, PillarTag, Shape, Toast } from '@/components/ds';
import { asset } from '@/lib/asset';
import { CAMP, EDADES, GRUPO_SHAPE, HORARIO, LUGAR, RANGO, WA_LINK, color, crc, grupo, isPh, tituloPartes } from '@/lib/camp';
import { BarraAnuncio } from './CampPromo';
import { ContactoFooter, Cronograma, FotoPlaceholder, GrupoCard, GrupoChip, PinoBloques, PrecioBloque, SelloPronto, SemanaCard, Snow, useInscripciones } from './parts';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const NAV: [string, string][] = [['#grupos', 'Grupos'], ['#semana', 'Un día'], ['#semanas', 'Semanas'], ['#viernes', 'Viernes'], ['#seguridad', 'Seguridad'], ['#precios', 'Precios'], ['#faq', 'Preguntas']];
const SEG_ICON = ['07', '43', '20', '50', '17', '23', '14'];
const EVENT_SNOW: [number, number, string, number][] = [[6, 12, '01', 14], [22, 58, '05', 8], [36, 18, '01', 10], [50, 66, '05', 6], [60, 10, '05', 9], [44, 40, '01', 8], [12, 78, '05', 7]];

// Public FAQ: pending answers are hidden; the single-day price comes from the price list.
const FAQ = CAMP.faq
  .map(x => ({ p: x.p, r: x.pendiente_precio ? `Sí, a ${crc(CAMP.precios.dia_suelto.precio)}. ${CAMP.precios.dia_suelto.condicion}.` : x.r, pend: !!x.pendiente || isPh(x.r) }))
  .filter(x => !x.pend);

const Eyebrow = ({ children, c }: { children: string; c?: string }) => <span className={s.eyebrow} style={c ? { '--c': c } as Vars : undefined}>{children}</span>;

export function CampPage() {
  const insc = useInscripciones();
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openForm = () => setFormOpen(true);
  const say = (t: string) => { setToast(t); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''), 6000); };
  const tag = tituloPartes(CAMP.camp.tagline);
  const v = CAMP.horario.viernes_en_familia;
  const n = CAMP.semanas.length;

  const Cta = ({ size }: { size: 'sm' | 'lg' }) => insc.mode === 'form'
    ? <Button size={size} onClick={openForm}>{insc.label}</Button>
    : <ButtonLink size={size} href={insc.href} target="_blank" rel="noopener noreferrer">{insc.label}</ButtonLink>;

  return <div className={s.page}>
    <BarraAnuncio variant="camp" onCta={openForm} />

    <header className={s.header}>
      <div className={s.headerRow}>
        <Link href="/" aria-label="Build, inicio"><Logo width={118} /></Link>
        <Cta size="sm" />
      </div>
      <nav aria-label="Secciones" className={s.nav}>{NAV.map(([href, label]) => <a key={href} href={href} className={s.navLink}>{label}</a>)}</nav>
    </header>

    <main>
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <PillarTag pillar="community" size="sm" />
          <h1 className={s.h1}>{tag.a} <strong>{tag.b}</strong></h1>
          <p className={s.heroFacts}>
            <span>{RANGO}</span><Shape name="58" size={7} color="var(--build-orange)" />
            <span>{EDADES}</span><Shape name="58" size={7} color="var(--build-orange)" />
            <span>{LUGAR}</span>
          </p>
          <p className={s.heroHours}>{HORARIO}</p>
          <div className={s.heroCtas}>
            <Cta size="lg" />
            <ButtonLink variant="secondary" size="lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">{CAMP.sitio.ctas.whatsapp}</ButtonLink>
          </div>
        </div>
        <div className={s.heroPhoto}>
          <FotoPlaceholder frame="yellow" ratio="4 / 5" desc="Niña de 5 años con casco dentro de una casa de cartón en la Plazoleta Build, luz de mañana">
            <Logo width={150} pillar="skills" />
          </FotoPlaceholder>
          {!insc.abiertas && <SelloPronto />}
        </div>
      </section>

      <section id="que-es" className={s.white}>
        <div className={s.about}>
          <Eyebrow c="var(--build-orange-deep)">Qué es</Eyebrow>
          <p className={s.aboutLead}>{CAMP.camp.descripcion_corta}</p>
          <p className={s.aboutNote}>{CAMP.camp.nota_familia}</p>
        </div>
      </section>

      <section id="grupos" className={cx(s.wrap, s.stack)}>
        <div className={s.head}>
          <Eyebrow c="var(--build-celeste-deep)">Los 3 grupos</Eyebrow>
          <h2 className={s.h2}>Un camp para <strong>cada edad</strong></h2>
        </div>
        <div className={s.grid320}>{CAMP.grupos.map(g => <GrupoCard key={g.id} id={g.id} />)}</div>
      </section>

      <section id="semana" className={s.days}>
        <div className={cx(s.card, s.panel)}>
          <h2 className={s.panelTitle}>Así es <strong>una semana</strong></h2>
          <Cronograma tipo="semana" dot={color('community')} />
        </div>
        <div className={cx(s.card, s.panel)}>
          <h2 className={s.panelTitle}>Un día <strong>en el camp</strong></h2>
          <Cronograma tipo="dia" dot={color('skills')} />
        </div>
      </section>

      <section id="semanas" className={s.yellow}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={s.head}>
            <Eyebrow>{RANGO}</Eyebrow>
            <h2 className={s.h2} style={{ '--c': 'var(--build-ink)' } as Vars}>{n} semanas, <strong>{n} aventuras</strong></h2>
            <p className={s.lead17}>Vení una semana o todas.</p>
          </div>
          <div className={s.grid330}>{CAMP.semanas.map(w => <SemanaCard key={w.n} sem={w} />)}</div>
        </div>
      </section>

      <section id="historias" className={cx(s.wrap, s.stack)}>
        <div className={s.head}>
          <Eyebrow c="var(--build-orange-deep)">Historias de temporada</Eyebrow>
          <h2 className={s.h2}>Una historia que <strong>sigue cada semana</strong></h2>
        </div>
        <div className={s.grid320}>
          {CAMP.historias_temporada.map(h => <article key={h.id} className={cx(s.card, s.story)}>
            <Shape name={GRUPO_SHAPE[h.grupo]} size={120} color={color(grupo(h.grupo).color)} className={s.abs} style={{ right: -30, top: -34 }} />
            <div className={s.rel} style={{ display: 'flex' }}><GrupoChip id={h.grupo} size="sm" /></div>
            <h3 className={s.storyTitle}>{h.nombre}</h3>
            <p className={s.p16}>{h.texto}</p>
          </article>)}
        </div>
      </section>

      <section id="viernes" className={s.celeste}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={s.head}>
            <Eyebrow>Viernes en familia</Eyebrow>
            <h2 className={s.h2} style={{ '--c': 'var(--build-ink)' } as Vars}>Los viernes, <strong>la familia entra</strong></h2>
            <p className={s.lead17}>{v.descripcion}</p>
          </div>
          <div className={cx(s.grid320, s.top)}>
            <div className={cx(s.card, s.friday)}>
              <Eyebrow c="var(--build-celeste-deep)">Cada viernes</Eyebrow>
              <h3 className={s.fridayTitle}>{v.inicio} a {v.fin}</h3>
              <Cronograma tipo="viernes" dot={color('family')} />
            </div>
            {CAMP.eventos.map(e => <article key={e.id} className={s.event} data-modo={e.modo}>
              <div className={s.eventHead}>
                {e.modo === 'navidad'
                  ? <><Snow points={EVENT_SNOW} /><PinoBloques size={80} pine="var(--build-beige)" style={{ right: 22, bottom: -6 }} /></>
                  : <Shape name="01" size={150} color="var(--build-beige)" className={s.abs} style={{ right: -30, bottom: -40 }} />}
                <span className={s.datePill}>{e.fecha_texto}</span>
                <h3 className={s.eventTitle}>{e.nombre}</h3>
              </div>
              <div className={s.eventBody}>
                <Cronograma tipo="evento" evento={e.id} dot={color('joy')} />
                {(e.nota || e.cierre) && <p className={s.eventExtra}>{e.nota || e.cierre}</p>}
                {e.abierto_al_publico && <Badge color="olive" className={s.selfStart}>Abierto al público</Badge>}
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="seguridad" className={cx(s.wrap, s.stack)}>
        <div className={s.head}>
          <Eyebrow c="var(--build-celeste-deep)">Seguridad</Eyebrow>
          <h2 className={s.h2}>Cuidamos <strong>cada detalle</strong></h2>
        </div>
        <div className={s.safetyGrid}>
          {CAMP.seguridad.map((x, i) => <div key={x.titulo} className={cx(s.card, s.safety)}>
            <span className={s.tile48}><Icon name={SEG_ICON[i] ?? '43'} size={26} color="var(--build-beige)" /></span>
            <h3 className={s.safetyTitle}>{x.titulo}</h3>
            <p className={s.p15m}>{x.texto}</p>
          </div>)}
        </div>
      </section>

      <section id="precios" className={s.white}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={s.head}>
            <Eyebrow c="var(--build-orange-deep)">Precios</Eyebrow>
            <h2 className={s.h2}>Precios y <strong>paquetes</strong></h2>
          </div>
          <PrecioBloque />
        </div>
      </section>

      <section id="faq" className={s.faqGrid}>
        <div className={s.bring}>
          <Shape name="52" size={120} color="var(--build-beige)" className={s.abs} style={{ right: -24, bottom: -30, transform: 'rotate(-10deg)' }} />
          <h2 className={s.h2sm}>Qué <strong>llevar</strong></h2>
          <ul className={s.bringList}>{CAMP.que_llevar.map(q => <li key={q}><span className={s.tick}><Icon name="43" size={16} color="var(--build-ink)" /></span><span>{q}</span></li>)}</ul>
        </div>
        <div className={s.faqCol}>
          <h2 className={s.h2sm} style={{ '--c': 'var(--build-orange)' } as Vars}>Preguntas <strong>frecuentes</strong></h2>
          <Faq />
        </div>
      </section>

      <section id="aliados" className={s.allies}>
        <div className={s.head}>
          <Eyebrow c="var(--build-orange-deep)">Aliados</Eyebrow>
          <h2 className={s.h2}>Con los vecinos <strong>de City Place</strong></h2>
        </div>
        <div className={s.allyGrid}>
          <div className={s.coBrand}>
            <Logo width={110} />
            <span className={s.plus}>+</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/brand/logos/cityplace.png')} alt="City Place, centro urbano, Santa Ana" width={304} height={65} className={s.cityLogo} />
          </div>
          {CAMP.aliados.lista.map(a => <div key={a.nombre} className={s.allyItem}><div className={s.allyName}>{a.nombre}</div><span className={s.allyRole}>{a.rol}</span></div>)}
        </div>
      </section>

      <section id="contacto" className={s.contact}>
        <ContactoFooter titulo={insc.abiertas ? '¿Confirmamos' : 'Te avisamos'} bold={insc.abiertas ? 'tu cupo?' : 'cuando abran'} cta={insc.label}
          onCta={insc.mode === 'form' ? openForm : undefined} ctaHref={insc.href} />
      </section>
    </main>

    {formOpen && <InteresForm onClose={() => setFormOpen(false)} onSent={() => { setFormOpen(false); say(`¡Listo! Te escribimos por WhatsApp el ${CAMP.inscripciones.abren_texto}.`); }} />}
    {toast && <div className={s.toast}><Toast tone="success" icon={<Icon name="43" size={18} color="var(--build-beige)" />} onClose={() => setToast('')}>{toast}</Toast></div>}
  </div>;
}

function Faq() {
  const [open, setOpen] = useState(0);
  return <div className={s.faqList}>
    {FAQ.map((f, i) => <div key={f.p} className={cx(s.faqItem, open === i && s.faqOpen)}>
      <button type="button" className={s.faqQ} aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><span>{f.p}</span><span className={s.faqPlus} aria-hidden="true">+</span></button>
      {open === i && <p className={s.faqA}>{f.r}</p>}
    </div>)}
  </div>;
}

/** "Avisame cuando abran". Submissions go to Netlify Forms (form "camp-interes", declared in public/__forms.html). */
function InteresForm({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [f, setF] = useState({ nombre: '', whatsapp: '', edades: '', semanas: [] as number[] });
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const invalid = !f.nombre.trim() || f.whatsapp.replace(/\D/g, '').length < 8;
  const toggle = (n: number) => setF(x => ({ ...x, semanas: x.semanas.includes(n) ? x.semanas.filter(y => y !== n) : [...x.semanas, n].sort((a, b) => a - b) }));

  const submit = async () => {
    if (invalid) return;
    setSending(true); setFailed(false);
    try {
      const res = await fetch(asset('/__forms.html'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'camp-interes', nombre: f.nombre, whatsapp: f.whatsapp, edades: f.edades, semanas: f.semanas.join(', ') }).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      onSent();
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return <Dialog onClose={onClose} title={CAMP.sitio.ctas.antes} accent="var(--build-orange)" width={520}>
    <form className={s.form} onSubmit={e => { e.preventDefault(); submit(); }}>
      <p className={s.formIntro}>Las inscripciones abren el {CAMP.inscripciones.abren_texto}. Dejanos tus datos y te escribimos ese día.</p>
      <Input label="Tu nombre" name="nombre" required autoComplete="name" value={f.nombre} onChange={e => setF({ ...f, nombre: e.target.value })} autoFocus />
      <Input label="WhatsApp" name="whatsapp" type="tel" required placeholder="8888-8888" autoComplete="tel" value={f.whatsapp} onChange={e => setF({ ...f, whatsapp: e.target.value })} />
      <Input label="Edades de tus hijos" name="edades" placeholder="Por ejemplo: 3 y 7" hint={`${EDADES}. Con eso te sugerimos el grupo.`} value={f.edades} onChange={e => setF({ ...f, edades: e.target.value })} />
      <fieldset className={s.fieldset}>
        <legend className={s.legend}>Semanas que te interesan</legend>
        {CAMP.semanas.map(w => <Checkbox key={w.n} checked={f.semanas.includes(w.n)} onChange={() => toggle(w.n)} label={`Semana ${w.n} · ${w.fechas_corto} · ${w.tema}`} />)}
      </fieldset>
      {failed && <p className={s.formError} role="alert">No pudimos enviar tus datos. Probá de nuevo o escribinos por WhatsApp.</p>}
      <div className={s.formActions}>
        <Button variant="ghost" onClick={onClose}>Ahora no</Button>
        <Button type="submit" disabled={invalid || sending}>{sending ? 'Enviando…' : 'Avisame'}</Button>
      </div>
    </form>
  </Dialog>;
}

