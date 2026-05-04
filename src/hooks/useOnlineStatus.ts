import { useEffect, useState } from "react";

/**
 * Lightweight online-status hook.
 *
 * Returns `true` when the browser reports the network as online and `false`
 * otherwise. Tool pages use this only to short-circuit network requests with
 * an inline toast — there is no global "You're offline" banner anymore.
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return isOnline;
}
