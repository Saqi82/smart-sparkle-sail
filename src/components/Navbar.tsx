import { Link, useLocation } from "react-router-dom";
import {
  FileText, Layers, ClipboardList, Calendar, Target, Menu, X, Info, Mail,
  ArrowRight, BookOpen, Brain, PenLine, Sparkles, ChevronDown, Wrench, ShieldCheck,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
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

  const featuredBlogs = blogPosts.slice(0, 6);
  const isToolPath = tools.some((t) => t.to === location.pathname);
  const isBlogPath = location.pathname.startsWith("/blog");

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-display text-base font-bold">
          <img src="/favicon.png" alt="StudyKro logo" className="h-9 w-9 rounded-xl object-contain" />
          <span className="text-foreground">Study<span className="text-primary">Kro</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
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
              <div className="absolute left-1/2 top-full z-50 w-[680px] -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-popover p-3 shadow-2xl">
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
              <div className="absolute left-1/2 top-full z-50 w-[420px] -translate-x-1/2 pt-2">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/summarizer">Try Free</Link>
          </Button>
          <button
            className="rounded-lg border border-border p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="space-y-5 border-t border-border bg-background px-4 pb-6 pt-4 lg:hidden">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-semibold"
          >
            Home
          </Link>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Tools</p>
            <div className="mt-2 space-y-1">
              {tools.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                >
                  <t.icon className="h-4 w-4 text-primary" />
                  <span>{t.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Blog</p>
            <div className="mt-2 space-y-1">
              <Link
                to="/blog"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
              >
                All articles
              </Link>
              {featuredBlogs.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {primaryNav.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
