import { Link } from "react-router-dom";
import { Download, Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mobileAppDownload } from "@/lib/mobileApp";
import { blogPosts } from "@/data/blogPosts";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const recentPosts = blogPosts.slice(0, 5);

  const tools = [
    { to: "/summarizer", label: "Notes Summarizer" },
    { to: "/flashcards", label: "Flashcard Generator" },
    { to: "/quiz", label: "Quiz Generator" },
    { to: "/studyplan", label: "Study Plan Generator" },
    { to: "/examtips", label: "Exam Tips" },
    { to: "/explainer", label: "Concept Explainer" },
    { to: "/essay-outline", label: "Essay Outliner" },
    { to: "/mnemonics", label: "Mnemonic Generator" },
  ];

  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="container max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-2.5 font-display text-base font-bold">
              <img src="/favicon.png" alt="StudyKro" className="h-9 w-9 rounded-xl" />
              <span>Study<span className="text-primary">Kro</span></span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
              Free AI study tools for students — summarize notes, generate flashcards & quizzes, plan revision,
              and prepare for exams faster with evidence-based study techniques.
            </p>
            <Button asChild className="mt-5">
              <a
                href={mobileAppDownload.url}
                target={mobileAppDownload.isExternal ? "_blank" : undefined}
                rel={mobileAppDownload.isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download Android App
              </a>
            </Button>
          </div>

          {/* Tools */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Study Tools
            </h3>
            <ul className="space-y-2.5">
              {tools.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent posts */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              <BookOpen className="h-4 w-4" /> Latest Articles
            </h3>
            <ul className="space-y-3">
              {recentPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="text-sm leading-snug text-muted-foreground transition-colors hover:text-primary line-clamp-2"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">
                  View all articles →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-primary">About</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
            <h3 className="mb-3 mt-6 font-display text-sm font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h3>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail className="h-4 w-4" /> Get in touch
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {currentYear} StudyKro. All rights reserved.</p>
          <p>Built for students. Powered by AI. Free forever.</p>
        </div>
      </div>
    </footer>
  );
}
