// Creates an ONVO one-time checkout link for a camp registration and returns its URL.
// The secret key lives only in Netlify (Site settings > Environment variables > ONVO_SECRET_KEY);
// it is never sent to the browser. The amount is recomputed here from camp-data.json.
// API: POST https://api.onvopay.com/v1/checkout/sessions/one-time-link (Bearer secret key).
import { MAX_NINOS_PAGO, planPago, totalPago } from '../../src/lib/camp-pago';

const ONVO_URL = 'https://api.onvopay.com/v1/checkout/sessions/one-time-link';
/** ONVO amounts are in céntimos (minor units): ₡85.000 -> 8500000. Confirmed with a test checkout. */
const CENTIMOS = 100;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/**
 * ONVO (live mode) only accepts phones in international format, e.g. +50688888888.
 * Families type "8888-8888", "8888 8888", "+506 8888-8888"... Costa Rican 8-digit numbers get +506;
 * an explicit international number (+ or 00 prefix) is kept. Anything else -> null, and the checkout
 * is created without phone (optional for ONVO; the number is still saved in Netlify Forms and Notion).
 */
export function telefonoE164(raw: string): string | null {
  const t = raw.trim();
  const d = t.replace(/\D/g, '');
  if (/^[24678]\d{7}$/.test(d)) return '+506' + d;               // local CR number
  if (/^506[24678]\d{7}$/.test(d)) return '+' + d;               // 506 prefix without +
  if (/^00\d{8,15}$/.test(d) && t.startsWith('00')) return '+' + d.slice(2);
  if (t.startsWith('+') && /^\d{8,15}$/.test(d)) return '+' + d; // other countries
  return null;
}

export default async (req: Request) => {
  if (req.method !== 'POST') return json(405, { error: 'Método no permitido' });
  const key = process.env.ONVO_SECRET_KEY;
  if (!key) { console.error('Falta ONVO_SECRET_KEY'); return json(500, { error: 'Pago no configurado' }); }

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json(400, { error: 'Datos inválidos' }); }

  const planId = texto(body.plan, 20), ninos = Number(body.ninos);
  const plan = planPago(planId), total = totalPago(planId, ninos);
  if (!plan || total == null) return json(400, { error: `Plan o cantidad de niños inválida (máximo ${MAX_NINOS_PAGO})` });

  const nombre = texto(body.nombre, 80), telefono = texto(body.whatsapp, 30), email = texto(body.email, 120);
  if (!nombre || telefono.replace(/\D/g, '').length < 8) return json(400, { error: 'Faltan nombre o teléfono' });
  const nombresNinos = Array.isArray(body.nombres_ninos) ? body.nombres_ninos.slice(0, ninos).map(n => texto(n, 60)).join(', ') : '';

  // Back to the same site (works on deploy previews too).
  const origin = new URL(req.url).origin;
  const payload = {
    customerName: nombre,
    ...(telefonoE164(telefono) ? { customerPhone: telefonoE164(telefono) } : {}),
    ...(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? { customerEmail: email } : {}),
    redirectUrl: `${origin}/camp/?pago=ok&monto=${total}&plan=${plan.id}`, // monto/plan: Purchase conversion for Meta/GA4
    lineItems: [{
      quantity: ninos,
      unitAmount: plan.precio * CENTIMOS,
      currency: 'CRC',
      description: `Build Summer Camp · ${plan.label} (por niño)`,
    }],
    metadata: { origen: 'web-camp', plan: plan.id, ninos: String(ninos), ninos_nombres: nombresNinos, total_crc: String(total) },
  };

  try {
    const res = await fetch(ONVO_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({})) as { url?: string; message?: unknown };
    if (!res.ok || !data.url) {
      console.error('ONVO respondió', res.status, JSON.stringify(data).slice(0, 500));
      return json(502, { error: 'No pudimos crear el pago' });
    }
    return json(200, { url: data.url });
  } catch (e) {
    console.error('Error llamando a ONVO', e);
    return json(502, { error: 'No pudimos crear el pago' });
  }
};

export const config = { path: '/api/onvo-checkout' };
