import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Compass } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageWrapper>
      <div className="paper-panel mx-auto my-6 max-w-2xl px-6 py-12 text-center sm:my-10 sm:px-8 sm:py-14">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="h-10 w-10" />
        </div>
        <p className="note-label mt-5">404</p>
        <h1 className="mt-4 text-3xl font-display font-bold sm:text-4xl">This page could not be found.</h1>
        <p className="mx-auto mt-4 max-w-xl helper-copy">
          We couldn&apos;t find <span className="font-medium text-foreground">{location.pathname}</span>. The link may be outdated or the page may no longer be available.
        </p>
        <Button asChild className="mt-6 w-full sm:w-auto">
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
