'use client';

import { useEffect, useId, type CSSProperties, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';
import s from './ds.module.css';
import { asset } from '@/lib/asset';
import type { BrandColor, PillarKey } from '@/lib/data';

type Vars = CSSProperties & Record<`--${string}`, string | number | undefined>;
const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
const px = (n?: number) => (n === undefined ? undefined : `${n}px`);

/* ---------- Brand ---------- */

interface MaskProps { name: string; size?: number; sizeMobile?: number; color?: string; className?: string; style?: CSSProperties }

function Mask({ url, size = 24, sizeMobile, color, className, style, ...aria }: Omit<MaskProps, 'name'> & { url: string; role?: string; 'aria-label'?: string; 'aria-hidden'?: boolean }) {
  const v: Vars = { '--s': px(size), '--s-m': px(sizeMobile), '--c': color, '--m': `url(${url})`, ...style };
  return <span {...aria} className={cx(s.mask, className)} style={v} />;
}

/** One of the 58 flat UI icons (assets/icons/ui), recoloured via CSS mask. */
export function Icon({ name, title, ...p }: MaskProps & { title?: string }) {
  const n = name.padStart(2, '0');
  return <Mask {...p} url={asset(`/brand/icons/icon-${n}.png`)} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true} />;
}

/** One of the 69 building-block shapes (assets/shapes), recoloured via CSS mask. Decorative. */
export function Shape({ name, size = 64, color = 'var(--build-orange)', ...p }: MaskProps) {
  const n = name.padStart(2, '0');
  return <Mask {...p} size={size} color={color} url={asset(`/brand/shapes/shape-${n}.png`)} aria-hidden />;
}

/** Main logo: 4 pillar icons + BUILD + Community descriptor. */
export function Logo({ width, widthMobile, alt = 'Build' }: { width: number | string; widthMobile?: number | string; alt?: string }) {
  const w = typeof width === 'number' ? px(width) : width;
  const wm = typeof widthMobile === 'number' ? px(widthMobile) : widthMobile;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={s.logo} src={asset('/brand/logos/lockup-community.png')} alt={alt} width={1200} height={304} style={{ '--w': w, '--w-m': wm } as Vars} />;
}

/* ---------- Core ---------- */

type ButtonVariant = 'primary' | 'sunny' | 'secondary' | 'ghost';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** Full width only below 768px. */
  fullWidthMobile?: boolean;
  iconLeft?: ReactNode;
}
export function Button({ variant = 'primary', size = 'md', fullWidth, fullWidthMobile, iconLeft, className, type = 'button', children, ...rest }: ButtonProps) {
  return <button type={type} {...rest} className={cx(s.btn, s[size], s[variant], fullWidth && s.full, fullWidthMobile && s.fullMobile, className)}>{iconLeft}{children}</button>;
}

export function IconButton({ label, size = 44, children, className, style, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; size?: number }) {
  return <button type="button" aria-label={label} title={label} {...rest} className={cx(s.iconBtn, s.iconSoft, className)} style={{ '--s': px(size), ...style } as Vars}>{children}</button>;
}

const BADGE: Record<string, [string, string]> = {
  orange: ['var(--build-orange)', '#fff'], yellow: ['var(--build-yellow)', 'var(--build-ink)'], olive: ['var(--build-olive)', '#fff'],
  celeste: ['var(--build-celeste)', 'var(--build-ink)'], beige: ['var(--build-beige)', 'var(--build-ink)'], greige: ['var(--build-greige)', 'var(--build-ink)'],
};
export function Badge({ color = 'orange', children, className }: { color?: BrandColor | 'beige' | 'greige'; children: ReactNode; className?: string }) {
  const [bg, fg] = BADGE[color];
  return <span className={cx(s.badge, className)} style={{ '--bg': bg, '--fg': fg } as Vars}>{children}</span>;
}

/** The "BUILDING ___ TOGETHER" descriptor bar as a tag. Square corners, Lilita One. */
export function PillarTag({ pillar, size = 'md', label, className }: { pillar: PillarKey; size?: 'sm' | 'md' | 'lg'; label?: string; className?: string }) {
  const fs = size === 'sm' ? 12 : size === 'lg' ? 22 : 16;
  return <span className={cx(s.pillarTag, className)} style={{ '--bg': `var(--pillar-${pillar})`, '--fs': px(fs) } as Vars}>{label ?? `Building ${pillar} together`}</span>;
}

