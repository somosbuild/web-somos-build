'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import s from './site.module.css';
import { Icon, Toast } from '@/components/ds';
import type { BuildEvent } from '@/lib/data';
import { EventDetail, ReserveDialog } from './EventOverlays';
import { MobileBar } from './MobileBar';

interface SiteState {
  openEvent: (e: BuildEvent) => void;
  reserveEvent: (e: BuildEvent) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  /** Agenda's mobile filter sheet hides the bottom bar while open. */
  setSheetLock: (v: boolean) => void;
  /** Show a confirmation toast. */
  say: (t: string) => void;
}

const Ctx = createContext<SiteState | null>(null);
export const useSite = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useSite must be used inside <SiteProvider>');
  return c;
};

export function SiteProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [detail, setDetail] = useState<BuildEvent | null>(null);
  const [reserve, setReserve] = useState<BuildEvent | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetLock, setSheetLock] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => { setMenuOpen(false); setDetail(null); }, [pathname]);

  const say = useCallback((t: string) => {
    setToast(t);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3800);
  }, []);

  // Simulated booking (Fase 1): no backend, confirmation via toast.
  const reserveEvent = useCallback((e: BuildEvent) => {
    setDetail(null);
    if (!e.spots) say('Te agregamos a la lista de espera de ' + e.title + '. Te avisamos por WhatsApp.');
    else setReserve(e);
  }, [say]);

  const done = (e: BuildEvent, name: string) => {
    setReserve(null);
    say('¡Listo, ' + name.trim().split(' ')[0] + '! Tu cupo para ' + e.title + ' está reservado.');
  };

  const value: SiteState = { openEvent: setDetail, reserveEvent, menuOpen, setMenuOpen, setSheetLock, say };
  // Activity pages carry their own sticky reserve bar on mobile.
  const onActivityPage = /^\/actividades\/[^/]+\/?$/.test(pathname);

  return <Ctx.Provider value={value}>
    {children}
    <MobileBar hidden={menuOpen || !!detail || sheetLock || !!reserve || onActivityPage} />
    {detail && <EventDetail e={detail} onClose={() => setDetail(null)} onReserve={reserveEvent} />}
    {reserve && <ReserveDialog key={reserve.id} event={reserve} onClose={() => setReserve(null)} onDone={done} />}
    {toast && <div className={s.toastHost}>
      <Toast tone="success" icon={<Icon name="43" size={18} color="var(--build-beige)" />} onClose={() => setToast(null)}>{toast}</Toast>
    </div>}
  </Ctx.Provider>;
}
