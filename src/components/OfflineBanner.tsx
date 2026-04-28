import { WifiOff, RefreshCw } from "lucide-react";

/**
 * Compact non-blocking offline strip.
 * Renders inline above the main content so navigation and SEO content stay reachable.
 */
export default function OfflineBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="border-b border-warning/30 bg-warning/10 px-4 py-2.5 text-warning-foreground"
    >
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="inline-flex items-center gap-2 font-medium text-foreground">
          <WifiOff className="h-4 w-4" />
          You’re offline. AI tools won’t respond until you reconnect.
        </span>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-semibold hover:bg-muted"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry
        </button>
      </div>
    </div>
  );
}
