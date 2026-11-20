'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { Button, ButtonLink, Checkbox, Dialog, Input, Logo, PillarTag, Select, Shape } from '@/components/ds';
import { asset } from '@/lib/asset';
import { track } from '@/lib/analytics';
import { PLANES_PAGO, planPago, totalPago } from '@/lib/camp-pago';
import { CAMP, FOTO, WA_LINK, crc, grupoPorEdad, tituloPartes } from '@/lib/camp';
import PAGINA from '@/content/camp-pagina.json';
import { BarraAnuncio } from './CampPromo';
import { ContactoFooter, Cronograma, FotoPlaceholder, GrupoCard, GrupoChip, PrecioBloque, SelloPronto, useInscripciones } from './parts';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const NAV: [string, string][] = [['#fechas', 'Fechas'], ['#precios', 'Precios'], ['#grupos', 'Grupos'], ['#seguridad', 'Seguridad'], ['#preguntas', 'Preguntas']];

// FAQ next to the map: only the questions listed in camp-pagina.json (faq_portada), in that order.
// The single-day price comes from the price list; `llevar` answers with the what-to-bring list.
const FAQ = PAGINA.faq_portada
  .map(q => CAMP.faq.find(x => x.p === q))
  .filter((x): x is (typeof CAMP.faq)[number] => !!x)
  .map(x => {
    let r = x.r ?? '', list: string[] | null = null;
    if (x.temas) { r = 'Cada semana tiene su propio tema. Podés venir a una o a todas.'; list = CAMP.semanas.map(w => `${w.tema} · ${w.fechas_corto}`); }
    if (x.llevar) { r = ''; list = CAMP.que_llevar; }
    if (x.pendiente_precio) r = `Sí, a ${crc(CAMP.precios.dia_suelto.precio)}. ${CAMP.precios.dia_suelto.condicion}.`;
    return { p: x.p, r, list };
  });

/** Bolds the brand name inside a paragraph ("En BUILD creemos…"). */
const brand = (text: string) => text.split(/(BUILD)/).map((part, i) => part === 'BUILD' ? <strong key={i}>BUILD</strong> : part);

const Eyebrow = ({ children, c }: { children: string; c?: string }) => <span className={s.eyebrow} style={c ? { '--c': c } as Vars : undefined}>{children}</span>;
/** Pillar mark as a small icon: community = dots, skills = arrow, joy = asterisk, family = heart (brand shapes). */
const PILAR: Record<string, [string, string]> = {
  community: ['04', 'var(--build-orange)'], skills: ['03', 'var(--build-yellow)'], joy: ['01', 'var(--build-olive)'], family: ['02', 'var(--build-celeste)'],
};
const Pilar = ({ k, size = 26 }: { k: string; size?: number }) => { const [n, c] = PILAR[k] ?? PILAR.community; return <Shape name={n} size={size} color={c} className={s.pilarIcon} />; };

/** "8:00" -> "8:00am", "12:30" -> "12:30pm". */
const hora12 = (h: string) => { const [hh, mm] = h.split(':').map(Number); return `${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, '0')}${hh >= 12 ? 'pm' : 'am'}`; };

/* ---------- Calendar data: weeks by month, with the year-end break between them ---------- */
const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MES_LARGO = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const dia = (iso: string, delta = 0) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + delta); return d; };
const corto = (d: Date) => `${d.getUTCDate()} ${MES[d.getUTCMonth()]}`;
/** "7 – 11 dic" (or "29 dic – 2 ene" across months). */
const rangoSemana = (a: string, b: string) => { const x = dia(a), y = dia(b); return x.getUTCMonth() === y.getUTCMonth() ? `${x.getUTCDate()} – ${corto(y)}` : `${corto(x)} – ${corto(y)}`; };
const SEMANA_COLOR = ['var(--build-celeste)', 'var(--build-olive)', 'var(--build-yellow)'];
const MESES = CAMP.semanas.reduce<{ mes: string; semanas: typeof CAMP.semanas }[]>((acc, w) => {
  const mes = MES_LARGO[dia(w.inicio).getUTCMonth()];
  const last = acc[acc.length - 1];
  if (last?.mes === mes) last.semanas.push(w); else acc.push({ mes, semanas: [w] });
  return acc;
}, []);

