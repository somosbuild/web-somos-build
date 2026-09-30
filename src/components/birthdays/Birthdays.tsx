'use client';

import { useState, type CSSProperties } from 'react';
import s from './birthdays.module.css';
import { Badge, Button, Icon, Input, Select, Shape } from '@/components/ds';
import { Carousel, Em, Eyebrow, H2, ImageSlot, Wrap, anchorClass, scrollToId } from '@/components/site/shared';
import { useSite } from '@/components/site/SiteProvider';
import { CONTACT, PACKAGES, onColorInk } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string>;
const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

const STEPS: [string, string, string, string][] = [
  ['39', 'Cotizá', 'Contanos la fecha, la edad y cuántos niños vienen.', 'orange'],
  ['04', 'Reservá la fecha', 'Te confirmamos disponibilidad y el paquete ideal.', 'yellow'],
  ['02', 'Celebrá', 'Llegás con tu familia y nosotros nos encargamos del resto.', 'celeste'],
];

export function BirthdaysScreen() {
  const { say } = useSite();
  const [pkg, setPkg] = useState('party');
  const [wa, setWa] = useState('');
  const toForm = (k?: string) => { if (k) setPkg(k); scrollToId('cotizar'); };

  return <div className={s.page}>
    <Wrap className={s.hero}>
      <div className={s.heroCopy}>
        <Eyebrow>Cumpleaños de 1 a 5 años</Eyebrow>
        <h1 className={s.title}>Un cumpleaños para <b>construir recuerdos</b></h1>
        <p className={s.lead}>Juego, espacio y todo listo para que vos disfrutés la fiesta con tu familia.</p>
        <div className={s.ctas}>
          <Button size="lg" fullWidthMobile onClick={() => toForm()}>Cotizá tu fiesta</Button>
          <Button size="lg" fullWidthMobile variant="secondary" iconLeft={<Icon name="42" size={18} />} onClick={() => { window.location.href = CONTACT.whatsapp; }}>Escribinos por WhatsApp</Button>
        </div>
      </div>
      <div className={s.frame}>
        <div className={s.framePhoto}><ImageSlot placeholder="Foto: cumpleaños en Build" /></div>
        <Shape name="57" size={64} sizeMobile={44} color="var(--build-yellow)" className={s.shapeA} />
        <Shape name="52" size={84} sizeMobile={56} color="var(--build-orange)" className={s.shapeB} />
      </div>
    </Wrap>

    <Wrap className={s.block}>
      <div className={s.h2Gap}><H2>Paquetes</H2></div>
      <Carousel min={280} minMobile={290} cols="repeat(3,minmax(0,1fr))" gap={20}>
        {PACKAGES.map(p => <div key={p.k} className={cx(s.pkg, p.featured && s.pkgFeatured)}>
          <div className={s.pkgHead} style={{ '--bg': `var(--build-${p.color})`, '--fg': onColorInk(p.color) ? 'var(--build-ink)' : '#fff' } as Vars}>
            <h3 className={s.pkgName}>{p.name}</h3><span className={s.pkgAges}>{p.ages}</span>
          </div>
          <div className={s.pkgBody}>
            <div className={s.badges}><Badge color="greige">{p.cap}</Badge><Badge color="greige">{p.dur}</Badge></div>
            <ul className={s.incl}>{p.incl.map(i => <li key={i}><Icon name="43" size={16} color="var(--build-olive)" className={s.inclIcon} />{i}</li>)}</ul>
            <div className={s.pkgPrice}><span className={s.pkgFrom}>Desde</span><span className={s.pkgAmount}>{p.price}</span></div>
            <Button fullWidth variant={p.featured ? 'primary' : 'secondary'} onClick={() => toForm(p.k)}>Cotizar este paquete</Button>
          </div>
        </div>)}
      </Carousel>
    </Wrap>

    <Wrap className={s.block}>
      <div className={s.h2Gap}><H2>Cómo <Em>funciona</Em></H2></div>
      <div className={s.steps}>
        {STEPS.map(([ic, t, d, c], i) => <div key={t} className={s.step}>
          <span className={s.stepIcon} style={{ '--bg': `var(--build-${c})` } as Vars}><Icon name={ic} size={32} sizeMobile={26} color="var(--build-beige)" /></span>
          <div className={s.stepText}><span className={s.stepTitle}>{i + 1}. {t}</span><span className={s.stepDesc}>{d}</span></div>
        </div>)}
      </div>
    </Wrap>

    <Wrap className={s.block}>
      <div className={s.h2Gap}><H2>Galería</H2></div>
      <div className={s.gallery}>
        {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className={cx(s.galleryItem, i === 1 && s.galleryBig)}><ImageSlot placeholder="Foto de cumpleaños" /></div>)}
      </div>
    </Wrap>

    <Wrap className={s.block}>
      <div id="cotizar" className={cx(s.quote, anchorClass)}>
        <div className={s.quoteIntro}>
          <H2>Cotizá <Em>tu fiesta</Em></H2>
          <p className={s.quoteText}>Te respondemos por WhatsApp en menos de 24 horas.</p>
          <div className={cx(s.quoteShapes, 'desktop-only')}>
            <Shape name="04" size={46} color="var(--build-orange)" /><Shape name="03" size={40} color="var(--build-yellow)" /><Shape name="01" size={40} color="var(--build-olive)" /><Shape name="02" size={40} color="var(--build-celeste)" />
          </div>
        </div>
        {/* Simulated (prototype): confirms with a toast, no backend yet. */}
        <form className={s.form} onSubmit={e => { e.preventDefault(); if (wa) say('¡Recibimos tu solicitud! Te escribimos por WhatsApp para cotizar tu fiesta.'); }}>
          <Input label="Fecha" type="date" />
          <Input label="Cantidad de niños" type="number" min={1} placeholder="Ej. 15" />
          <Select label="Edad del cumpleañero" options={['1 año', '2 años', '3 años', '4 años', '5 años']} placeholder="Seleccioná" defaultValue="" />
          <Select label="Paquete" value={pkg} onChange={e => setPkg(e.target.value)} options={PACKAGES.map(p => ({ value: p.k, label: p.name }))} />
          <Input label="WhatsApp" type="tel" placeholder="8888 8888" value={wa} onChange={e => setWa(e.target.value)} className={s.span2} iconLeft={<Icon name="42" size={18} color="var(--build-ink-3)" />} />
          <div className={cx(s.span2, s.formActions)}>
            <Button type="submit" size="lg" fullWidthMobile disabled={!wa}>Enviar cotización</Button>
            <a href={CONTACT.whatsapp} className={s.waLink}>o escribinos por WhatsApp</a>
          </div>
        </form>
      </div>
    </Wrap>
  </div>;
}
