import posthog from 'posthog-js';

declare global {
  interface Window {
    posthog: typeof posthog;
  }
}

let initialized = false;

const key = import.meta.env.PUBLIC_POSTHOG_KEY as string | undefined;

if (key && typeof window !== 'undefined' && !/localhost|127\.0\.0\.1/.test(window.location.hostname)) {
  posthog.init(key, {
    api_host: 'https://gonor.me/ingest',
    ui_host: 'https://us.posthog.com',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    person_profiles: 'identified_only',
    session_recording: {
      maskAllInputs: true,
    },
  });
  posthog.register({
    app_id: 'gonor-portfolio',
    deployment_platform: 'github-pages',
    environment: 'production',
    analytics_schema_version: 1,
  });
  window.posthog = posthog;
  initialized = true;

  if (localStorage.getItem('is_owner') === 'true') {
    posthog.identify(
      'gonor-owner',
      {
        email: 'gonorandres@ciencias.unam.mx',
        name: 'Gonor (Owner)',
        is_internal_user: true
      }
    );
  }
}

export function track(event: string, props?: Record<string, unknown>) {
  if (!initialized) return;
  posthog.capture(event, { site: window.location.hostname, ...props });
}

export function trackOutboundLink(
  destination: string,
  props?: Record<string, unknown>,
) {
  if (!initialized) return;

  let destinationHost = destination;
  try {
    destinationHost = new URL(destination, window.location.href).hostname;
  } catch {
    // Keep the original destination when it is not a parseable URL.
  }

  posthog.capture('outbound_link_clicked', {
    site: window.location.hostname,
    destination_url: destination,
    destination_host: destinationHost,
    ...props,
  });
}

// GA4 custom event via gtag (defined inline in BaseLayout). Skipped on localhost
// where GA is not loaded, mirroring the PostHog guard above.
export function gaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (/localhost|127\.0\.0\.1/.test(window.location.hostname)) return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params ?? {});
}
