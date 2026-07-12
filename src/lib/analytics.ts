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
    api_host: 'https://us.i.posthog.com',
    autocapture: false,
    capture_pageview: true,
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

// GA4 custom event via gtag (defined inline in BaseLayout). Skipped on localhost
// where GA is not loaded, mirroring the PostHog guard above.
export function gaEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (/localhost|127\.0\.0\.1/.test(window.location.hostname)) return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') gtag('event', name, params ?? {});
}
