import { Link, useLocation } from "react-router-dom";
import {
  FileText, Layers, ClipboardList, Calendar, Target, Menu, X, Info, Mail,
  ArrowRight, BookOpen, Brain, PenLine, Sparkles, ChevronDown, Wrench, ShieldCheck, Home,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";

const tools = [
  { to: "/summarizer", label: "Notes Summarizer", desc: "Turn raw notes into a clean outline", icon: FileText },
  { to: "/flashcards", label: "Flashcards", desc: "AI flashcards for active recall", icon: Layers },
  { to: "/quiz", label: "Quiz Generator", desc: "Self-test on any topic", icon: ClipboardList },
  { to: "/studyplan", label: "Study Plan", desc: "Personalized revision schedule", icon: Calendar },
  { to: "/examtips", label: "Exam Tips", desc: "Predicted questions & strategy", icon: Target },
  { to: "/explainer", label: "Concept Explainer", desc: "ELI5, analogy & deep dive", icon: Brain },
  { to: "/essay-outline", label: "Essay Outliner", desc: "Thesis, body & conclusion", icon: PenLine },
  { to: "/mnemonics", label: "Mnemonic Generator", desc: "Acronyms, stories & palaces", icon: Sparkles },
  { to: "/plagiarism-checker", label: "Plagiarism Checker", desc: "Originality + AI-text detector", icon: ShieldCheck },
];

const primaryNav = [
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);

  const featuredBlogs = blogPosts.slice(0, 6);
  const isToolPath = tools.some((t) => t.to === location.pathname);
  const isBlogPath = location.pathname.startsWith("/blog");

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setMobileToolsOpen(false);
    setMobileBlogOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-14 items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex min-w-0 items-center gap-2 font-display text-base font-bold sm:gap-2.5">
          <img src="/favicon.png" alt="StudyKro logo" className="h-7 w-7 rounded-xl object-contain sm:h-9 sm:w-9" />
          <span className="truncate text-foreground">Study<span className="text-primary">Kro</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex xl:gap-1" aria-label="Primary">
          <Link
            to="/"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Home
          </Link>

          {/* Tools mega menu */}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isToolPath ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-expanded={toolsOpen}
            >
              <Wrench className="h-3.5 w-3.5" />
              Tools
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
            </button>
            {toolsOpen && (
              <div className="absolute left-1/2 top-full z-50 w-[min(680px,calc(100vw-2rem))] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-1 gap-1 rounded-2xl border border-border bg-popover p-3 shadow-2xl sm:grid-cols-2">
                  {tools.map((t) => (
                    <Link
                      key={t.to}
                      to={t.to}
                      onClick={() => setToolsOpen(false)}
                      className={cn(
                        "flex items-start gap-3 rounded-xl px-3 py-3 transition-colors",
                        location.pathname === t.to ? "bg-primary/10" : "hover:bg-muted"
                      )}
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <t.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground">{t.label}</div>
                        <div className="text-xs text-muted-foreground">{t.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blog menu */}
          <div className="relative" onMouseEnter={() => setBlogOpen(true)} onMouseLeave={() => setBlogOpen(false)}>
            <button
              type="button"
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isBlogPath ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              aria-expanded={blogOpen}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Blog
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", blogOpen && "rotate-180")} />
            </button>
            {blogOpen && (
              <div className="absolute right-0 top-full z-50 w-[min(420px,calc(100vw-2rem))] pt-2 lg:left-1/2 lg:right-auto lg:-translate-x-1/2">
                <div className="rounded-2xl border border-border bg-popover p-3 shadow-2xl">
                  <Link
                    to="/blog"
                    onClick={() => setBlogOpen(false)}
                    className="mb-2 flex items-center justify-between rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
                  >
                    All articles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="space-y-0.5">
                    {featuredBlogs.map((p) => (
                      <Link
                        key={p.slug}
                        to={`/blog/${p.slug}`}
                        onClick={() => setBlogOpen(false)}
                        className="block rounded-lg px-3 py-2 hover:bg-muted"
                      >
                        <div className="text-sm font-medium text-foreground line-clamp-1">{p.title}</div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          {p.category} · {p.readTime}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {primaryNav.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === link.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link to="/summarizer">Try Free</Link>
          </Button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted active:scale-95 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — full slide-in panel */}
      <div
        className={cn(
          "fixed inset-0 top-14 z-40 lg:hidden sm:top-16",
          "transition-opacity duration-200",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* Panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[min(360px,90vw)] overflow-y-auto border-l border-border bg-background shadow-2xl",
            "transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-1 px-4 py-5" aria-label="Mobile">
            <Link
              to="/"
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                location.pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <Home className="h-4 w-4" />
              Home
            </Link>

            {/* Tools collapsible */}
            <button
              type="button"
              onClick={() => setMobileToolsOpen((v) => !v)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                isToolPath ? "text-primary" : "hover:bg-muted"
              )}
              aria-expanded={mobileToolsOpen}
            >
              <span className="flex items-center gap-3">
                <Wrench className="h-4 w-4" />
                Tools
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileToolsOpen && "rotate-180")} />
            </button>
            {mobileToolsOpen && (
              <div className="ml-2 flex flex-col gap-0.5 border-l border-border pl-3">
                {tools.map((t) => (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      location.pathname === t.to ? "bg-primary/10 text-primary" : "hover:bg-muted"
                    )}
                  >
                    <t.icon className="h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="truncate">{t.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* Blog collapsible */}
            <button
              type="button"
              onClick={() => setMobileBlogOpen((v) => !v)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                isBlogPath ? "text-primary" : "hover:bg-muted"
              )}
              aria-expanded={mobileBlogOpen}
            >
              <span className="flex items-center gap-3">
                <BookOpen className="h-4 w-4" />
                Blog
              </span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", mobileBlogOpen && "rotate-180")} />
            </button>
            {mobileBlogOpen && (
              <div className="ml-2 flex flex-col gap-0.5 border-l border-border pl-3">
                <Link
                  to="/blog"
                  className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
                >
                  All articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {featuredBlogs.slice(0, 5).map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                  >
                    <span className="line-clamp-1">{p.title}</span>
                  </Link>
                ))}
              </div>
            )}

            {primaryNav.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                  location.pathname === l.to ? "bg-primary/10 text-primary" : "hover:bg-muted"
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            ))}

            <Button asChild size="lg" className="mt-4 w-full">
              <Link to="/summarizer">Try Free</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
