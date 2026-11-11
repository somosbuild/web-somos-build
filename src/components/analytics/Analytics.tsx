'use client';

// Loads Meta Pixel, GA4 and Clarity (each only if its ID is set; see src/lib/analytics.ts),
// sends a Meta PageView on client-side navigation, and tracks every WhatsApp link click as "Contact".
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { CLARITY_ID, GA4_ID, META_PIXEL_ID, track } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);

  // The Meta snippet sends the first PageView; later in-app navigations send their own. (GA4 does this by itself.)
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.fbq?.('track', 'PageView');
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (a && /(^|\/\/)(wa\.me|api\.whatsapp\.com)\//.test(a.href)) track('Contact', { content_name: 'WhatsApp' });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return <>
    {META_PIXEL_ID && <>
      <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}</Script>
      <noscript><img height="1" width="1" style={{ display: 'none' }} alt="" src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`} /></noscript>
    </>}
    {GA4_ID && <>
      <Script id="ga4-lib" src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}</Script>
    </>}
    {/* The id must NOT be "clarity": browsers expose element ids as window globals, so window.clarity
        would become this <script> element and the Clarity tag fails with "a[c] is not a function". */}
    {CLARITY_ID && <Script id="ms-clarity-init" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}</Script>}
  </>;
}
