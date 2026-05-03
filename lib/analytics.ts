import posthog from "posthog-js";

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com";

export function initAnalytics() {
  if (!KEY || typeof window === "undefined") return;
  posthog.init(KEY, {
    api_host: HOST,
    capture_pageview: true,
    persistence: "localStorage",
  });
}

export function identifyUser(userId: string, email?: string) {
  if (!KEY) return;
  posthog.identify(userId, { email });
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (!KEY) return;
  posthog.capture(event, properties);
}

export function resetAnalytics() {
  if (!KEY) return;
  posthog.reset();
}
