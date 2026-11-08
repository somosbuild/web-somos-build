// Runs automatically on every verified Netlify Forms submission (event-triggered function: the file
// name "submission-created" is what wires it up; it has no public URL). Only the camp form is handled:
//   1. Confirmation email to the family, via Resend (env RESEND_API_KEY; domain somosbuild.com verified).
//   2. Client record in the Notion CRM "CRM de clientes Build" (env NOTION_TOKEN; the integration must be
//      connected to that database and to "Registro de eventos Build"). Same email = same record, updated.
// Each step is independent: if one fails, the other still runs and the error goes to the function logs.
// Relative JSON import on purpose: the Netlify bundler doesn't know the "@/" alias.
import raw from '../../src/content/camp-data.json';

const CAMP = raw as unknown as {
  camp: { nombre: string };
  lugar: { nombre: string; zona: string };
  horario: { dias: string; inicio: string; fin: string };
  semanas: { inicio: string; fin: string }[];
  contacto: { whatsapp: string; whatsapp_link: string };
};

const FORM = 'camp-interes';
const FROM = 'Build Summer Camp <hola@somosbuild.com>';
const REPLY_TO = 'hola@somosbuild.com';
/** Inbox preview line (preheader): shown next to the subject in most email apps. */
const PREHEADER = 'Las vacaciones no se cuentan, se construyen. Te contamos todo y cómo asegurar el cupo.';
/** Hidden copies for the Build team, from env CAMP_BCC (comma-separated). Kept out of the code: the repo is public. */
const bccEquipo = () => (process.env.CAMP_BCC ?? '').split(',').map(e => e.trim()).filter(e => EMAIL_RE.test(e));
/** Notion: "CRM de clientes Build" database and the "Build Summer Camp" page in "Registro de eventos Build". */
const NOTION_CRM_DB = '41211822-0611-8069-98b8-d0f6e4153b91';
const NOTION_EVENTO_CAMP = '41211822-0611-8074-9d7d-fa26ef8f82d6';
const NOTION_VERSION = '2022-06-28';
const TZ = 'America/Costa_Rica';

type Data = Record<string, string | undefined>;
export interface Registro {
  nombre: string; email: string; whatsapp: string; plan: string; pago: string; cantidad: string;
  ninos: { nombre: string; edad: string; grupo: string }[];
}

const t = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function leerRegistro(d: Data): Registro {
  const ninos = [1, 2, 3]
    .map(i => ({ nombre: t(d[`nino${i}_nombre`], 60), edad: t(d[`nino${i}_edad`], 3), grupo: t(d[`nino${i}_grupo`], 40) }))
    .filter(k => k.nombre);
  return {
    nombre: t(d.nombre, 80), email: t(d.email, 120).toLowerCase(), whatsapp: t(d.whatsapp, 30),
    plan: t(d.plan, 120), pago: t(d.pago, 200), cantidad: t(d.ninos, 3), ninos,
  };
}

/* ---------- Email ---------- */

const MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fechaLarga = (iso: string) => { const [, m, d] = iso.split('-').map(Number); return `${d} de ${MES[m - 1]}`; };
const S = CAMP.semanas;
const FECHAS = `Del ${fechaLarga(S[0].inicio)} al ${fechaLarga(S[S.length - 1].fin)}`;
const HORARIO = `${CAMP.horario.dias}, ${CAMP.horario.inicio} a ${CAMP.horario.fin}`;
const LUGAR = `${CAMP.lugar.nombre}, ${CAMP.lugar.zona}`;

/** Next steps depend on what the family chose (the `pago` field exists once ONVO payments are live). */
export function proximosPasos(pago: string): string {
  if (/^ONVO iniciado/i.test(pago)) return 'Si completaste el pago, ONVO te envía el comprobante a este correo. Te escribimos por WhatsApp para coordinar las semanas.';
  if (/^Pago pendiente/i.test(pago)) return 'Te guardamos el cupo por 24 horas. Te enviamos por WhatsApp el link de pago; tu cupo queda confirmado cuando se recibe el pago.';
  return 'Te escribimos por WhatsApp para confirmar tu cupo y coordinar el pago.';
}

