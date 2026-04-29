import { WifiOff, RefreshCw } from "lucide-react";

/**
 * iOS-style rounded floating offline pill.
 * Non-blocking: appears at the top center, lets users keep browsing static content.
 */
export default function OfflineBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top,0px)+72px)] z-[60] flex justify-center px-4"
    >
      <div
        className="pointer-events-auto flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-150 sm:px-5"
        style={{ WebkitBackdropFilter: "saturate(180%) blur(20px)" }}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning">
          <WifiOff className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-medium text-foreground">
          You're offline currently
        </span>
        <button
          onClick={() => window.location.reload()}
          className="ml-1 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background transition-transform active:scale-95"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    </div>
  );
}
