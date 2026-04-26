import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center">
        <div className="paper-panel w-full px-6 py-12 text-center sm:px-10 sm:py-14">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-24 sm:w-24">
            <WifiOff className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <p className="note-label mt-6">Offline</p>
          <h1 className="mt-4 text-3xl font-display font-bold sm:text-4xl">This page is unavailable right now.</h1>
          <p className="mx-auto mt-4 max-w-xl helper-copy">
            Your connection appears to be offline, so StudyKro cannot load the tools on this screen. Reconnect to continue with summaries, flashcards, quizzes, and study preparation.
          </p>
          <div className="mt-8 rounded-[18px] border border-border/30 bg-muted/45 px-5 py-4 text-left">
            <p className="text-sm font-semibold text-foreground">What you can do</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Check your internet connection, then reload the page to continue.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="mt-8 w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
