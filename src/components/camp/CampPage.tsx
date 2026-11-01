'use client';

import { useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { Button, ButtonLink, Checkbox, Dialog, Icon, Input, Logo, PillarTag, Select, Shape, Toast } from '@/components/ds';
import { asset } from '@/lib/asset';
import { CAMP, EDADES, FOTO, HORARIO, LUGAR, RANGO, WA_LINK, color, crc, grupoPorEdad, isPh, tituloPartes } from '@/lib/camp';
import { BarraAnuncio } from './CampPromo';
import { ContactoFooter, Cronograma, FotoPlaceholder, GrupoCard, GrupoChip, PrecioBloque, SelloPronto, useInscripciones } from './parts';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const NAV: [string, string][] = [['#que-es', 'El camp'], ['#grupos', 'Grupos'], ['#precios', 'Precios'], ['#faq', 'Preguntas']];

// Public FAQ: pending answers are hidden; the single-day price comes from the price list;
// `temas` and `llevar` answer with a list built from the weeks / what-to-bring data.
const FAQ = CAMP.faq
  .map(x => {
    let r = x.r ?? '', list: string[] | null = null;
    if (x.temas) { r = 'Cada semana tiene su propio tema. Podés venir a una o a todas.'; list = CAMP.semanas.map(w => `${w.tema} · ${w.fechas_corto}`); }
    if (x.llevar) { r = ''; list = CAMP.que_llevar; }
    if (x.pendiente_precio) r = `Sí, a ${crc(CAMP.precios.dia_suelto.precio)}. ${CAMP.precios.dia_suelto.condicion}.`;
    return { p: x.p, r, list, pend: !!x.pendiente || isPh(r) };
  })
  .filter(x => !x.pend);

/** Bolds the brand name inside a paragraph ("En BUILD creemos…"). */
const brand = (text: string) => text.split(/(BUILD)/).map((part, i) => part === 'BUILD' ? <strong key={i}>BUILD</strong> : part);

const Eyebrow = ({ children, c }: { children: string; c?: string }) => <span className={s.eyebrow} style={c ? { '--c': c } as Vars : undefined}>{children}</span>;

export function CampPage() {
  const insc = useInscripciones();
  const [formOpen, setFormOpen] = useState(false);
  const [toast, setToast] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const openForm = () => setFormOpen(true);
  const say = (t: string) => { setToast(t); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(''), 6000); };
  const tag = tituloPartes(CAMP.camp.tagline);
  const { que_es: queEs, manifiesto } = CAMP.camp;

  const Cta = ({ size }: { size: 'sm' | 'lg' }) => insc.mode === 'form'
    ? <Button size={size} onClick={openForm}>{insc.label}</Button>
    : <ButtonLink size={size} href={insc.href} target="_blank" rel="noopener noreferrer">{insc.label}</ButtonLink>;

  return <div className={s.page}>
    <BarraAnuncio variant="camp" onCta={openForm} />

    <header className={s.header}>
      <div className={s.headerRow}>
        <Link href="/" aria-label="Build, inicio" className={s.headerLogo}><Logo width={118} /></Link>
        <nav aria-label="Secciones" className={s.nav}>{NAV.map(([href, label]) => <a key={href} href={href} className={s.navLink}>{label}</a>)}</nav>
        <div className={s.headerCta}><Cta size="sm" /></div>
      </div>
    </header>

    <main>
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <PillarTag pillar="community" />
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
          <h2 className={s.aboutTitle}>{queEs.titulo}</h2>
          {queEs.parrafos.map(p => <p key={p} className={s.aboutText}>{p}</p>)}
        </div>
      </section>

      <section id="grupos" className={cx(s.wrap, s.stack)}>
        <div className={s.head}>
          <Eyebrow c="var(--build-celeste-deep)">Los 3 grupos</Eyebrow>
          <h2 className={s.h2}>Un camp para <strong>cada edad</strong></h2>
          <div className={s.limited}><span>Cupos limitados</span></div>
        </div>
        <div className={s.grid320}>{CAMP.grupos.map(g => <GrupoCard key={g.id} id={g.id} />)}</div>
      </section>

      <section id="manifiesto" className={s.orange}>
        <div className={s.manifesto}>
          <div className={s.manifestoText}>
            <h2 className={s.manifestoTitle}>{manifiesto.titulo}</h2>
            {manifiesto.parrafos.map(p => <p key={p} className={s.manifestoP}>{brand(p)}</p>)}
          </div>
          <div id="un-dia" className={cx(s.card, s.panel)}>
            <h2 className={s.panelTitle}>Un día <strong>en el camp</strong></h2>
            <Cronograma tipo="dia" dot={color('skills')} />
          </div>
        </div>
      </section>

      <section id="precios" className={s.white}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={s.head}>
            <Eyebrow c="var(--build-orange-deep)">Precios</Eyebrow>
            <h2 className={s.h2}>Precios y <strong>paquetes</strong></h2>
          </div>
          <PrecioBloque minCol={200} diaAbajo />
        </div>
      </section>

      <section id="faq" className={s.faqSection}>
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
      {open === i && <div className={s.faqA}>
        {f.r && <p>{f.r}</p>}
        {f.list && <ul className={s.faqList2}>{f.list.map(li => <li key={li}><span className={s.bullet} />{li}</li>)}</ul>}
      </div>}
    </div>)}
  </div>;
}