export function correoHtml(r: Registro): { subject: string; html: string; text: string } {
  const primer = r.nombre.split(/\s+/)[0] || r.nombre;
  const monto = r.pago.match(/₡\d{1,3}(?:\.\d{3})*/)?.[0];
  const ninos = r.ninos.map(k => `${k.nombre}${k.edad ? `, ${k.edad} años` : ''}${k.grupo ? ` (${k.grupo})` : ''}`);
  const filas: [string, string][] = [
    [r.ninos.length === 1 ? 'Niño' : 'Niños', ninos.join('<br>') || '—'],
    ...(r.cantidad === '3+' ? [['Nota', 'Registraste 3 o más niños: te contactamos para completar el registro.'] as [string, string]] : []),
    ...(r.plan ? [['Plan', esc(r.plan)] as [string, string]] : []),
    ...(monto ? [['Total', monto] as [string, string]] : []),
  ];
  const pasos = proximosPasos(r.pago);
  const row = ([k, v]: [string, string]) =>
    `<tr><td style="padding:8px 0;color:#6b5646;font-size:14px;vertical-align:top;width:90px">${k}</td><td style="padding:8px 0;color:#3a2a1e;font-size:15px;font-weight:600">${v}</td></tr>`;
  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#fcf3ea;font-family:Helvetica,Arial,sans-serif;color:#3a2a1e">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all">${esc(PREHEADER)}${'&#847;&zwnj;&nbsp;'.repeat(60)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fcf3ea;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden">
<tr><td style="background:#fd7e28;height:8px;font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:28px 28px 8px">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#c2530c;font-weight:700">${esc(CAMP.camp.nombre)}</p>
<h1 style="margin:0 0 14px;font-family:Georgia,serif;font-size:28px;line-height:1.15;color:#fd7e28">¡Recibimos tu registro, ${esc(primer)}!</h1>
<p style="margin:0 0 18px;font-size:16px;line-height:1.55">Gracias por querer construir estas vacaciones con nosotros. Este es el resumen de lo que nos enviaste:</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #fcf3ea;border-bottom:2px solid #fcf3ea">${filas.map(([k, v]) => row([k, k === 'Niño' || k === 'Niños' ? v.split('<br>').map(esc).join('<br>') : v])).join('')}</table>
<p style="margin:20px 0 6px;font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:#6b5646;font-weight:700">Próximo paso</p>
<p style="margin:0 0 22px;font-size:16px;line-height:1.55">${esc(pasos)}</p>
<p style="margin:0 0 22px"><a href="${CAMP.contacto.whatsapp_link}" style="display:inline-block;background:#fd7e28;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:999px">Escribinos por WhatsApp</a></p>
</td></tr>
<tr><td style="background:#fcf3ea;padding:18px 28px;font-size:14px;line-height:1.6;color:#6b5646">
<strong style="color:#3a2a1e">${esc(CAMP.camp.nombre)}</strong><br>${FECHAS} · ${HORARIO}<br>${LUGAR} · WhatsApp ${CAMP.contacto.whatsapp}
</td></tr></table>
<p style="margin:14px 0 0;font-size:12px;color:#6b5646">Recibiste este correo porque te registraste en somosbuild.com/camp.</p>
</td></tr></table></body></html>`;
  const text = [
    `¡Recibimos tu registro, ${primer}!`, '',
    ...filas.map(([k, v]) => `${k}: ${v.replace(/<br>/g, ', ')}`), '',
    `Próximo paso: ${pasos}`, '',
    `${CAMP.camp.nombre} · ${FECHAS} · ${HORARIO} · ${LUGAR}`, `WhatsApp: ${CAMP.contacto.whatsapp} (${CAMP.contacto.whatsapp_link})`,
  ].join('\n');
  return { subject: `Recibimos tu registro al ${CAMP.camp.nombre}`, html, text };
}

async function enviarCorreo(r: Registro) {
  const key = process.env.RESEND_API_KEY;
  if (!key) { console.warn('Correo omitido: falta RESEND_API_KEY'); return; }
  if (!EMAIL_RE.test(r.email)) { console.warn('Correo omitido: email inválido'); return; }
  const { subject, html, text } = correoHtml(r);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [r.email], ...(bccEquipo().length ? { bcc: bccEquipo() } : {}), reply_to: REPLY_TO, subject, html, text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/* ---------- Notion CRM ---------- */

async function notion(path: string, method: string, body?: unknown) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: { Authorization: `Bearer ${process.env.NOTION_TOKEN}`, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Notion ${method} ${path} ${res.status}: ${JSON.stringify(json).slice(0, 300)}`);
  return json as Record<string, any>;
}

