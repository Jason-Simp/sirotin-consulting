"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "automatemejay-analytics-consent";
type Consent = "granted" | "denied" | null;

function isValidContainerId(value: string | undefined): value is string {
  return Boolean(value && /^GTM-[A-Z0-9]+$/.test(value));
}

function pushDataLayer(event: Record<string, unknown>) {
  const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push(event);
}

export function GoogleTagManager({ containerId }: { containerId?: string }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<Consent>(null);
  const [hasChoice, setHasChoice] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "granted" || saved === "denied") {
        setConsent(saved);
        setHasChoice(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (consent !== "granted") return;
    pushDataLayer({
      event: "virtual_page_view",
      page_path: pathname,
      page_title: document.title,
    });
  }, [consent, pathname]);

  if (!isValidContainerId(containerId)) return null;

  function saveConsent(value: Exclude<Consent, null>) {
    const shouldReload = consent === "granted" && value === "denied";
    window.localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    setHasChoice(true);
    if (shouldReload) window.location.reload();
  }

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="automatemejay-gtm-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});`}
          </Script>
          <Script
            id="automatemejay-gtm"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`}
          />
        </>
      )}

      {!hasChoice ? (
        <aside className="analytics-consent" aria-label="Analytics privacy choice">
          <div>
            <strong>One privacy choice.</strong>
            <p>Allow anonymous analytics so we can learn which pages and guides are useful. Google Tag Manager and Google Analytics load only if you allow them.</p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => saveConsent("denied")}>Decline</button>
            <button className="button button-primary" type="button" onClick={() => saveConsent("granted")}>Allow analytics</button>
          </div>
        </aside>
      ) : (
        <button className="analytics-choices" type="button" onClick={() => setHasChoice(false)}>Privacy choices</button>
      )}
    </>
  );
}
