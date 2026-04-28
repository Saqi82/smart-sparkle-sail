import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineBanner from "./components/OfflineBanner";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

const Landing = lazy(() => import("./pages/Landing"));
const Summarizer = lazy(() => import("./pages/Summarizer"));
const Flashcards = lazy(() => import("./pages/Flashcards"));
const Quiz = lazy(() => import("./pages/Quiz"));
const StudyPlan = lazy(() => import("./pages/StudyPlan"));
const ExamTips = lazy(() => import("./pages/ExamTips"));
const Explainer = lazy(() => import("./pages/Explainer"));
const EssayOutline = lazy(() => import("./pages/EssayOutline"));
const Mnemonics = lazy(() => import("./pages/Mnemonics"));
const Plagiarism = lazy(() => import("./pages/Plagiarism"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<Loader message="Loading page..." />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/summarizer" element={<Summarizer />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/studyplan" element={<StudyPlan />} />
          <Route path="/examtips" element={<ExamTips />} />
          <Route path="/explainer" element={<Explainer />} />
          <Route path="/essay-outline" element={<EssayOutline />} />
          <Route path="/mnemonics" element={<Mnemonics />} />
          <Route path="/plagiarism-checker" element={<Plagiarism />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

function AppShell() {
  const isOnline = useOnlineStatus();

  return (
    <BrowserRouter>
      <Navbar />
      {!isOnline && <OfflineBanner />}
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppShell />
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
