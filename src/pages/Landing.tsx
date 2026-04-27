import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Layers, ClipboardList, Calendar, Target, Brain, PenLine, Sparkles,
  ArrowRight, BookOpen, CheckCircle2, Zap, Shield, Star, Download, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { mobileAppDownload } from "@/lib/mobileApp";
import { blogPosts } from "@/data/blogPosts";

const tools = [
  { icon: FileText, title: "Notes Summarizer", desc: "Turn long notes into concise key points and revision-ready summaries.", to: "/summarizer", tag: "Most popular" },
  { icon: Layers, title: "Flashcard Generator", desc: "Create AI flashcards for active recall and spaced repetition.", to: "/flashcards", tag: "Active recall" },
  { icon: ClipboardList, title: "Quiz Generator", desc: "Generate practice quizzes from any topic or notes in seconds.", to: "/quiz", tag: "Self-test" },
  { icon: Calendar, title: "Study Plan", desc: "Build a realistic, day-by-day revision schedule for your exam.", to: "/studyplan" },
  { icon: Target, title: "Exam Tips", desc: "Predicted questions, focus areas and last-mile prep guidance.", to: "/examtips" },
  { icon: Brain, title: "Concept Explainer", desc: "Feynman-style explanations: ELI5, analogies, and deep dives.", to: "/explainer" },
  { icon: PenLine, title: "Essay Outliner", desc: "Thesis, arguments, evidence and conclusion — structured for you.", to: "/essay-outline" },
  { icon: Sparkles, title: "Mnemonic Generator", desc: "Acronyms, stories, and memory palaces for any list.", to: "/mnemonics" },
];

const stats = [
  { value: "8", label: "AI Study Tools" },
  { value: "100%", label: "Free to Use" },
  { value: "0s", label: "Sign-up Time" },
  { value: "12+", label: "Study Guides" },
];

const benefits = [
  { icon: Zap, title: "Instant results", body: "Summaries, flashcards, and quizzes generated in seconds — not hours." },
  { icon: Shield, title: "Evidence-based", body: "Built around active recall, spaced repetition, and the Feynman technique." },
  { icon: CheckCircle2, title: "Free forever", body: "No sign-up, no paywall, no hidden limits. Open the tool and start studying." },
  { icon: Star, title: "Built for students", body: "From high-school revision to med-school cramming — designed for real exam prep." },
];

export default function Landing() {
  const featuredPosts = blogPosts.slice(0, 3);

  return (
    <PageWrapper>
      <Seo
        title="StudyKro – Free AI Study Tools: Summarizer, Flashcards, Quiz & More"
        description="Free AI study tools for students. Summarize notes, generate flashcards & quizzes, build study plans, outline essays, and ace exams with proven techniques."
        keywords={[
          "AI study tools", "AI flashcard generator", "AI quiz generator",
          "notes summarizer", "study plan generator", "essay outline generator",
          "concept explainer", "mnemonic generator", "exam preparation",
          "active recall", "spaced repetition", "Feynman technique", "StudyKro",
        ]}
        canonical="https://studykro.com/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "StudyKro",
            url: "https://studykro.com/",
            description: "Free AI study assistant with 8 tools: summarizer, flashcards, quizzes, study plans, exam tips, concept explainer, essay outliner, mnemonics.",
            applicationCategory: "EducationApplication",
            operatingSystem: "Web, Android",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "120" },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "StudyKro",
            url: "https://studykro.com/",
            logo: "https://studykro.com/icon-512.png",
          },
        ]}
      />

      {/* HERO */}
      <section className="relative -mt-6 overflow-hidden pb-16 pt-10 sm:pt-16">
        <div className="absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden />
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold text-foreground card-shadow"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            8 AI Study Tools · 100% Free · No Sign-up
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Study smarter with{" "}
            <span className="gradient-text">AI-powered</span> study tools
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Summarize notes, generate flashcards & quizzes, build a study plan, and ace your exams.
            Built on proven techniques — active recall, spaced repetition, and the Feynman method.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full px-8 sm:w-auto">
              <Link to="/summarizer">Try Summarizer Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full px-8 sm:w-auto">
              <Link to="/blog">Read Study Guides</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-foreground sm:text-4xl">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-16">
        <div className="mb-10 text-center">
          <span className="note-label">All tools</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Every study tool you need, in one place</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            8 free AI-powered tools that turn your notes into summaries, flashcards, quizzes, plans, and more.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="paper-panel group relative flex flex-col p-5 hover-lift"
            >
              {t.tag && (
                <span className="absolute right-3 top-3 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                  {t.tag}
                </span>
              )}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary">
                {t.title}
              </h3>
              <p className="mt-1.5 flex-1 text-sm leading-6 text-muted-foreground">{t.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Open tool <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="note-label">Why StudyKro</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
              Built on the science of how students actually learn
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Re-reading notes feels productive but barely works. StudyKro is built around techniques
              cognitive scientists have validated for decades.
            </p>
            <Button asChild className="mt-6">
              <Link to="/blog">Explore the research <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <div key={b.title} className="paper-panel p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold">{b.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLES */}
      <section className="py-16">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="note-label">From the blog</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Study guides that actually work</h2>
          </div>
          <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">
            View all articles →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredPosts.map((p) => (
            <article key={p.slug} className="paper-panel group flex flex-col overflow-hidden hover-lift">
              <div className="aspect-[16/9] gradient-hero relative">
                <div className="absolute inset-0 flex items-end p-5">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {p.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold leading-snug group-hover:text-primary">
                  <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                </h3>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readTime}</span>
                  <span>·</span>
                  <span>{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="my-16">
        <div className="relative overflow-hidden rounded-3xl gradient-hero px-8 py-14 text-center text-white sm:px-12 sm:py-20">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <BookOpen className="mx-auto h-10 w-10" />
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
              Ready to study smarter?
            </h2>
            <p className="mt-3 text-lg text-white/85">
              Pick a tool, paste your notes, and get exam-ready output in seconds. 100% free, no sign-up.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="w-full px-8 sm:w-auto">
                <Link to="/summarizer">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-white/30 bg-white/10 px-8 text-white hover:bg-white/20 sm:w-auto">
                <a
                  href={mobileAppDownload.url}
                  target={mobileAppDownload.isExternal ? "_blank" : undefined}
                  rel={mobileAppDownload.isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2"
                >
                  <Download className="h-4 w-4" /> Android App
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