/* ---------- Layout ---------- */

export function Card({ interactive, media, padding = 28, onClick, children, className }: { interactive?: boolean; media?: ReactNode; padding?: number; onClick?: () => void; children: ReactNode; className?: string }) {
  return <div className={cx(s.card, interactive && s.cardInteractive, className)} onClick={onClick}>
    {media}
    <div className={s.cardBody} style={{ padding }}>{children}</div>
  </div>;
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label?: string }) {
  return <div role="tablist" aria-label={label} className={s.tabs}>
    {tabs.map(t => <button key={t.value} role="tab" aria-selected={t.value === value} className={cx(s.tab, t.value === value && s.tabOn)} onClick={() => onChange(t.value)}>{t.label}</button>)}
  </div>;
}

/* ---------- Feedback ---------- */

/** Closes on Escape while mounted. */
export function useEscape(onEscape: () => void) {
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onEscape(); };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [onEscape]);
}

export function Dialog({ onClose, title, children, actions, accent = 'var(--build-yellow)', width = 480 }: { onClose: () => void; title?: string; children: ReactNode; actions?: ReactNode; accent?: string; width?: number }) {
  const id = useId();
  useEscape(onClose);
  return <div className={s.scrim} onClick={onClose}>
    <div role="dialog" aria-modal="true" aria-labelledby={title ? id : undefined} className={s.dialog} style={{ '--w': px(width), '--accent': accent } as Vars} onClick={e => e.stopPropagation()}>
      <div className={s.dialogAccent} />
      <div className={s.dialogBody}>
        {title && <h3 id={id} className={s.dialogTitle}>{title}</h3>}
        <div className={s.dialogContent}>{children}</div>
        {actions && <div className={s.dialogActions}>{actions}</div>}
      </div>
    </div>
  </div>;
}

const TONE = { success: 'var(--build-olive)', info: 'var(--build-celeste)', warning: 'var(--build-yellow)', brand: 'var(--build-orange)' };
export function Toast({ tone = 'brand', icon, children, onClose }: { tone?: keyof typeof TONE; icon?: ReactNode; children: ReactNode; onClose?: () => void }) {
  return <div role="status" className={s.toast}>
    <span className={s.toastIcon} style={{ '--tone': TONE[tone] } as Vars}>{icon}</span>
    <span className={s.toastText}>{children}</span>
    {onClose && <button onClick={onClose} aria-label="Cerrar" className={s.toastClose}>×</button>}
  </div>;
}

/* ---------- Forms ---------- */

export function Input({ label, iconLeft, error, className, ...rest }: InputHTMLAttributes<HTMLInputElement> & { label?: string; iconLeft?: ReactNode; error?: string }) {
  return <label className={cx(s.field, className)}>
    {label && <span className={s.label}>{label}</span>}
    <span className={s.inputWrap}>{iconLeft}<input {...rest} aria-invalid={!!error || undefined} className={s.input} /></span>
    {error && <span className={s.fieldError}>{error}</span>}
  </label>;
}

type Option = string | { value: string; label: string };
export function Select({ label, options, placeholder, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: Option[]; placeholder?: string }) {
  return <label className={cx(s.field, className)}>
    {label && <span className={s.label}>{label}</span>}
    <span className={s.selectWrap}>
      <select {...rest} className={s.select}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span aria-hidden="true" className={s.selectChevron} />
    </span>
  </label>;
}

export function Checkbox({ label, color = 'var(--build-orange)', ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; color?: string }) {
  return <label className={s.check} style={{ '--c': color } as Vars}>
    <input type="checkbox" {...rest} className={s.checkInput} />
    <span className={s.checkBox}><span className={s.checkMark} /></span>{label}
  </label>;
}

export function Radio({ label, color = 'var(--build-orange)', ...rest }: InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; color?: string }) {
  return <label className={s.check} style={{ '--c': color } as Vars}>
    <input type="radio" {...rest} className={s.checkInput} />
    <span className={s.radioBox}><span className={s.radioDot} /></span>{label}
  </label>;
}
