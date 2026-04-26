import { useRef, useCallback } from "react";
import { toast } from "sonner";

export function useRateLimit(cooldownMs = 5000) {
  const lastCall = useRef(0);

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const elapsed = now - lastCall.current;
    if (elapsed < cooldownMs) {
      const wait = Math.ceil((cooldownMs - elapsed) / 1000);
      toast.error(`Please wait ${wait}s before trying again`);
      return false;
    }
    lastCall.current = now;
    return true;
  }, [cooldownMs]);

  return checkRateLimit;
}
