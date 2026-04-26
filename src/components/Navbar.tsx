import { Link, useLocation } from "react-router-dom";
import {
  FileText, Layers, ClipboardList, Calendar, Target, Menu, X, Info, Mail,
  ArrowRight, BookOpen, Brain, PenLine, Sparkles, ChevronDown, Wrench
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { blogPosts } from "@/data/blogPosts";

const tools = [
  { to: "/summarizer", label: "Notes Summarizer", desc: "Turn raw notes into a clean outline", icon: FileText },
  { to: "/flashcards", label: "Flashcards", desc: "AI flashcards for active recall", icon: Layers },
  { to: "/quiz", label: "Quiz Generator", desc: "Self-test on any topic", icon: ClipboardList },
  { to: "/studyplan", label: "Study Plan", desc: "Personalized revision schedule", icon: Calendar },
  { to: "/examtips", label: "Exam Tips", desc: "Predicted questions & strategy", icon: Target },
  { to: "/explainer", label: "Concept Explainer", desc: "ELI5, analogy & deep dive", icon: Brain },
  { to: "/essay-outline", label: "Essay Outliner", desc: "Thesis, body & conclusion", icon: PenLine },
  { to: "/mnemonics", label: "Mnemonic Generator", desc: "Acronyms, stories & palaces", icon: Sparkles },
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
    <nav className="sticky top-0 z-50 border-b border-border/20 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-[68px] items-center justify-between px-4 sm:h-[76px] sm:px-6">
        <Link to="/" className="flex items-center gap-3 font-display text-lg font-bold">
          <img src="/favicon.png" alt="StudyKro logo" className="h-10 w-10 rounded-[14px] bg-white/80 p-1.5 object-contain shadow-sm sm:h-11 sm:w-11" />
          <div className="flex flex-col leading-none">
            <span className="gradient-text text-base sm:text-lg">StudyKro</span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:text-[10px] sm:tracking-[0.26em]">AI study tools</span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {/* Tools dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setToolsOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-[14px] px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isToolPath ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-card hover:text-foreground"
              )}
              aria-expanded={toolsOpen}
            >
              <Wrench className="h-4 w-4" />
              Tools
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
            </button>
            {toolsOpen && (
              <div className="absolute left-0 top-full z-50 w-[560px] pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-[18px] border border-border/30 bg-popover p-3 shadow-xl">
                  {tools.map((t) => (
                    <Link
                      key={t.to}
                      to={t.to}
                      onClick={() => setToolsOpen(false)}
                      className={cn(
                        "flex items-start gap-3 rounded-[12px] px-3 py-2.5 transition-colors",
                        location.pathname === t.to ? "bg-primary/10" : "hover:bg-muted"
                      )}
                    >
                      <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
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

          {/* Blog dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setBlogOpen(true)}
            onMouseLeave={() => setBlogOpen(false)}
          >
            <button
              type="button"
              onClick={() => setBlogOpen((v) => !v)}
              className={cn(
                "flex items-center gap-1.5 rounded-[14px] px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isBlogPath ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-card hover:text-foreground"
              )}
              aria-expanded={blogOpen}
            >
              <BookOpen className="h-4 w-4" />
              Blog
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", blogOpen && "rotate-180")} />
            </button>
            {blogOpen && (
              <div className="absolute left-0 top-full z-50 w-[420px] pt-2">
                <div className="rounded-[18px] border border-border/30 bg-popover p-3 shadow-xl">
                  <Link
                    to="/blog"
                    onClick={() => setBlogOpen(false)}
                    className="mb-2 flex items-center justify-between rounded-[12px] bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
                  >
                    All articles
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <div className="space-y-1">
                    {featuredBlogs.map((p) => (
                      <Link
                        key={p.slug}
                        to={`/blog/${p.slug}`}
                        onClick={() => setBlogOpen(false)}
                        className="block rounded-[10px] px-3 py-2 transition-colors hover:bg-muted"
                      >
                        <div className="text-sm font-medium text-foreground line-clamp-1">{p.title}</div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.category} · {p.readTime}</div>
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
                "flex items-center gap-1.5 rounded-[14px] px-3 py-2.5 text-sm font-medium transition-all duration-150",
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="rounded-full border border-border/20 bg-card/70 p-2 md:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="space-y-4 border-t border-border/20 bg-background/95 px-4 pb-5 pt-4 md:hidden">
          <div>
            <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Tools</p>
            <div className="mt-2 space-y-2">
              {tools.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-[14px] px-3 py-3 text-sm transition-colors",
                    location.pathname === t.to ? "bg-primary/10 text-primary" : "paper-panel text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
                      <t.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Blog</p>
            <div className="mt-2 space-y-2">
              <Link
                to="/blog"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-[14px] bg-primary/10 px-3 py-3 text-sm font-semibold text-primary"
              >
                All articles
                <ArrowRight className="h-4 w-4" />
              </Link>
              {featuredBlogs.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="block rounded-[14px] paper-panel px-3 py-3 text-sm"
                >
                  <div className="font-medium line-clamp-2">{p.title}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{p.category} · {p.readTime}</div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">More</p>
            <div className="mt-2 space-y-2">
              {primaryNav.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-[14px] px-3 py-3 text-sm transition-colors",
                    location.pathname === link.to ? "bg-primary/10 text-primary" : "paper-panel text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
                      <link.icon className="h-4 w-4" />
                    </div>
                    <div className="font-medium">{link.label}</div>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
