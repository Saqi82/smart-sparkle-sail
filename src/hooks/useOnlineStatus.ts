import { useState, useEffect, useRef } from "react";

/**
 * Reliable online detection.
 *
 * `navigator.onLine` only reports whether a network interface exists, not whether
 * the internet is actually reachable. It can return `true` on captive portals,
 * VPN drops, or local-only networks. To avoid false "You're offline" banners
 * when the user is actually online, we:
 *
 *  1. Trust `navigator.onLine === false` immediately (true offline signal).
 *  2. When `navigator.onLine === true`, verify with a lightweight HEAD probe
 *     before flipping state. Only show offline after a confirmed failure.
 *  3. Re-check on `online`/`offline` events and on tab focus.
 */

const PROBE_URL = "/favicon.ico"; // same-origin, tiny, always present
const PROBE_TIMEOUT_MS = 4000;

async function probeNetwork(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return false;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    await fetch(`${PROBE_URL}?_=${Date.now()}`, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);
    return true;
  } catch {
    return false;
  }
}

export function useOnlineStatus() {
  // Optimistically assume online on first render to avoid a flash of the banner.
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const verify = async () => {
      const ok = await probeNetwork();
      if (mounted.current) setIsOnline(ok);
    };

    const handleOnline = () => {
      // Browser says we're back — confirm with a real probe before hiding banner state.
      verify();
    };
    const handleOffline = () => {
      // Browser is certain we're offline — trust it immediately.
      if (mounted.current) setIsOnline(false);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") verify();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibility);

    // Initial confirmation so we don't show the banner on a flaky `navigator.onLine`.
    verify();

    return () => {
      mounted.current = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return isOnline;
}
