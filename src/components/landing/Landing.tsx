'use client';

import { useState } from 'react';
import { Badge, Button, Icon, Input, Logo, Radio, Shape } from '@/components/ds';
import { asset } from '@/lib/asset';
import { CONTACT } from '@/lib/data';
import { ABOUT, ETAPAS, HERO, LANDING_FAQ, LANDING_PILLARS, OPENING } from '@/lib/landing';
import s from './landing.module.css';

type Form = { nombre: string; correo: string; etapa: string; comentario: string };
const EMPTY: Form = { nombre: '', correo: '', etapa: '', comentario: '' };

// Mensaje prellenado para saber que la persona llegó desde la web.
const WHATSAPP_HREF = `${CONTACT.whatsapp}?text=${encodeURIComponent('¡Hola! Vi la página de Build y quiero saber más.')}`;

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
};

export function Landing() {
  return <div className={s.page}>
    <header className={s.header}>
      <div className={s.headerInner}>
        <Logo width={150} widthMobile={120} />
        <div className={s.headerRight}>
          <span className={s.headerNote}>Abrimos en {OPENING}</span>
          <Button size="sm" onClick={() => scrollTo('registro')}>Quiero enterarme</Button>
        </div>
      </div>
    </header>

    <main>
      <section className={s.heroSection}>
        <div className={s.heroFrame}>
          <div className={s.heroPhoto}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(HERO.photo)} alt={HERO.photoAlt} />
          </div>
          <div className={s.heroCard}>
            <div><Badge color="orange">{HERO.badge}</Badge></div>
            <h1 className={s.heroTitle}>La familia no ocurre por casualidad, <strong>se construye.</strong></h1>
            <p className={s.heroText}>{HERO.text}</p>
            <div className={s.row}>
              <Button size="lg" onClick={() => scrollTo('registro')}>Avisame cuando abran</Button>
              <Button size="lg" variant="ghost" onClick={() => scrollTo('faq')}>Preguntas frecuentes</Button>
            </div>
          </div>
          <div className={s.deco} style={{ top: -26, right: '9%' }}><Shape name="02" size={96} sizeMobile={64} color="var(--build-celeste)" style={{ transform: 'rotate(-12deg)' }} /></div>
          <div className={s.deco} style={{ top: '18%', right: -22 }}><Shape name="01" size={80} sizeMobile={56} color="var(--build-olive)" /></div>
          <div className={s.deco} style={{ bottom: -30, right: '14%' }}><Shape name="43" size={110} sizeMobile={72} color="var(--build-orange)" style={{ transform: 'rotate(8deg)' }} /></div>
        </div>
      </section>

      <section className={s.about}>
        <h2 className={s.h2}>¿Qué es <strong>Build?</strong></h2>
        <div className={s.aboutText}>
          <p className={s.lead}>{ABOUT.lead}</p>
          <p className={s.body}>{ABOUT.body}</p>
        </div>
      </section>

      <section className={s.pillars}>
        {LANDING_PILLARS.map(p => <div key={p.k} className={s.pillarCard}>
          <div className={s.pillarLogo} role="img" aria-label={p.alt} style={{ backgroundImage: `url(${asset(`/brand/logos/pillar-${p.k}.png`)})` }} />
          <p className={s.pillarText}>{p.text}</p>
        </div>)}
      </section>

      <Registro />
      <Faq />
    </main>

    <footer className={s.footer}>
      <div className={s.footerInner}>
        <Logo width={180} widthMobile={150} />
        <div className={s.footerInfo}>
          <span>City Place, Santa Ana · Costa Rica</span>
          <span className={s.footerSoft}>Abrimos en {OPENING}. Te esperamos.</span>
        </div>
        <div className={s.footerLinks}>
          <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className={s.footerLink}><Icon name="40" size={20} color="var(--build-orange)" />@somos.build</a>
          <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className={s.footerLink}><Icon name="42" size={20} color="var(--build-orange)" />WhatsApp {CONTACT.phone}</a>
        </div>
      </div>
    </footer>

    <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" aria-label="Escribinos por WhatsApp" className={s.fab}>
      <Icon name="42" size={30} color="var(--build-beige)" />
    </a>
  </div>;
}

