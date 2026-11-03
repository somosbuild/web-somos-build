'use client';

// Camp entry points added to the pre-opening landing: announcement bar, featured block and slide-in.
import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import s from './camp.module.css';
import { ButtonLink, Icon, Logo, Shape } from '@/components/ds';
import { asset } from '@/lib/asset';
import { CAMP, EDADES, FOTO, HORARIO, LUGAR, RANGO, tituloPartes } from '@/lib/camp';
import { FotoPlaceholder, GrupoChip, useInscripciones } from './parts';

const CAMP_HREF = '/camp/';
const ss = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string) => { try { sessionStorage.setItem(k, '1'); } catch { /* storage blocked */ } },
};

/** Orange bar above the header. Closing hides it for the rest of the visit. */
export function BarraAnuncio({ variant = 'landing', onCta }: { variant?: 'landing' | 'camp'; onCta?: () => void }) {
  const KEY = 'build-camp-barra-cerrada';
  const [cerrada, setCerrada] = useState(false);
  const insc = useInscripciones();
  useEffect(() => { if (ss.get(KEY)) setCerrada(true); }, []);
  if (cerrada) return null;
  const b = CAMP.sitio.barra_anuncio;
  const enCamp = variant === 'camp';
  const texto = !enCamp ? b.texto + ' · ' + RANGO : insc.abiertas ? 'Inscripciones abiertas · ' + RANGO : 'Inscripciones abren el ' + CAMP.inscripciones.abren_texto;
  const cta = (enCamp ? insc.label : b.cta) + ' →';
  return <div role="region" aria-label="Anuncio" className={s.bar}>
    <div className={s.barInner}>
      <span className={s.barTag}>{b.etiqueta}</span>
      <span>{texto}</span>
      {!enCamp ? <Link href={CAMP_HREF} className={s.barLink}>{cta}</Link>
        : insc.mode === 'form' ? <button type="button" className={s.barLink} onClick={onCta}>{cta}</button>
        : <a href={insc.href} target="_blank" rel="noopener noreferrer" className={s.barLink}>{cta}</a>}
      <button type="button" aria-label="Cerrar anuncio" className={s.barClose} onClick={() => { ss.set(KEY); setCerrada(true); }}>×</button>
    </div>
  </div>;
}

/** White card on the landing that leads to /camp. */
export function CampDestacado() {
  const t = tituloPartes(CAMP.camp.tagline);
  return <section className={s.featuredWrap} aria-labelledby="camp-destacado">
    <article className={s.featured}>
      <div className={s.featuredPhoto}>
        <FotoPlaceholder frame="yellow" ratio="5 / 4" shapeSize={64} src={FOTO} desc="Niños construyendo una ciudad de cartón en la plazoleta de City Place">
          <Logo width={150} />
        </FotoPlaceholder>
      </div>
      <div className={s.featuredCopy}>
        <span className={s.pillTag}>{CAMP.sitio.barra_anuncio.etiqueta}: camp de vacaciones</span>
        <h2 id="camp-destacado" className={s.featuredTitle}>{t.a} <strong>{t.b}</strong></h2>
        <p className={s.featuredName}>{CAMP.camp.nombre}</p>
        <div className={s.featuredInfo}>
          <span><Icon name="04" size={22} color="var(--build-orange-deep)" />{RANGO} · {HORARIO}</span>
          <span><Icon name="20" size={22} color="var(--build-orange-deep)" />{LUGAR}</span>
        </div>
        <div className={s.chips}>{CAMP.grupos.map(g => <GrupoChip key={g.id} id={g.id} size="sm" />)}</div>
        <ButtonLink href={asset(CAMP_HREF)} size="lg" className={s.featuredCta}>{CAMP.sitio.destacado_cta}</ButtonLink>
      </div>
    </article>
  </section>;
}

/**
 * Bottom-right card that slides in after N seconds or X% scroll, once per visit.
 * `bottom` lifts it above the landing's WhatsApp button so they never overlap.
 */
export function CampSlideIn({ bottom = 16 }: { bottom?: number }) {
  const KEY = 'build-camp-slidein-visto';
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (ss.get(KEY)) return;
    const cfg = CAMP.sitio.slide_in;
    let done = false;
    const show = () => { if (done) return; done = true; cleanup(); ss.set(KEY); setOpen(true); };
    const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; if (h > 0 && scrollY / h >= cfg.scroll) show(); };
    const t = setTimeout(show, cfg.segundos * 1000);
    addEventListener('scroll', onScroll, { passive: true });
    const cleanup = () => { clearTimeout(t); removeEventListener('scroll', onScroll); };
    return cleanup;
  }, []);
  const b = CAMP.sitio.barra_anuncio;
  return <aside aria-label="Camp de vacaciones" aria-hidden={!open} inert={!open} className={`${s.slide} ${open ? s.slideOpen : ''}`} style={{ '--b': `${bottom}px` } as CSSProperties}>
    <div className={s.slideBox}>
      <div className={s.slideTile}>
        <Shape name="52" size={52} color="var(--build-beige)" className={s.abs} style={{ left: 10, bottom: 10 }} />
        <Shape name="01" size={30} color="var(--build-orange)" className={s.abs} style={{ right: 6, top: 6 }} />
      </div>
      <div className={s.slideText}>
        <span className={s.slideTag}>{b.etiqueta}</span>
        <strong className={s.slideTitle}>{b.texto}</strong>
        <span className={s.slideMeta}>{RANGO} · {EDADES}</span>
        <ButtonLink href={asset(CAMP_HREF)} size="sm" className={s.slideCta}>{CAMP.sitio.destacado_cta}</ButtonLink>
      </div>
      <button type="button" aria-label="Cerrar" className={s.slideClose} onClick={() => setOpen(false)}>×</button>
    </div>
  </aside>;
}
