import { Link, useLocation } from "react-router-dom";
import { FileText, Layers, ClipboardList, Calendar, Target, Menu, X, Info, Mail, ArrowRight, BookOpen } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/summarizer", label: "Tool", sublabel: "Summarizer", icon: FileText },
  { to: "/flashcards", label: "Tool", sublabel: "Flashcards", icon: Layers },
  { to: "/quiz", label: "Tool", sublabel: "Quiz", icon: ClipboardList },
  { to: "/studyplan", label: "Tool", sublabel: "Study Plan", icon: Calendar },
  { to: "/examtips", label: "Tool", sublabel: "Exam Tips", icon: Target },
  { to: "/blog", label: "Read", sublabel: "Blog", icon: BookOpen },
  { to: "/about", label: "About", sublabel: "Platform", icon: Info },
  { to: "/contact", label: "Get in", sublabel: "Touch", icon: Mail },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

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
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "group flex items-center gap-2 rounded-[14px] px-3 py-2.5 text-sm transition-all duration-150",
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-card hover:text-foreground hover:card-shadow",
              )}
            >
              <link.icon className="h-4 w-4" />
              <div className="leading-tight">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground group-hover:text-primary/70">{link.label}</div>
                <div className="font-medium">{link.sublabel}</div>
              </div>
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
        <div className="space-y-2 border-t border-border/20 bg-background/95 px-4 pb-5 pt-4 md:hidden">
          <div className="paper-panel mb-3 px-4 py-4">
            <p className="note-label">Navigation</p>
            <p className="mt-3 font-display text-lg font-semibold text-foreground">Choose the tool that matches your study task.</p>
            <p className="mt-1 text-sm text-muted-foreground">Use summaries, flashcards, quizzes, study plans, and exam guidance in a clear workflow.</p>
          </div>
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-between rounded-[14px] px-3 py-3 text-sm transition-colors",
                location.pathname === link.to ? "bg-primary/10 text-primary" : "paper-panel text-foreground",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-primary/10 text-primary">
                  <link.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{link.label}</div>
                  <div className="font-medium">{link.sublabel}</div>
                </div>
              </div>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