export function CampPage() {
  const insc = useInscripciones();
  const [formOpen, setFormOpen] = useState(false);
  const openForm = () => setFormOpen(true);
  // Old ONVO return address (/camp/?pago=ok, checkouts created before /camp/gracias existed): forward there.
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get('pago') !== 'ok') return;
    q.delete('pago');
    location.replace(asset('/camp/gracias/') + (q.size ? '?' + q : ''));
  }, []);
  const tag = tituloPartes(CAMP.camp.tagline);
  const { manifiesto } = CAMP.camp;
  const P = PAGINA;
  const { edades } = CAMP.camp;

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
      {/* ---------- Hero ---------- */}
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <PillarTag pillar="community" />
          <h1 className={s.h1}>{tag.a} <strong>{tag.b}</strong></h1>
          <p className={s.heroDesc}>
            Camp de vacaciones para niños de <strong>{edades.min} a {edades.max} años</strong><br />
            {CAMP.horario.dias}, de {hora12(CAMP.horario.inicio)} a {hora12(CAMP.horario.fin)}<br />
            <strong>{CAMP.lugar.nombre}, {CAMP.lugar.zona}</strong>.
          </p>
          <ul className={s.globos}>{P.hero_globos.map(g => <li key={g.texto} className={s.globo}><Pilar k={g.pilar} size={20} />{g.texto}</li>)}</ul>
          <p className={s.heroPrice}>
            <span>Desde <strong>{crc(CAMP.precios.dia_suelto.precio)}</strong> por día</span>{' · '}<span>semanas desde <strong>{crc(CAMP.precios.semana)}</strong></span>
          </p>
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

      {/* ---------- Calendar ---------- */}
      <section id="fechas" className={s.white}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={cx(s.head, s.headWide)}>
            <Eyebrow c="var(--build-orange-deep)">{P.calendario.eyebrow}</Eyebrow>
            <h2 className={s.h2}>{P.calendario.titulo_a}<br /><strong>{P.calendario.titulo_b}</strong></h2>
            <p className={s.lead}>{P.calendario.texto}</p>
          </div>
          {MESES.map((m, mi) => {
            const next = MESES[mi + 1];
            const last = m.semanas[m.semanas.length - 1];
            // Gap between this month's last week and the next month's first: the year-end break.
            const pausa = next && dia(next.semanas[0].inicio).getTime() - dia(last.fin).getTime() > 4 * 864e5
              ? `${corto(dia(last.fin, 3))} – ${corto(dia(next.semanas[0].inicio, -3))}` : null;
            return <div key={m.mes} className={s.mes}>
              <h3 className={s.mesTitle}>{m.mes}</h3>
              <div className={s.semGrid}>
                {m.semanas.map(w => <article key={w.n} className={s.sem}>
                  <div className={s.semHead} style={{ '--bg': SEMANA_COLOR[(w.n - 1) % 3] } as Vars}>
                    <span className={s.semN}>Semana {w.n}</span>
                    <strong className={s.semFechas}>{rangoSemana(w.inicio, w.fin)}</strong>
                  </div>
                  <p className={s.semTema}>{w.tema}</p>
                </article>)}
                {pausa && <div className={s.pausa}>
                  <span className={s.semN}>{P.calendario.pausa.titulo}</span>
                  <strong className={s.pausaFechas}>{pausa}</strong>
                  <span className={s.pausaTxt}>{P.calendario.pausa.texto}</span>
                </div>}
              </div>
            </div>;
          })}
        </div>
      </section>

      {/* ---------- Prices ---------- */}
      <section id="precios" className={s.beigeSec}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={s.head}>
            <Eyebrow c="var(--build-orange-deep)">Precios</Eyebrow>
            <h2 className={s.h2}>Precios y <strong>paquetes</strong></h2>
          </div>
          <div className={s.incluye}>
            <span className={s.incluyeLabel}>Qué incluye</span>
            <ul className={s.incluyeList}>{CAMP.precios.incluye.map((x, i) => <li key={x}><Pilar k={['community', 'skills', 'joy', 'family'][i % 4]} size={18} />{x}</li>)}</ul>
          </div>
          <PrecioBloque minCol={200} diaAbajo sinIncluye />
        </div>
      </section>

      {/* ---------- Groups ---------- */}
      <section id="grupos" className={s.white}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={s.headRow}>
            <div className={s.head}>
              <Eyebrow c="var(--build-celeste-deep)">Los 3 grupos</Eyebrow>
              <h2 className={s.h2}>Un camp para <strong>cada edad</strong></h2>
            </div>
            <span className={s.cuposPill}>Cupos limitados por grupo</span>
          </div>
          <div className={s.grid320}>{CAMP.grupos.map(g => <GrupoCard key={g.id} id={g.id} />)}</div>
        </div>
      </section>

      {/* ---------- Safety ---------- */}
      <section id="seguridad" className={s.orange}>
        <div className={cx(s.wrap, s.stack)}>
          <div className={s.head}>
            <Eyebrow c="var(--build-ink)">{P.seguridad.eyebrow}</Eyebrow>
            <h2 className={s.h2} style={{ '--c': 'var(--build-white)' } as Vars}>{P.seguridad.titulo_a} <strong>{P.seguridad.titulo_b}</strong></h2>
          </div>
          <div className={s.segGrid}>
            {P.seguridad.tarjetas.map(t => <div key={t.titulo} className={s.segCard}>
              <Pilar k={t.pilar} size={34} />
              <div><h3 className={s.segTitle}>{t.titulo}</h3><p className={s.segText}>{t.texto}</p></div>
            </div>)}
          </div>
        </div>
      </section>

      {/* ---------- Who takes care of them ---------- */}
      <section id="equipo" className={s.white}>
        <div className={s.quien}>
          <div className={s.quienFoto}>
            <FotoPlaceholder frame="celeste" ratio="4 / 5" desc={`${P.quien_cuida.nombre}, ${P.quien_cuida.rol}`} />
          </div>
          <div className={s.quienCopy}>
            <Eyebrow c="var(--build-orange-deep)">{P.quien_cuida.eyebrow}</Eyebrow>
            <h2 className={s.h2}>{P.quien_cuida.titulo_a} <strong>{P.quien_cuida.titulo_b}</strong></h2>
            <p className={s.quienNombre}><strong>{P.quien_cuida.nombre}</strong><span>{P.quien_cuida.rol}</span></p>
            {P.quien_cuida.parrafos.map(p => <p key={p} className={s.quienText}>{p}</p>)}
            {P.quien_cuida.frase && <blockquote className={s.quienFrase}>“{P.quien_cuida.frase}”</blockquote>}
          </div>
        </div>
      </section>

      {/* ---------- Manifesto + a day at camp (unchanged) ---------- */}
      <section id="manifiesto" className={s.orange}>
        <div className={s.manifesto}>
          <div className={s.manifestoText}>
            <h2 className={s.manifestoTitle}>{manifiesto.titulo}</h2>
            {manifiesto.parrafos.map(p => <p key={p} className={s.manifestoP}>{brand(p)}</p>)}
          </div>
          <div id="un-dia" className={cx(s.card, s.panel)}>
            <h2 className={s.panelTitle}>Un día <strong>en el camp</strong></h2>
            <Cronograma tipo="dia" dot="var(--build-yellow)" />
          </div>
        </div>
      </section>

      {/* ---------- How registration works + the form, always open ---------- */}
      <section id="inscripcion" className={s.beigeSec}>
        <div className={s.insc}>
          <div className={s.inscCopy}>
            <Eyebrow c="var(--build-orange-deep)">{P.inscripcion.eyebrow}</Eyebrow>
            <h2 className={s.h2}>{P.inscripcion.titulo_a} <strong>{P.inscripcion.titulo_b}</strong></h2>
            <ol className={s.pasos}>
              {P.inscripcion.pasos.map((p, i) => <li key={p.titulo} className={s.paso}>
                <span className={s.pasoN} style={{ '--bg': SEMANA_COLOR[i % 3] } as Vars}>{i + 1}</span>
                <div><strong className={s.pasoTitle}>{p.titulo}</strong><span className={s.pasoText}>{p.texto}</span></div>
              </li>)}
            </ol>
          </div>
          {insc.mode === 'form'
            ? <div className={cx(s.card, s.inscForm)}>
                <h3 className={s.inscFormTitle}>Registrate al camp</h3>
                <InteresForm abiertas={insc.abiertas} modo="inline" />
              </div>
            : <div className={s.heroCtas}><Cta size="lg" /></div>}
        </div>
      </section>

      {/* ---------- Where + allies + FAQ ---------- */}
      <section id="donde" className={s.white}>
        <div className={s.donde}>
          <div className={s.dondeMain}>
            <Eyebrow c="var(--build-orange-deep)">{P.donde.eyebrow}</Eyebrow>
            <h2 className={s.h2}>{P.donde.titulo_a} <strong>{P.donde.titulo_b}</strong></h2>
            <p className={s.lead}>{P.donde.texto}</p>
            <p className={s.punto}><Pilar k="community" size={22} /><span><strong>{P.donde.punto.titulo}</strong>{P.donde.punto.texto}</span></p>
            <div className={s.mapa}>
              <iframe title={`Mapa: ${CAMP.lugar.nombre}, ${CAMP.lugar.zona}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(P.donde.mapa_q)}&z=16&output=embed`} />
            </div>
            <h3 className={s.aliadosTitle}>{P.donde.aliados_titulo}</h3>
            <div className={s.coBrand}>
              <Logo width={110} />
              <span className={s.plus}>+</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset('/brand/logos/cityplace.png')} alt="City Place, centro urbano, Santa Ana" width={304} height={65} className={s.cityLogo} />
            </div>
            <ul className={s.aliados}>{P.donde.aliados.map(a => <li key={a}>{a}</li>)}</ul>
          </div>
          <div id="preguntas" className={s.faqCol}>
            <h2 className={s.h2sm} style={{ '--c': 'var(--build-orange)' } as Vars}>Preguntas <strong>frecuentes</strong></h2>
            <Faq />
          </div>
        </div>
      </section>

      <section id="contacto" className={s.contact}>
        <ContactoFooter titulo="Construí tus vacaciones" bold="con nosotros" cta={insc.label}
          onCta={insc.mode === 'form' ? openForm : undefined} ctaHref={insc.href} />
      </section>
    </main>

    {formOpen && <InteresForm abiertas={insc.abiertas} modo="dialog" onClose={() => setFormOpen(false)} />}
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

