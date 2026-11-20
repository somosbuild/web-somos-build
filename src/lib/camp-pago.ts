// Camp prices for the registration form (to show the total) and the Netlify function that creates
// the ONVO checkout (to charge it). Prices come from camp-data.json only: the function recomputes the
// amount from the selection id, never from an amount the browser sends.
// Relative import on purpose: the Netlify function bundler doesn't know the "@/" alias.
import raw from '../content/camp-data.json';

type Semana = { n: number; inicio: string; fin: string; tema: string; fechas_corto: string };
const data = raw as unknown as {
  semanas: Semana[];
  precios: { semana: number; por_cantidad_semanas: Record<string, number>; dia_suelto: { precio: number }; paquetes: { id: string; semanas: number[]; precio?: number; descuento?: number }[] };
};
const precios = data.precios;
export const SEMANAS = data.semanas;
const TOTAL_SEMANAS = SEMANAS.length;

const paquete = (id: string) => {
  const k = precios.paquetes.find(p => p.id === id);
  if (!k) throw new Error(`Paquete "${id}" no existe en camp-data.json`);
  const n = k.semanas.length;
  return { n, precio: k.precio ?? Math.round(precios.semana * n * (1 - (k.descuento ?? 0))) };
};
const temporada = paquete('temporada');
export const PRECIO_SEMANA = precios.semana;
export const PRECIO_DIA = precios.dia_suelto.precio;
export const PRECIO_TEMPORADA = temporada.precio;

/**
 * Price per child for N weeks, whichever weeks: table precios.por_cantidad_semanas in camp-data.json
 * (1 = ₡85.000, 2 = ₡160.000, 3 = ₡230.000, 4 = ₡305.000, 5 = ₡380.000, 6 = ₡450.000).
 */
export function precioSemanas(n: number): number {
  const p = precios.por_cantidad_semanas[String(n)];
  if (p == null) throw new Error(`Falta el precio de ${n} semanas en camp-data.json`);
  return p;
}

/**
 * What the family picked: some weeks (all of them = full season) or one single day.
 * Encoded as an id for URLs and the server: "s1-2-3" (weeks) or "d2026-12-08" (single day).
 */
export type Seleccion = { tipo: 'semanas'; semanas: number[] } | { tipo: 'dia'; fecha: string };

export const seleccionId = (s: Seleccion) => s.tipo === 'dia' ? 'd' + s.fecha : 's' + s.semanas.join('-');

/** True if `fecha` (YYYY-MM-DD) is a Monday to Friday inside one of the camp weeks. */
export function diaDeCamp(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const d = new Date(fecha + 'T12:00:00Z'), wd = d.getUTCDay();
  return wd >= 1 && wd <= 5 && SEMANAS.some(w => fecha >= w.inicio && fecha <= w.fin);
}

/** Parses and validates a selection id; null if it isn't valid. */
export function leerSeleccion(id: string): Seleccion | null {
  if (id.startsWith('d')) { const fecha = id.slice(1); return diaDeCamp(fecha) ? { tipo: 'dia', fecha } : null; }
  if (!id.startsWith('s')) return null;
  const semanas = [...new Set(id.slice(1).split('-').map(Number))].sort((a, b) => a - b);
  if (!semanas.length || semanas.some(n => !SEMANAS.some(w => w.n === n))) return null;
  return { tipo: 'semanas', semanas };
}

export const precioPorNino = (s: Seleccion) => s.tipo === 'dia' ? PRECIO_DIA : precioSemanas(s.semanas.length);

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const lista = (xs: (string | number)[]) => xs.length < 2 ? String(xs[0] ?? '') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1];

/** "Temporada completa (6 semanas)", "Semanas 1, 2 y 3", "Semana 4", "Día suelto: martes 8 de diciembre". */
export function describirSeleccion(s: Seleccion): string {
  if (s.tipo === 'dia') { const d = new Date(s.fecha + 'T12:00:00Z'); return `Día suelto: ${DIAS[d.getUTCDay()]} ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`; }
  if (s.semanas.length === TOTAL_SEMANAS) return `Temporada completa (${TOTAL_SEMANAS} semanas)`;
  return (s.semanas.length === 1 ? 'Semana ' : 'Semanas ') + lista(s.semanas);
}

/** Online payment covers up to this many children; with more, Build follows up by WhatsApp. */
export const MAX_NINOS_PAGO = 2;

/** Total in colones for a selection and number of children, or null if it can't be paid online. */
export function totalPago(s: Seleccion | null, ninos: number): number | null {
  if (!s || !Number.isInteger(ninos) || ninos < 1 || ninos > MAX_NINOS_PAGO) return null;
  return precioPorNino(s) * ninos;
}