const txt = (content: string) => [{ type: 'text', text: { content: content.slice(0, 1900) } }];
const hoy = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const ahoraTxt = (d: Date) => new Intl.DateTimeFormat('es-CR', { timeZone: TZ, dateStyle: 'long', timeStyle: 'short' }).format(d);

/** Blocks appended to the client page: one entry per web registration. */
export function bloquesRegistro(r: Registro, cuando: Date) {
  const items = [
    ...r.ninos.map(k => `Niño: ${k.nombre}${k.edad ? `, ${k.edad} años` : ''}${k.grupo ? ` (${k.grupo})` : ''}`),
    ...(r.cantidad === '3+' ? ['Registró 3 o más niños: completar el registro por WhatsApp'] : []),
    `Plan: ${r.plan || 'Sin elegir'}`,
    `Pago: ${r.pago || 'Por coordinar (formulario sin pago en línea)'}`,
    `WhatsApp: ${r.whatsapp}`,
  ];
  return [
    { object: 'block', type: 'heading_3', heading_3: { rich_text: txt(`Registro web · ${CAMP.camp.nombre} · ${ahoraTxt(cuando)}`) } },
    ...items.map(i => ({ object: 'block', type: 'bulleted_list_item', bulleted_list_item: { rich_text: txt(i) } })),
  ];
}

async function guardarEnCrm(r: Registro, cuando: Date) {
  if (!process.env.NOTION_TOKEN) { console.warn('CRM omitido: falta NOTION_TOKEN'); return; }
  if (!EMAIL_RE.test(r.email)) { console.warn('CRM omitido: email inválido'); return; }
  const q = await notion(`/databases/${NOTION_CRM_DB}/query`, 'POST', { filter: { property: 'Correo', email: { equals: r.email } }, page_size: 1 });
  const existente = (q.results as any[])?.[0];
  let pageId: string;
  if (existente) {
    pageId = existente.id;
    const asistidos: { id: string }[] = existente.properties?.['Eventos Asistidos']?.relation ?? [];
    const norm = (id: string) => id.replace(/-/g, '');
    const props: Record<string, unknown> = {};
    if (r.whatsapp) props['Teléfono'] = { phone_number: r.whatsapp };
    if (!asistidos.some(a => norm(a.id) === norm(NOTION_EVENTO_CAMP))) props['Eventos Asistidos'] = { relation: [...asistidos, { id: NOTION_EVENTO_CAMP }] };
    if (Object.keys(props).length) await notion(`/pages/${pageId}`, 'PATCH', { properties: props });
  } else {
    const nueva = await notion('/pages', 'POST', {
      parent: { database_id: NOTION_CRM_DB },
      properties: {
        'Cliente o familia': { title: txt(r.nombre || r.email) },
        Correo: { email: r.email },
        'Teléfono': { phone_number: r.whatsapp || null },
        'Cliente desde': { date: { start: hoy(cuando) } },
        'Evento Origen': { relation: [{ id: NOTION_EVENTO_CAMP }] },
        'Eventos Asistidos': { relation: [{ id: NOTION_EVENTO_CAMP }] },
      },
    });
    pageId = nueva.id;
  }
  await notion(`/blocks/${pageId}/children`, 'PATCH', { children: bloquesRegistro(r, cuando) });
}

/* ---------- Handler ---------- */

/** Core logic, independent of the function format (also used by tests). */
export async function procesar(payload: { form_name?: string; data?: Data; created_at?: string }) {
  console.log('submission-created:', payload.form_name ?? '(sin form_name)');
  if (payload.form_name !== FORM || !payload.data) return 'ignored';
  const r = leerRegistro(payload.data);
  const cuando = payload.created_at ? new Date(payload.created_at) : new Date();
  const [mail, crm] = await Promise.allSettled([enviarCorreo(r), guardarEnCrm(r, cuando)]);
  if (mail.status === 'rejected') console.error('Error enviando correo:', mail.reason);
  else console.log('Correo procesado');
  if (crm.status === 'rejected') console.error('Error guardando en Notion:', crm.reason);
  else console.log('CRM procesado');
  return 'ok';
}

// Classic (Lambda-compatible) format: the documented one for Netlify event-triggered functions.
// The event body is JSON with { payload: { form_name, data, created_at, ... } }.
export const handler = async (event: { body: string | null }) => {
  let payload: { form_name?: string; data?: Data; created_at?: string };
  try { payload = JSON.parse(event.body ?? '{}').payload ?? {}; } catch { return { statusCode: 400, body: 'bad request' }; }
  return { statusCode: 200, body: await procesar(payload) };
};
