'use client';

import { useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { Button, ButtonLink, Checkbox, Dialog, Icon, Input, Logo, PillarTag, Shape, Toast } from '@/components/ds';
import { asset } from '@/lib/asset';
import { CAMP, EDADES, FOTO, HORARIO, LUGAR, RANGO, WA_LINK, color, crc, isPh, tituloPartes } from '@/lib/camp';
import { BarraAnuncio } from './CampPromo';
import { ContactoFooter, Cronograma, FotoPlaceholder, GrupoCard, PrecioBloque, SelloPronto, SemanaCard, useInscripciones } from './parts';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const NAV: [string, string][] = [['#grupos', 'Grupos'], ['#semana', 'Un día'], ['#semanas', 'Semanas'], ['#precios', 'Precios'], ['#faq', 'Preguntas']];

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
          <FotoPlaceholder frame="yellow" ratio="1 / 1" src={FOTO} desc="Niños construyendo una ciudad de cartón en la plazoleta de City Place">
            <Logo width={150} pillar="skills" />
          </FotoPlaceholder>
          {!insc.abiertas && <SelloPronto />}
        </div>
      </section>

      <section id="que-es" className={s.white}>
        <div className={s.about}>
          <Eyebrow c="var(--build-orange-deep)">Qué es</Eyebrow>
          <p className={s.aboutLead}>{CAMP.camp.descripcion_corta}</p>
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
        <ContactoFooter titulo="Construí tus vacaciones" bold="con nosotros" cta={insc.label}
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
const PLANES = ['Diciembre: 2 semanas', 'Enero: 4 semanas', 'Camp completo: 6 semanas', 'Semanas variadas: Por definir'];

function InteresForm({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [f, setF] = useState({ nombre: '', whatsapp: '', email: '', edades: '', plan: '' });
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const invalid = !f.nombre.trim() || f.whatsapp.replace(/\D/g, '').length < 8;

  const submit = async () => {
    if (invalid) return;
    setSending(true); setFailed(false);
    try {
      const res = await fetch(asset('/__forms.html'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'camp-interes', nombre: f.nombre, whatsapp: f.whatsapp, email: f.email, edades: f.edades, plan: f.plan }).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      onSent();
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return <Dialog onClose={onClose} title="Registrate al camp" accent="var(--build-orange)" width={520}>
    <form className={s.form} onSubmit={e => { e.preventDefault(); submit(); }}>
      <p className={s.formIntro}>Las inscripciones abren el {CAMP.inscripciones.abren_texto}. Dejanos tus datos y te escribimos ese día.</p>
      <Input label="Tu nombre" name="nombre" required autoComplete="name" value={f.nombre} onChange={e => setF({ ...f, nombre: e.target.value })} autoFocus />
      <Input label="WhatsApp" name="whatsapp" type="tel" required placeholder="8888-8888" autoComplete="tel" value={f.whatsapp} onChange={e => setF({ ...f, whatsapp: e.target.value })} />
      <Input label="Email (opcional)" name="email" type="email" placeholder="nombre@correo.com" autoComplete="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />
      <Input label="Edades de tus hijos" name="edades" placeholder="Por ejemplo: 3 y 7" hint={`${EDADES}. Con eso te sugerimos el grupo.`} value={f.edades} onChange={e => setF({ ...f, edades: e.target.value })} />
      <fieldset className={s.fieldset}>
        <legend className={s.legend}>¿Qué te interesa?</legend>
        {/* One choice at most; tapping the selected option clears it (as in the design). */}
        {PLANES.map(p => <Checkbox key={p} checked={f.plan === p} onChange={() => setF({ ...f, plan: f.plan === p ? '' : p })} label={p} />)}
      </fieldset>
      {failed && <p className={s.formError} role="alert">No pudimos enviar tus datos. Probá de nuevo o escribinos por WhatsApp.</p>}
      <div className={s.formActions}>
        <Button variant="ghost" onClick={onClose}>Ahora no</Button>
        <Button type="submit" disabled={invalid || sending}>{sending ? 'Enviando…' : 'Avisame'}</Button>
      </div>
    </form>
  </Dialog>;
}

