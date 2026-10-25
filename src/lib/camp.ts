// Camp data + helpers, ported from the Claude Design handoff (camp.js).
// Single source of truth: src/content/camp-data.json. Edit content there, not in components.
// Policy for the public site: anything marked pending (pendiente: true or "[...]" text) is hidden.
import raw from '@/content/camp-data.json';

type Pend = string | null | undefined | { pendiente?: boolean; placeholder?: string; [k: string]: unknown };

export interface Grupo {
  id: 'mini' | 'exploradores' | 'constructores'; nombre: string; color: string; edad: string; edad_min: number; edad_max: number;
  cupo: number; razon_adulto_nino: string; enfoque: string; formato: string; objetivo_temporada: string; por_que: string;
}
export interface Semana {
  n: number; fechas: string; fechas_corto: string; inicio: string; fin: string; tema: string; lema: string; objetivo: string;
  objetivos: Record<string, string>; modo: 'navidad' | 'normal'; pilar: string; se_lleva: Record<string, string>;
  aliado: { nombre?: string | null; pendiente?: boolean; placeholder?: string; logo?: Pend }; viernes_en_familia: string;
}
export interface Evento {
  id: string; nombre: string; fecha: string; fecha_texto: string; modo: 'navidad' | 'normal'; abierto_al_publico: boolean;
  agenda: { hora: string; que: string }[]; pelicula?: Pend; nota?: string; cierre?: string;
}
export interface Historia { id: string; nombre: string; grupo: string; texto: string; causa?: Pend }
export interface Paquete { id: string; nombre: string; semanas: number[]; precio?: number; descuento?: number }

// The JSON mixes plain values with { pendiente } objects; this view types only what the site reads.
export const CAMP = raw as unknown as {
  camp: { nombre: string; tagline: string; descripcion_corta: string; nota_familia: string; edades: { min: number; max: number } };
  lugar: { nombre: string; zona: string };
  horario: {
    dias: string; dias_corto?: string; inicio: string; fin: string;
    dia_tipo: { hora: string; fin?: string; que: string }[];
    viernes_en_familia: {
      inicio: string; fin: string; descripcion: string;
      muestra: { inicio: string; fin: string; precio: string };
      actividad_en_familia: { inicio: string; fin: string; precio: string; pendiente?: boolean };
    };
  };
  arco_semana: { dia: string; titulo: string; texto?: string }[];
  grupos: Grupo[]; historias_temporada: Historia[]; semanas: Semana[]; eventos: Evento[];
  precios: { semana: number; aplica_a: string; incluye: string[]; paquetes: Paquete[]; dia_suelto: { precio: number; condicion: string } };
  seguridad: { titulo: string; texto: string }[]; que_llevar: string[];
  faq: { p: string; r: string; pendiente?: boolean; pendiente_precio?: boolean }[];
  aliados: { pendiente?: boolean; lista: { nombre: string; rol: string }[]; co_marca: { nombre: string; logo: Pend & { src?: string; alt?: string } } };
  inscripciones: { abren: string; abren_texto: string; link: Pend };
  contacto: { whatsapp: string; whatsapp_link: string; whatsapp_mensaje: string; web: string; instagram: string };
  sitio: {
    barra_anuncio: { etiqueta: string; texto: string; cta: string }; destacado_cta: string;
    slide_in: { segundos: number; scroll: number }; ctas: { antes: string; despues: string; whatsapp: string };
  };
};

export const isPh = (v: unknown): v is string => typeof v === 'string' && /^\[.*\]$/.test(v.trim());
/** True when a value is still pending (object flag or "[...]" placeholder text). */
export const isPending = (v: Pend) => (v != null && typeof v === 'object' && !!v.pendiente) || isPh(v);
/** Text of a confirmed value, or null if pending/empty. */
export const confirmed = (v: Pend): string | null => (isPending(v) || v == null || typeof v === 'object' ? null : v);