/**
 * Camp registration (before opening day: "Avisame cuando abran"). Submissions go to Netlify Forms
 * (form "camp-interes", declared in public/__forms.html). Once registration is open, with a plan and
 * up to MAX_NINOS_PAGO children, the form is saved first and then the family goes to ONVO checkout
 * (netlify/functions/onvo-checkout.mts). Plans and prices: src/lib/camp-pago.ts (from camp-data.json).
 */
/** How many children: "3+" collects 3 and Build follows up for the rest. */
const CANTIDADES = [{ value: '1', n: 1 }, { value: '2', n: 2 }, { value: '3+', n: 3 }];
const EDAD_OPTS = Array.from({ length: CAMP.camp.edades.max - CAMP.camp.edades.min + 1 }, (_, i) => {
  const e = CAMP.camp.edades.min + i;
  return { value: String(e), label: `${e} años` };
});
type Nino = { nombre: string; edad: string };
const NINO_VACIO: Nino = { nombre: '', edad: '' };
/** "Reservar sin pagar" holds the spot this long; Build sends the ONVO payment link by WhatsApp. */
const RESERVA_HORAS = 24;
/** Last abandoned-form data saved in this visit (so closing and reopening doesn't save the same twice). */
let ultimoIncompleto = '';

/** modo "dialog": the pop-up (buttons in its fixed footer, × to close). modo "inline": always open inside the page. */
function InteresForm({ abiertas, modo, onClose }: { abiertas: boolean; modo: 'dialog' | 'inline'; onClose?: () => void }) {
  const formId = `camp-interes-form-${modo}`;
  const [f, setF] = useState({ nombre: '', whatsapp: '', email: '', plan: '' });
  const [cantidad, setCantidad] = useState('1');
  // Kept for all 3 slots, so lowering the count and raising it again doesn't lose what was typed.
  const [ninos, setNinos] = useState<Nino[]>([NINO_VACIO, NINO_VACIO, NINO_VACIO]);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<false | 'form' | 'pago'>(false);
  const n = CANTIDADES.find(c => c.value === cantidad)!.n;
  const visibles = ninos.slice(0, n);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim());
  const invalid = !f.nombre.trim() || f.whatsapp.replace(/\D/g, '').length < 8 || !emailOk || visibles.some(k => !k.nombre.trim() || !k.edad);
  const plan = planPago(f.plan);
  // null = no online payment (registration not open, no plan, or more children than MAX_NINOS_PAGO).
  const total = abiertas ? totalPago(f.plan, n) : null;
  const setNino = (i: number, patch: Partial<Nino>) => setNinos(list => list.map((k, j) => (j === i ? { ...k, ...patch } : k)));

  // Abandoned form: if they typed a name plus a valid phone or email and leave without sending
  // (×, "Ahora no", tap outside, Esc, close the tab or switch apps), save what they typed in a separate
  // Netlify form "camp-incompleto". No email to the family and nothing in Notion. Not sent once the
  // full registration went out; the same data is never saved twice.
  const enviado = useRef(false);
  const snapshot = useRef<Record<string, string> | null>(null);
  const faltan = [
    !f.nombre.trim() && 'nombre', f.whatsapp.replace(/\D/g, '').length < 8 && 'teléfono', !emailOk && 'correo',
    ...visibles.flatMap((k, i) => [!k.nombre.trim() && `nombre del niño ${i + 1}`, !k.edad && `edad del niño ${i + 1}`]),
    abiertas && !f.plan && 'plan',
  ].filter(Boolean) as string[];
  snapshot.current = f.nombre.trim() && (f.whatsapp.replace(/\D/g, '').length >= 8 || emailOk) ? {
    nombre: f.nombre.trim(), whatsapp: f.whatsapp.trim(), email: f.email.trim(),
    plan: plan ? `${plan.label} (${crc(plan.precio)} por niño)` : '', ninos: cantidad,
    ninos_detalle: visibles.map(k => [k.nombre.trim(), k.edad && `${k.edad} años`].filter(Boolean).join(', ')).filter(Boolean).join(' | '),
    total: total != null ? crc(total) : '',
    faltaba: faltan.length ? faltan.join(', ') : 'Nada: llenó todo pero no envió',
  } : null;
  const guardarIncompleto = (momento: string) => {
    const d = snapshot.current;
    if (enviado.current || !d) return;
    const clave = JSON.stringify(d);
    if (clave === ultimoIncompleto) return;
    ultimoIncompleto = clave;
    const body = new URLSearchParams({ 'form-name': 'camp-incompleto', ...d, momento }).toString();
    const url = asset('/__forms.html');
    try {
      if (navigator.sendBeacon?.(url, new Blob([body], { type: 'application/x-www-form-urlencoded' }))) return;
    } catch {}
    fetch(url, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }).catch(() => {});
  };
  const cerrar = () => { guardarIncompleto('Cerró el formulario'); onClose?.(); };
  useEffect(() => {
    const salir = () => guardarIncompleto('Salió de la página');
    const oculta = () => { if (document.visibilityState === 'hidden') guardarIncompleto('Cambió de app o pestaña'); };
    window.addEventListener('pagehide', salir);
    document.addEventListener('visibilitychange', oculta);
    return () => { window.removeEventListener('pagehide', salir); document.removeEventListener('visibilitychange', oculta); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** pagar=false: "reservar y pagar después" (spot held RESERVA_HORAS, Build sends an ONVO link by WhatsApp). */
  const submit = async (pagar = true) => {
    if (invalid) return;
    const enLinea = pagar && total != null;
    setSending(true); setFailed(false);
    // Only the visible children are sent; the group is sent already resolved for the Netlify panel.
    const data: Record<string, string> = {
      'form-name': 'camp-interes', nombre: f.nombre, whatsapp: f.whatsapp, email: f.email.trim(),
      plan: plan ? `${plan.label} (${crc(plan.precio)} por niño)` : '', ninos: cantidad,
      pago: enLinea ? `ONVO iniciado: ${crc(total!)}` : total != null ? `Pago pendiente (${RESERVA_HORAS} h): ${crc(total)}. Enviar link de ONVO por WhatsApp` : 'Sin pago en línea',
    };
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
    } catch {
      setFailed('form'); setSending(false); return;
    }
    enviado.current = true;
    if (!enLinea) {
      // "Pagar después" (or no online payment): thank-you page /camp/gracias2, which also sends the Lead
      // conversion (sent there, not here, so leaving this page can't drop it).
      const q = new URLSearchParams({ tipo: total != null ? 'reserva' : 'registro', ninos: String(n) });
      if (total != null) q.set('monto', String(total));
      if (plan) q.set('plan', plan.id);
      location.href = asset('/camp/gracias2/') + '?' + q;
      return;
    }
    track('Lead', { content_name: 'Camp' + (plan ? ': ' + plan.label : ''), num_items: n, ...(total != null ? { value: total } : {}) });
    // Registration saved; now create the ONVO checkout (the server recomputes the amount) and go pay.
    track('InitiateCheckout', { value: total!, content_name: 'Camp: ' + plan!.label, num_items: n });
    try {
      const res = await fetch(asset('/api/onvo-checkout'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: f.plan, ninos: n, nombre: f.nombre, whatsapp: f.whatsapp, email: f.email, nombres_ninos: visibles.map(k => k.nombre.trim()) }),
      });
      const out = await res.json().catch(() => ({})) as { url?: string };
      if (!res.ok || !out.url) throw new Error(String(res.status));
      location.href = out.url;
    } catch {
      setFailed('pago'); setSending(false);
    }
  };

  // With online payment: "Pagar después" next to "Pagar ₡X ahora". In the pop-up they live in its fixed footer
  // (always visible; `form` links the submit button to the form) and closing is the × in the corner.
  const conPago = total != null;
  const nota = conPago ? `Pagar después: te guardamos el cupo ${RESERVA_HORAS} h y te enviamos el link de pago por WhatsApp.` : undefined;
  const botones = <>
    {conPago
      ? <Button variant="secondary" className={s.payBtn} disabled={invalid || sending} onClick={() => submit(false)}>Pagar después</Button>
      : modo === 'dialog' && <Button variant="ghost" onClick={cerrar}>Ahora no</Button>}
    <Button type="submit" form={formId} className={conPago || modo === 'inline' ? s.payBtn : undefined} disabled={invalid || sending}>{sending ? (conPago ? 'Un momento…' : 'Enviando…') : conPago ? <>Pagar {crc(total)}<span className={s.payNow}> ahora</span></> : abiertas ? 'Enviar registro' : 'Avisame'}</Button>
  </>;
  const formulario = <>
    <form id={formId} className={s.form} onSubmit={e => { e.preventDefault(); submit(); }}>
      {modo === 'dialog' && <p className={s.formIntro}>{abiertas
        ? 'Elegí tu plan y pagá en línea con ONVO, o reservá y pagá después. Te escribimos por WhatsApp para coordinar las semanas.'
        : `Las inscripciones abren el ${CAMP.inscripciones.abren_texto}. Dejanos tus datos y te contactamos ese día.`}</p>}
      <Input label="Tu nombre" name="nombre" required autoComplete="name" value={f.nombre} onChange={e => setF({ ...f, nombre: e.target.value })} autoFocus={modo === 'dialog'} />
      <Input label="Teléfono" name="whatsapp" type="tel" required placeholder="8888-8888" autoComplete="tel" value={f.whatsapp} onChange={e => setF({ ...f, whatsapp: e.target.value })} />
      <Input label="Email" name="email" type="email" required placeholder="nombre@correo.com" autoComplete="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} />

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
      {cantidad === '3+' && <p className={s.kidNote}>Con 3 o más niños te contactamos para completar el registro y el pago.</p>}

      <fieldset className={s.fieldset}>
        <legend className={s.legend}>¿Qué te interesa?</legend>
        {/* One choice at most; tapping the selected option clears it (as in the design). */}
        {PLANES_PAGO.map(p => <Checkbox key={p.id} checked={f.plan === p.id} onChange={() => setF({ ...f, plan: f.plan === p.id ? '' : p.id })} label={`${p.label} · ${crc(p.precio)} por niño`} />)}
      </fieldset>
      {total != null && plan && <p className={s.formTotal}><span>{n} {n === 1 ? 'niño' : 'niños'} × {plan.label}</span><strong>{crc(total)}</strong></p>}
      <p className={s.formPrivacy}>Guardamos tus datos de contacto solo para ayudarte con tu inscripción.</p>
      {failed === 'form' && <p className={s.formError} role="alert">No pudimos enviar tus datos. Probá de nuevo o escribinos por WhatsApp.</p>}
      {failed === 'pago' && <p className={s.formError} role="alert">Recibimos tus datos, pero no pudimos abrir el pago. Probá de nuevo o <a href={WA_LINK} target="_blank" rel="noopener noreferrer">escribinos por WhatsApp</a>.</p>}
    </form>
  </>;

  if (modo === 'inline') return <div className={s.inlineForm}>
    {formulario}
    <div className={s.inlineActions}>{botones}</div>
    {nota && <p className={s.inlineNota}>{nota}</p>}
  </div>;
  return <Dialog onClose={cerrar} title="Registrate al camp" accent="var(--build-orange)" width={520} closeButton={conPago} footnote={nota} actions={botones}>
    {formulario}
  </Dialog>;
}