/** Registration form. Submissions go to Netlify Forms (form "registro", declared in public/__forms.html). */
function Registro() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  const set = (k: keyof Form, v: string) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: undefined })); };

  const submit = async () => {
    const e: typeof errors = {};
    if (!form.nombre.trim()) e.nombre = 'Contanos tu nombre.';
    if (!/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = 'Revisá tu correo.';
    if (Object.keys(e).length) return setErrors(e);
    setSending(true); setFailed(false);
    try {
      const res = await fetch(asset('/__forms.html'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'registro', ...form }).toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  };

  return <section id="registro" className={s.registro}>
    <div className={s.registroInner}>
      <div className={s.registroIntro}>
        <h2 className={s.registroTitle}>Construyamos esto <strong>juntos.</strong></h2>
        <p className={s.registroText}>Dejanos tus datos y te avisamos primero cuando abramos, con las actividades de la primera agenda.</p>
        <div className={s.registroShapes} aria-hidden>
          {['04', '03', '01', '02'].map(n => <Shape key={n} name={n} size={56} sizeMobile={44} color="var(--build-white)" />)}
        </div>
      </div>

      <div className={s.formCard}>
        {!sent ? <form className={s.form} onSubmit={ev => { ev.preventDefault(); submit(); }} noValidate>
          <Input label="Nombre" name="nombre" placeholder="Tu nombre" autoComplete="name" value={form.nombre} onChange={e => set('nombre', e.target.value)} error={errors.nombre} />
          <Input label="Correo" name="correo" type="email" placeholder="tucorreo@ejemplo.com" autoComplete="email" value={form.correo} onChange={e => set('correo', e.target.value)} error={errors.correo} />
          <fieldset className={s.fieldset}>
            <legend className={s.legend}>¿En qué etapa están?</legend>
            <div className={s.radios}>
              {ETAPAS.map(([value, label]) => <Radio key={value} name="etapa" value={value} label={label} checked={form.etapa === value} onChange={() => set('etapa', value)} />)}
            </div>
          </fieldset>
          <label className={s.textareaField}>
            <span className={s.legend}>Comentario <span className={s.optional}>(opcional)</span></span>
            <textarea rows={3} name="comentario" placeholder="¿Qué te gustaría encontrar en Build?" value={form.comentario} onChange={e => set('comentario', e.target.value)} className={s.textarea} />
          </label>
          <Button type="submit" size="lg" fullWidth disabled={sending}>{sending ? 'Enviando…' : 'Quiero enterarme'}</Button>
          {failed && <p className={s.formError} role="alert">No pudimos enviar tus datos. Probá de nuevo en un momento.</p>}
          <p className={s.privacy}>Solo usamos tus datos para contarte novedades de Build.</p>
        </form> : <div className={s.sent} role="status">
          <Shape name="02" size={64} color="var(--build-orange)" />
          <h3 className={s.sentTitle}>¡Listo, {form.nombre.trim().split(' ')[0]}!</h3>
          <p className={s.sentText}>Ya estás en la lista. Te escribimos a {form.correo} antes de abrir en {OPENING.split(' ')[0]}.</p>
          <Button variant="ghost" size="sm" onClick={() => { setForm(EMPTY); setErrors({}); setSent(false); }}>Registrar otra persona</Button>
        </div>}
      </div>
    </div>
  </section>;
}

function Faq() {
  const [open, setOpen] = useState(0);
  return <section id="faq" className={s.faq}>
    <h2 className={s.h2} style={{ marginBottom: 32 }}>Preguntas <strong>frecuentes</strong></h2>
    <div className={s.faqList}>
      {LANDING_FAQ.map(([q, a], i) => <div key={q} className={s.faqItem}>
        <button type="button" className={s.faqQ} aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
          <span>{q}</span>
          <span className={s.faqPlus} style={{ transform: `rotate(${open === i ? 45 : 0}deg)` }}>+</span>
        </button>
        {open === i && <p className={s.faqA}>{a}</p>}
      </div>)}
    </div>
  </section>;
}
