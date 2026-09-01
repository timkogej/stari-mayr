'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  readCookieConsent,
  type CookieConsentValue,
} from '@/lib/cookie-consent';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
// TODO: set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env once the owner provides
// a real Google Analytics measurement ID (format: G-XXXXXXXXXX). Until then,
// this component intentionally renders nothing — do not hardcode a
// placeholder-looking ID here, it would silently fail or, worse, send data
// to a property that doesn't exist or isn't the owner's.

export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setConsented(readCookieConsent()?.analytics ?? false);
    });

    const handleUpdate = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentValue>).detail;
      setConsented(detail?.analytics ?? false);
    };
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleUpdate);
    return () => {
      active = false;
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, handleUpdate);
    };
  }, []);

  if (!GA_MEASUREMENT_ID || !consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  );
}
