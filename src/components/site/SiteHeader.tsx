'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import s from './site.module.css';
import { Button, Logo, Shape } from '@/components/ds';
import { NAV } from '@/lib/data';
import { Wrap } from './shared';
import { useSite } from './SiteProvider';

function Hamburger({ open }: { open: boolean }) {
  return <span className={s.burgerBox}>
    <span className={s.burgerBar} style={{ transform: open ? 'rotate(45deg)' : 'translateY(-7px)' }} />
    <span className={s.burgerBar} style={{ opacity: open ? 0 : 1 }} />
    <span className={s.burgerBar} style={{ transform: open ? 'rotate(-45deg)' : 'translateY(7px)' }} />
  </span>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { menuOpen, setMenuOpen } = useSite();
  const isOn = (href: string) => (pathname.endsWith('/') ? pathname : pathname + '/').startsWith(href);
  const go = (href: string) => { setMenuOpen(false); router.push(href); };

  return <>
    <header className={s.header}>
      <Wrap className={s.headerInner}>
        <Link href="/" aria-label="Build — inicio" className={s.headerLogo} onClick={() => setMenuOpen(false)}><Logo width={190} widthMobile={148} /></Link>
        <nav className={s.nav} aria-label="Principal">
          {NAV.map(n => <Link key={n.href} href={n.href} aria-current={isOn(n.href) ? 'page' : undefined} className={`${s.navLink} ${isOn(n.href) ? s.navLinkOn : ''}`}>{n.label}</Link>)}
        </nav>
        <Button size="sm" className={s.headerCta} onClick={() => go('/agenda/')}>Reservar</Button>
        <button aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="menu-movil" onClick={() => setMenuOpen(!menuOpen)} className={s.burger}><Hamburger open={menuOpen} /></button>
      </Wrap>
    </header>
    {menuOpen && <div id="menu-movil" className={s.menu}>
      <nav aria-label="Menú">
        {NAV.map(n => <Link key={n.href} href={n.href} onClick={() => setMenuOpen(false)} aria-current={isOn(n.href) ? 'page' : undefined} className={`${s.menuLink} ${isOn(n.href) ? s.menuLinkOn : ''}`}>{n.label}</Link>)}
      </nav>
      <div className={s.menuCtas}>
        <Button size="lg" fullWidth onClick={() => go('/agenda/')}>Reservar</Button>
        <Button size="lg" variant="secondary" fullWidth onClick={() => go('/nosotros/#llegar')}>Cómo llegar</Button>
      </div>
      <div className={s.menuShapes}>
        <Shape name="04" size={46} color="var(--build-orange)" /><Shape name="03" size={40} color="var(--build-yellow)" /><Shape name="01" size={40} color="var(--build-olive)" /><Shape name="02" size={40} color="var(--build-celeste)" />
      </div>
    </div>}
  </>;
}
