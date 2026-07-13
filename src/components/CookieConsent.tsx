import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "studykro_consent_v1";

type ConsentValue = "granted" | "denied";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    openCookieSettings?: () => void;
  }
}

function applyConsent(value: ConsentValue) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      setVisible(true);
    }
    // Expose a reopen hook so a "Cookie settings" link anywhere can call it.
    window.openCookieSettings = () => setVisible(true);
    return () => {
      if (window.openCookieSettings) delete window.openCookieSettings;
    };
  }, []);

  const decide = (value: ConsentValue) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage disabled — decision applies for this session only */
    }
    applyConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 p-4 shadow-2xl backdrop-blur-md sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" aria-hidden="true" />
          </div>

          <div className="flex-1 text-sm leading-6 text-muted-foreground">
            <p className="font-semibold text-foreground">We use cookies</p>
            <p className="mt-1">
              StudyKro uses strictly-necessary cookies to run the site, plus optional
              analytics and advertising cookies (Google Analytics &amp; Google AdSense)
              to fund our free tools and show relevant ads. You can accept, reject,
              or read the details in our{" "}
              <Link to="/privacy" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={() => decide("granted")}>
                Accept all
              </Button>
              <Button size="sm" variant="outline" onClick={() => decide("denied")}>
                Reject non-essential
              </Button>
              <Link
                to="/privacy"
                className="ml-1 text-xs font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
              >
                Learn more
              </Link>
            </div>
          </div>

          <button
            type="button"
            aria-label="Dismiss (rejects non-essential cookies)"
            onClick={() => decide("denied")}
            className="hidden shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
