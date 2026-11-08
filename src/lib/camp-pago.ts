// Camp payment plans, shared by the registration form (to show the total) and the Netlify
// function that creates the ONVO checkout (to charge it). Prices come from camp-data.json only:
// the function recomputes the amount from the plan id, never from what the browser sends.
// Relative import on purpose: the Netlify function bundler doesn't know the "@/" alias.
import raw from '../content/camp-data.json';

const precios = (raw as unknown as {
  precios: { semana: number; paquetes: { id: string; semanas: number[]; precio?: number; descuento?: number }[] };
}).precios;

export interface PlanPago { id: string; label: string; semanas: number; precio: number }

const paquete = (id: string) => {
  const k = precios.paquetes.find(p => p.id === id);
  if (!k) throw new Error(`Paquete "${id}" no existe en camp-data.json`);
  const n = k.semanas.length;
  return { n, precio: k.precio ?? Math.round(precios.semana * n * (1 - (k.descuento ?? 0))) };
};
const dic = paquete('diciembre'), ene = paquete('enero'), tem = paquete('temporada');

/** Plans offered in the camp form, in display order. Weeks for "1 semana" are coordinated later by WhatsApp. */
export const PLANES_PAGO: PlanPago[] = [
  { id: 'semana', label: '1 semana', semanas: 1, precio: precios.semana },
  { id: 'diciembre', label: `Diciembre: ${dic.n} semanas`, semanas: dic.n, precio: dic.precio },
  { id: 'enero', label: `Enero: ${ene.n} semanas`, semanas: ene.n, precio: ene.precio },
  { id: 'temporada', label: `Camp completo: ${tem.n} semanas`, semanas: tem.n, precio: tem.precio },
];

/** Online payment covers up to this many children; with more, Build follows up by WhatsApp. */
export const MAX_NINOS_PAGO = 2;

export const planPago = (id: string) => PLANES_PAGO.find(p => p.id === id) ?? null;

/** Total in colones for a plan and number of children, or null if the combination can't be paid online. */
export function totalPago(planId: string, ninos: number): number | null {
  const p = planPago(planId);
  if (!p || !Number.isInteger(ninos) || ninos < 1 || ninos > MAX_NINOS_PAGO) return null;
  return p.precio * ninos;
}
