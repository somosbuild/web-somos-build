// Marketing measurement: Meta Pixel, GA4 and Microsoft Clarity.
// IDs come from Netlify environment variables (public IDs, not secrets). Each tool loads only if its ID is set:
//   NEXT_PUBLIC_META_PIXEL_ID   e.g. 123456789012345
//   NEXT_PUBLIC_GA4_ID          e.g. G-ABC123XYZ
//   NEXT_PUBLIC_CLARITY_ID      e.g. abcd1234ef
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || '';
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID?.trim() || '';
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID?.trim() || '';

type Fbq = (cmd: 'track' | 'trackCustom' | 'init', name: string, params?: Record<string, unknown>) => void;
type Gtag = (cmd: 'event' | 'config' | 'js', name: unknown, params?: Record<string, unknown>) => void;
declare global { interface Window { fbq?: Fbq; gtag?: Gtag } }

/** Conversion events, named as Meta standard events. Each maps to its GA4 counterpart. */
export type Evento = 'Lead' | 'InitiateCheckout' | 'Purchase' | 'Contact';
const GA4_NAME: Record<Evento, string> = { Lead: 'generate_lead', InitiateCheckout: 'begin_checkout', Purchase: 'purchase', Contact: 'contact' };

/** Runs `fn` once `ready()` is true. The tags load after the page hydrates, so an event fired on load
 *  (e.g. Purchase on return from ONVO) waits for them, up to ~6 s. */
function whenReady(ready: () => boolean, fn: () => void, tries = 30) {
  if (ready()) { try { fn(); } catch {} return; }
  if (tries > 0) setTimeout(() => whenReady(ready, fn, tries - 1), 200);
}

/** Sends a conversion to Meta and GA4 (only the tools whose ID is set). `value` is in colones. */
export function track(evento: Evento, data: { value?: number; content_name?: string; num_items?: number } = {}) {
  if (typeof window === 'undefined') return;
  const money = data.value != null ? { value: data.value, currency: 'CRC' } : {};
  if (META_PIXEL_ID) whenReady(() => !!window.fbq, () => window.fbq!('track', evento, {
    ...money, ...(data.content_name ? { content_name: data.content_name } : {}), ...(data.num_items ? { num_items: data.num_items } : {}),
  }));
  if (GA4_ID) whenReady(() => !!window.gtag, () => window.gtag!('event', GA4_NAME[evento], {
    ...money, ...(data.content_name ? { item_name: data.content_name } : {}),
  }));
}
