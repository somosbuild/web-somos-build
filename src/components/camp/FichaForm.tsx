'use client';

/**
 * Welcome form ("ficha de ingreso") at /welcome-form: hidden page (noindex, not linked) that Build sends to
 * families once their spot is confirmed. One form per family: parent data, up to MAX_NINOS children with
 * medical info, one emergency contact, up to MAX_RETIRA people allowed to pick up, and image consent.
 * Submissions go to Netlify Forms (form "camp-ficha", declared in public/__forms.html); the
 * submission-created function then emails a copy to the family and adds it to their Notion CRM page.
 * Privacy: no abandoned-form capture and no form data sent to analytics (only a generic event).
 */
import { useState, type ChangeEvent, type TextareaHTMLAttributes } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { Button, ButtonLink, Checkbox, Icon, Input, Logo, Radio, Shape } from '@/components/ds';
import { asset } from '@/lib/asset';
import { track } from '@/lib/analytics';
import { CAMP, WA_LINK } from '@/lib/camp';

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');
const MAX_NINOS = 3;
const MAX_RETIRA = 3;
const INICIO = CAMP.semanas[0].inicio;
const HOY = new Date().toISOString().slice(0, 10);
/** Earliest birth date accepted (soft range): 12 years before the camp starts. */
const NAC_MIN = `${Number(INICIO.slice(0, 4)) - 12}${INICIO.slice(4)}`;
const { min: EDAD_MIN, max: EDAD_MAX } = CAMP.camp.edades;

type Nino = { nombre: string; nacimiento: string; alergias: string; condiciones: string };
type Persona = { nombre: string; cedula: string };
const NINO_VACIO: Nino = { nombre: '', nacimiento: '', alergias: '', condiciones: '' };
const PERSONA_VACIA: Persona = { nombre: '', cedula: '' };

/** Age in whole years on the first day of camp. */
function edadAlInicio(nac: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nac)) return null;
  const [y, m, d] = nac.split('-').map(Number), [Y, M, D] = INICIO.split('-').map(Number);
  return Y - y - (M < m || (M === m && D < d) ? 1 : 0);
}

