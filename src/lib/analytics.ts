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

/** Sends a conversion to Meta and GA4. `value` is in colones. Safe to call when a tool isn't loaded. */
export function track(evento: Evento, data: { value?: number; content_name?: string; num_items?: number } = {}) {
  if (typeof window === 'undefined') return;
  const money = data.value != null ? { value: data.value, currency: 'CRC' } : {};
  try { window.fbq?.('track', evento, { ...money, ...(data.content_name ? { content_name: data.content_name } : {}), ...(data.num_items ? { num_items: data.num_items } : {}) }); } catch {}
  try { window.gtag?.('event', GA4_NAME[evento], { ...money, ...(data.content_name ? { item_name: data.content_name } : {}) }); } catch {}
}