export const COLOR: Record<string, string> = {
  community: 'var(--build-orange)', skills: 'var(--build-yellow)', joy: 'var(--build-olive)', family: 'var(--build-celeste)',
  orange: 'var(--build-orange)', yellow: 'var(--build-yellow)', olive: 'var(--build-olive)', celeste: 'var(--build-celeste)',
};
const DEEP: Record<string, string> = {
  community: 'var(--build-orange-deep)', skills: 'var(--build-yellow-deep)', joy: 'var(--build-olive-deep)', family: 'var(--build-celeste-deep)',
  orange: 'var(--build-orange-deep)', yellow: 'var(--build-yellow-deep)', olive: 'var(--build-olive-deep)', celeste: 'var(--build-celeste-deep)',
};
export const color = (k: string) => COLOR[k] ?? COLOR.community;
export const deep = (k: string) => DEEP[k] ?? 'var(--build-ink)';
/** Pillar icon -> shape number (dots, arrow, asterisk, heart). */
export const PILAR_SHAPE: Record<string, string> = { community: '04', skills: '03', joy: '01', family: '02' };
/** Group -> its signature shape. */
export const GRUPO_SHAPE: Record<string, string> = { mini: '53', exploradores: '52', constructores: '43' };

export const grupo = (id: string) => CAMP.grupos.find(g => g.id === id) ?? CAMP.grupos[0];
export const evento = (id: string) => CAMP.eventos.find(e => e.id === id) ?? CAMP.eventos[0];

export const crc = (n: number) => '₡' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const fechaCorta = (iso: string) => { const [, m, dd] = iso.split('-').map(Number); return dd + ' ' + MES[m - 1]; };
const S = CAMP.semanas;
/** "7 dic al 29 ene", from the first and last week. */
export const RANGO = fechaCorta(S[0].inicio) + ' al ' + fechaCorta(S[S.length - 1].fin);
export const EDADES = 'De ' + CAMP.camp.edades.min + ' a ' + CAMP.camp.edades.max + ' años';
export const HORARIO = CAMP.horario.dias + ', ' + CAMP.horario.inicio + ' a ' + CAMP.horario.fin;
export const LUGAR = CAMP.lugar.nombre + ', ' + CAMP.lugar.zona;
export const WA_LINK = CAMP.contacto.whatsapp_link + '?text=' + encodeURIComponent(CAMP.contacto.whatsapp_mensaje);
/** Confirmed payment link (Onvo), or null while pending. */
export const RESERVA_LINK = confirmed(CAMP.inscripciones.link);

/** Tagline: the payoff after the last comma goes bold. */
export function tituloPartes(t: string) { const i = t.lastIndexOf(', '); return i < 0 ? { a: '', b: t } : { a: t.slice(0, i + 1), b: t.slice(i + 2) }; }

function semanasTxt(list: number[], total: number) {
  const n = list.length;
  if (n === total) return 'Las ' + n + ' semanas';
  if (n === 1) return 'Semana ' + list[0];
  if (n === 2) return 'Semanas ' + list[0] + ' y ' + list[1];
  const contiguas = list.every((x, i) => i === 0 || x === list[i - 1] + 1);
  return contiguas ? 'Semanas ' + list[0] + ' a ' + list[n - 1] : 'Semanas ' + list.slice(0, -1).join(', ') + ' y ' + list[n - 1];
}

/** Packages: fixed price, savings = weekly price x weeks - price. */
export function paquetes() {
  const p = CAMP.precios, tot = S.length;
  return p.paquetes.map(k => {
    const n = k.semanas.length, bruto = p.semana * n, total = k.precio != null ? k.precio : Math.round(bruto * (1 - (k.descuento ?? 0)));
    return { ...k, n, total, totalTxt: crc(total), ahorroTxt: crc(bruto - total), porSemanaTxt: crc(total / n), semanasTxt: semanasTxt(k.semanas, tot) };
  });
}

/** Registration opens on inscripciones.abren (local date). `simular` forces a state for previews. */
export function inscripcionesAbiertas(now: Date, simular?: string | null) {
  if (simular === 'antes') return false;
  if (simular === 'despues') return true;
  const [y, m, dd] = CAMP.inscripciones.abren.split('-').map(Number);
  return now >= new Date(y, m - 1, dd);
}