function Area({ label, hint, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return <label className={s.taField}>
    <span className={s.taLabel}>{label}</span>
    <textarea rows={2} {...rest} className={s.ta} />
    {hint && <span className={s.taHint}>{hint}</span>}
  </label>;
}

export function FichaForm() {
  const [f, setF] = useState({ nombre: '', whatsapp: '', email: '' });
  const [ninos, setNinos] = useState<Nino[]>([NINO_VACIO]);
  const [emer, setEmer] = useState({ nombre: '', telefono: '', parentesco: '' });
  const [retira, setRetira] = useState<Persona[]>([PERSONA_VACIA]);
  const [fotos, setFotos] = useState<'' | 'Sí' | 'No'>('');
  const [acepto, setAcepto] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [listo, setListo] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim());
  const tel = (v: string) => v.replace(/\D/g, '').length >= 8;
  const lleno = (v: string) => v.trim().length > 0;
  const nacOk = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && v >= NAC_MIN && v <= HOY;
  const invalid = !lleno(f.nombre) || !tel(f.whatsapp) || !emailOk
    || ninos.some(k => !lleno(k.nombre) || !nacOk(k.nacimiento) || !lleno(k.alergias) || !lleno(k.condiciones))
    || !lleno(emer.nombre) || !tel(emer.telefono) || !lleno(emer.parentesco)
    || retira.some(p => !lleno(p.nombre) || !lleno(p.cedula))
    || !fotos || !acepto;

  const setNino = (i: number, patch: Partial<Nino>) => setNinos(l => l.map((k, j) => (j === i ? { ...k, ...patch } : k)));
  const setPersona = (i: number, patch: Partial<Persona>) => setRetira(l => l.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const on = <T,>(set: (v: T) => void, base: T, key: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ ...base, [key]: e.target.value });

  const submit = async () => {
    if (invalid || sending) return;
    setSending(true); setFailed(false);
    const data: Record<string, string> = {
      'form-name': 'camp-ficha', nombre: f.nombre.trim(), whatsapp: f.whatsapp.trim(), email: f.email.trim(),
      emergencia_nombre: emer.nombre.trim(), emergencia_telefono: emer.telefono.trim(), emergencia_parentesco: emer.parentesco.trim(),
      fotos, acepto: 'Sí',
    };
    ninos.forEach((k, i) => {
      data[`nino${i + 1}_nombre`] = k.nombre.trim();
      data[`nino${i + 1}_nacimiento`] = k.nacimiento;
      data[`nino${i + 1}_alergias`] = k.alergias.trim();
      data[`nino${i + 1}_condiciones`] = k.condiciones.trim();
    });
    retira.forEach((p, i) => { data[`retira${i + 1}_nombre`] = p.nombre.trim(); data[`retira${i + 1}_cedula`] = p.cedula.trim(); });
    try {
      const res = await fetch(asset('/__forms.html'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setFailed(true); setSending(false); return;
    }
    track('CompleteRegistration', { content_name: 'Ficha de ingreso', num_items: ninos.length });
    setListo(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (listo) return <main className={s.gracias}>
    <Shape name="68" size={280} color="var(--build-orange-light)" className={s.abs} style={{ right: -80, bottom: -90 }} />
    <div className={s.graciasCard}>
      <Link href="/camp/" aria-label="Build Summer Camp" className={s.graciasLogo}><Logo width={150} /></Link>
      <span className={s.graciasIcon}><Icon name="43" size={30} color="var(--build-beige)" /></span>
      <h1 className={s.graciasTitle}>¡Listo! <strong>Recibimos la ficha.</strong></h1>
      <p className={s.graciasText}>Te enviamos una copia a tu correo. Si algo cambia antes del camp (una alergia, un medicamento, quién retira), escribinos por WhatsApp.</p>
      <div className={s.ctas}>
        <ButtonLink size="lg" href={asset('/camp/')}>Ver el camp</ButtonLink>
        <ButtonLink variant="secondary" size="lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</ButtonLink>
      </div>
    </div>
  </main>;

  const n = ninos.length;
  return <main className={s.ficha}>
    <Shape name="68" size={320} color="var(--build-orange-light)" className={cx(s.abs, s.fichaShape)} style={{ right: -110, top: -120 }} />
    <div className={s.fichaWrap}>
      <Link href="/camp/" aria-label="Build Summer Camp" className={s.graciasLogo}><Logo width={140} /></Link>
      <h1 className={s.fichaTitle}>Bienvenidos al camp. <strong>Contanos de tus hijos.</strong></h1>
      <p className={s.fichaLead}>Esta ficha nos ayuda a cuidar a cada niño: su salud, a quién llamar si pasa algo y quién puede retirarlo. Te toma unos 5 minutos.</p>

      <form className={cx(s.form, s.fichaCard)} onSubmit={e => { e.preventDefault(); submit(); }} noValidate={false}>
        <section className={s.fichaSec}>
          <h2 className={s.fichaH}>Tus datos</h2>
          <div className={s.pair}>
            <Input label="Tu nombre completo" name="nombre" required autoComplete="name" placeholder="Nombre y apellidos" value={f.nombre} onChange={on(setF, f, 'nombre')} />
            <Input label="WhatsApp" name="whatsapp" type="tel" required autoComplete="tel" placeholder="8888-8888" value={f.whatsapp} onChange={on(setF, f, 'whatsapp')} />
          </div>
          <Input label="Email" name="email" type="email" required autoComplete="email" placeholder="El mismo con el que te registraste" value={f.email} onChange={on(setF, f, 'email')} />
        </section>

        <section className={s.fichaSec}>
          <h2 className={s.fichaH}>{n > 1 ? 'Tus hijos' : 'Tu hijo o hija'}</h2>
          {ninos.map((k, i) => {
            const edad = edadAlInicio(k.nacimiento);
            const fuera = k.nacimiento && nacOk(k.nacimiento) && edad != null && (edad < EDAD_MIN || edad > EDAD_MAX);
            return <fieldset key={i} className={s.kid}>
              <legend className={s.kidTitle}>{n > 1 ? `Niño o niña ${i + 1}` : 'Datos del niño o niña'}</legend>
              <div className={s.kidFields}>
                <Input label="Nombre completo" name={`nino${i + 1}_nombre`} required placeholder="Nombre y apellidos" value={k.nombre} onChange={e => setNino(i, { nombre: e.target.value })} />
                <Input label="Fecha de nacimiento" name={`nino${i + 1}_nacimiento`} type="date" required min={NAC_MIN} max={HOY} value={k.nacimiento} onChange={e => setNino(i, { nacimiento: e.target.value })}
                  hint={fuera ? `El camp es para niños de ${EDAD_MIN} a ${EDAD_MAX} años. Si hay una excepción, la coordinamos por WhatsApp.` : undefined} />
              </div>
              <Area label="Alergias" name={`nino${i + 1}_alergias`} required placeholder="Alimentos, medicamentos, picaduras… Si no tiene, escribí “Ninguna”." value={k.alergias} onChange={e => setNino(i, { alergias: e.target.value })} />
              <Area label="Condiciones médicas que debamos conocer" name={`nino${i + 1}_condiciones`} required placeholder="Asma, diabetes, TDAH, medicamentos que toma… Si no tiene, escribí “Ninguna”." value={k.condiciones} onChange={e => setNino(i, { condiciones: e.target.value })} />
              {i > 0 && <button type="button" className={cx(s.linkBtn, s.fichaQuitar)} onClick={() => setNinos(l => l.filter((_, j) => j !== i))}>Quitar este niño</button>}
            </fieldset>;
          })}
          {n < MAX_NINOS
            ? <button type="button" className={s.fichaAdd} onClick={() => setNinos(l => [...l, NINO_VACIO])}>+ Agregar otro niño</button>
            : <p className={s.kidNote}>¿Más de {MAX_NINOS} niños? Escribinos por WhatsApp y te ayudamos.</p>}
        </section>

        <section className={s.fichaSec}>
          <h2 className={s.fichaH}>Contacto de emergencia</h2>
          <p className={s.fichaNota}>Alguien distinto a vos, por si no te localizamos.</p>
          <div className={s.pair}>
            <Input label="Nombre" name="emergencia_nombre" required placeholder="Nombre y apellido" value={emer.nombre} onChange={on(setEmer, emer, 'nombre')} />
            <Input label="Teléfono" name="emergencia_telefono" type="tel" required placeholder="8888-8888" value={emer.telefono} onChange={on(setEmer, emer, 'telefono')} />
          </div>
          <Input label="Parentesco" name="emergencia_parentesco" required placeholder="Abuela, tío, madrina…" value={emer.parentesco} onChange={on(setEmer, emer, 'parentesco')} />
        </section>

        <section className={s.fichaSec}>
          <h2 className={s.fichaH}>¿Quién puede retirarlos?</h2>
          <p className={s.fichaNota}>Solo entregamos a los niños a estas personas, presentando la cédula. Incluite si vas a retirar vos.</p>
          {retira.map((p, i) => <div key={i} className={s.fichaPersona}>
            <div className={s.pair}>
              <Input label={retira.length > 1 ? `Persona ${i + 1}: nombre` : 'Nombre completo'} name={`retira${i + 1}_nombre`} required placeholder="Nombre y apellidos" value={p.nombre} onChange={e => setPersona(i, { nombre: e.target.value })} />
              <Input label="Número de cédula" name={`retira${i + 1}_cedula`} required placeholder="1-2345-6789" value={p.cedula} onChange={e => setPersona(i, { cedula: e.target.value })} />
            </div>
            {i > 0 && <button type="button" className={cx(s.linkBtn, s.fichaQuitar)} onClick={() => setRetira(l => l.filter((_, j) => j !== i))}>Quitar</button>}
          </div>)}
          {retira.length < MAX_RETIRA && <button type="button" className={cx(s.linkBtn, s.addKid)} onClick={() => setRetira(l => [...l, PERSONA_VACIA])}>+ Agregar otra persona</button>}
        </section>

        <section className={s.fichaSec}>
          <h2 className={s.fichaH}>Fotos y videos</h2>
          <p className={s.fichaNota}>¿Autorizás que tus hijos aparezcan en fotos y videos del camp en las redes de Build?</p>
          <div className={s.fichaRadios} role="radiogroup" aria-label="Consentimiento de imagen">
            <Radio name="fotos" value="Sí" checked={fotos === 'Sí'} onChange={() => setFotos('Sí')} label="Sí, autorizo" />
            <Radio name="fotos" value="No" checked={fotos === 'No'} onChange={() => setFotos('No')} label="No autorizo" />
          </div>
        </section>

        <Checkbox name="acepto" checked={acepto} onChange={e => setAcepto(e.target.checked)}
          label={<span className={s.fichaAcepto}>Confirmo que la información es correcta y autorizo a Build a usarla solo para el cuidado de mis hijos durante el camp.</span>} />

        {failed && <p className={s.formError} role="alert">No pudimos enviar la ficha. Probá de nuevo o <a href={WA_LINK} target="_blank" rel="noopener noreferrer">escribinos por WhatsApp</a>.</p>}
        <Button type="submit" size="lg" disabled={invalid || sending}>{sending ? 'Enviando…' : 'Enviar ficha'}</Button>
        {invalid && <p className={s.inlineNota}>Completá todos los campos para enviar.</p>}
      </form>
    </div>
  </main>;
}