/** "Avisame cuando abran". Submissions go to Netlify Forms (form "camp-interes", declared in public/__forms.html). */
const PLANES = ['Diciembre: 2 semanas', 'Enero: 4 semanas', 'Camp completo: 6 semanas', 'Semanas variadas: Por definir'];
/** How many children: "3+" collects 3 and Build follows up for the rest. */
const CANTIDADES = [{ value: '1', n: 1 }, { value: '2', n: 2 }, { value: '3+', n: 3 }];
const EDAD_OPTS = Array.from({ length: CAMP.camp.edades.max - CAMP.camp.edades.min + 1 }, (_, i) => {
  const e = CAMP.camp.edades.min + i;
  return { value: String(e), label: `${e} años` };
});
type Nino = { nombre: string; edad: string };
const NINO_VACIO: Nino = { nombre: '', edad: '' };

function InteresForm({ onClose, onSent }: { onClose: () => void; onSent: () => void }) {
  const [f, setF] = useState({ nombre: '', whatsapp: '', email: '', plan: '' });
  const [cantidad, setCantidad] = useState('1');
  // Kept for all 3 slots, so lowering the count and raising it again doesn't lose what was typed.
  const [ninos, setNinos] = useState<Nino[]>([NINO_VACIO, NINO_VACIO, NINO_VACIO]);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const n = CANTIDADES.find(c => c.value === cantidad)!.n;
  const visibles = ninos.slice(0, n);
  const invalid = !f.nombre.trim() || f.whatsapp.replace(/\D/g, '').length < 8 || visibles.some(k => !k.nombre.trim() || !k.edad);
  const setNino = (i: number, patch: Partial<Nino>) => setNinos(list => list.map((k, j) => (j === i ? { ...k, ...patch } : k)));

  const submit = async () => {
    if (invalid) return;
    setSending(true); setFailed(false);
    // Only the visible children are sent; the group is sent already resolved for the Netlify panel.
    const data: Record<string, string> = { 'form-name': 'camp-interes', nombre: f.nombre, whatsapp: f.whatsapp, email: f.email, plan: f.plan, ninos: cantidad };
    visibles.forEach((k, i) => {
      data[`nino${i + 1}_nombre`] = k.nombre.trim();
      data[`nino${i + 1}_edad`] = k.edad;
      data[`nino${i + 1}_grupo`] = grupoPorEdad(Number(k.edad))?.nombre ?? '';
    });
    try {
      const res = await fetch(asset('/__forms.html'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      onSent();
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  // Buttons live in the dialog's fixed footer (always visible); `form` links the submit button to the form.
  return <Dialog onClose={onClose} title="Registrate al camp" accent="var(--build-orange)" width={520}
    actions={<>
      <Button variant="ghost" onClick={onClose}>Ahora no</Button>
      <Button type="submit" form="camp-interes-form" disabled={invalid || sending}>{sending ? 'Enviando…' : 'Avisame'}</Button>
    </>}>
    <form id="camp-interes-form" className={s.form} onSubmit={e => { e.preventDefault(); submit(); }}>
      <p className={s.formIntro}>Las inscripciones abren el {CAMP.inscripciones.abren_texto}. Dejanos tus datos y te escribimos ese día.</p>
      <Input label="Tu nombre" name="nombre" required autoComplete="name" value={f.nombre} onChange={e => setF({ ...f, nombre: e.target.value })} autoFocus />
      <Input label="WhatsApp" name="whatsapp" type="tel" required placeholder="8888-8888" autoComplete="tel" value={f.whatsapp} onChange={e => setF({ ...f, whatsapp: e.target.value })} />
      <Input label="Email (opcional)" name="email" type="email" placeholder="nombre@correo.com" autoComplete="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />

      <fieldset className={s.fieldset}>
        <legend className={s.legend}>¿Cuántos niños querés registrar?</legend>
        <div className={s.qty} role="radiogroup" aria-label="Cantidad de niños">
          {CANTIDADES.map(c => <button key={c.value} type="button" role="radio" aria-checked={cantidad === c.value}
            className={cx(s.qtyBtn, cantidad === c.value && s.qtyOn)} onClick={() => setCantidad(c.value)}>{c.value}</button>)}
        </div>
      </fieldset>

      {visibles.map((k, i) => {
        const g = k.edad ? grupoPorEdad(Number(k.edad)) : null;
        return <fieldset key={i} className={s.kid}>
          <legend className={s.kidTitle}>Niño {i + 1}</legend>
          <div className={s.kidFields}>
            <Input label="Nombre" name={`nino${i + 1}_nombre`} required value={k.nombre} onChange={e => setNino(i, { nombre: e.target.value })} />
            <Select label="Edad" name={`nino${i + 1}_edad`} required options={EDAD_OPTS} placeholder="Elegí" value={k.edad} onChange={e => setNino(i, { edad: e.target.value })} />
          </div>
          {g && <div className={s.kidGroup}><span>Grupo:</span><GrupoChip id={g.id} size="sm" /></div>}
        </fieldset>;
      })}
      {cantidad === '3+' && <p className={s.kidNote}>Si son más de 3, te contactamos para completar el registro.</p>}

      <fieldset className={s.fieldset}>
        <legend className={s.legend}>¿Qué te interesa?</legend>
        {/* One choice at most; tapping the selected option clears it (as in the design). */}
        {PLANES.map(p => <Checkbox key={p} checked={f.plan === p} onChange={() => setF({ ...f, plan: f.plan === p ? '' : p })} label={p} />)}
      </fieldset>
      {failed && <p className={s.formError} role="alert">No pudimos enviar tus datos. Probá de nuevo o escribinos por WhatsApp.</p>}
    </form>
  </Dialog>;
}
