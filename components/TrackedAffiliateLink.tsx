"use client";

import type { ReactNode } from "react";

type TrackedAffiliateLinkProps = {
  href: string;
  store: string;
  productSlug: string;
  productName: string;
  className?: string;
  children: ReactNode;
};

export function TrackedAffiliateLink({ href, store, productSlug, productName, className, children }: TrackedAffiliateLinkProps) {
  function trackClick() {
    const payload = JSON.stringify({
      eventType: "affiliate_click",
      productSlug,
      productName,
      store,
      targetUrl: href,
      pagePath: window.location.pathname,
      referrer: document.referrer
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      return;
    }

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true
    }).catch(() => undefined);
  }

  return (
    <a href={href} rel="sponsored nofollow" target="_blank" onClick={trackClick} className={className}>
      {children}
    </a>
  );
}
