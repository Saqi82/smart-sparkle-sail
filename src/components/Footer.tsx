import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mobileAppDownload } from "@/lib/mobileApp";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { to: "/", label: "Home" },
    { to: "/summarizer", label: "Summarizer" },
    { to: "/flashcards", label: "Flashcards" },
    { to: "/quiz", label: "Quiz" },
    { to: "/studyplan", label: "Study Plan" },
    { to: "/examtips", label: "Exam Tips" },
    { to: "/about", label: "About" },
  ];

  return (
    <footer className="mt-16 border-t border-border/20 bg-background/70 backdrop-blur-sm">
      <div className="container max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="mb-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
          <div className="text-center lg:text-left">
            <Link to="/" className="mb-4 inline-flex items-center gap-3 font-display text-lg font-bold">
              <img src="/favicon.png" alt="StudyKro logo" className="h-11 w-11 rounded-[14px] bg-white/80 p-1.5 object-contain shadow-sm" />
              <div className="flex flex-col leading-none">
                <span className="gradient-text">StudyKro</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Study preparation tools</span>
              </div>
            </Link>
            <p className="mx-auto max-w-md text-sm text-muted-foreground lg:mx-0">
              StudyKro supports revision with concise summaries, flashcards, quizzes, study plans, and exam-focused guidance.
            </p>
            <Button asChild className="mt-5 w-full sm:w-auto">
              <a
                href={mobileAppDownload.url}
                target={mobileAppDownload.isExternal ? "_blank" : undefined}
                rel={mobileAppDownload.isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Android App
              </a>
            </Button>
          </div>

          <div className="text-center lg:text-left">
            <h4 className="mb-4 text-sm font-display font-semibold">Tools</h4>
            <ul className="space-y-2">
              {links.slice(1, 6).map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                    <ArrowRight className="h-3.5 w-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center lg:text-left">
            <h4 className="mb-4 text-sm font-display font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border/20 pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">Copyright {currentYear} StudyKro. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Clear, focused tools for study and exam preparation.</p>
        </div>
      </div>
    </footer>
  );
}
