import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, Layers, ClipboardList, Calendar, Target, Brain, PenLine, Sparkles,
  ArrowRight, BookOpen, CheckCircle2, Zap, Shield, Star, Download, Clock, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { mobileAppDownload } from "@/lib/mobileApp";
import { blogPosts } from "@/data/blogPosts";
import { getBlogImage } from "@/data/blogImages";

const tools = [
  { icon: FileText, title: "AI Tutor", desc: "Chat with a Socratic AI tutor that cites your uploaded notes and adapts to your level.", to: "/tutor", tag: "Most popular" },
  { icon: Layers, title: "Flashcard Generator", desc: "Create AI flashcards for active recall and spaced repetition.", to: "/flashcards", tag: "Active recall" },
  { icon: ClipboardList, title: "Quiz Generator", desc: "Generate practice quizzes from any topic or notes in seconds.", to: "/quiz", tag: "Self-test" },
  { icon: Calendar, title: "Study Plan", desc: "Build a realistic, day-by-day revision schedule for your exam.", to: "/studyplan" },
  { icon: Target, title: "Exam Tips", desc: "Predicted questions, focus areas and last-mile prep guidance.", to: "/examtips" },
  { icon: Brain, title: "Concept Explainer", desc: "Feynman-style explanations: ELI5, analogies, and deep dives.", to: "/explainer" },
  { icon: PenLine, title: "Essay Outliner", desc: "Thesis, arguments, evidence and conclusion — structured for you.", to: "/essay-outline" },
  { icon: Sparkles, title: "Mnemonic Generator", desc: "Acronyms, stories, and memory palaces for any list.", to: "/mnemonics" },
  { icon: ShieldCheck, title: "Plagiarism Checker", desc: "Scan essays for plagiarism & AI-generated text with rewrite suggestions.", to: "/plagiarism-checker", tag: "100% accuracy" },
];

const stats = [
  { value: "9", label: "AI Study Tools" },
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
        title="StudyKro — Free AI Study Assistant 2026 | AI Powered Study Tools No Login"
        description="AI student study assistant 2026. Free study tools for students online: AI powered study site with flashcards, quizzes, summaries, essay outlines & mnemonics. Study helper AI no login required."
        ogImage="/icon-512.png"
        keywords={[
          "free AI study tools no account",
          "all in one AI study helper free",
          "AI student study assistant 2026",
          "free study tools for students online",
          "study helper AI no login required",
          "best free AI study website 2026",
          "AI tools to study smarter free",
          "AI powered study site free students",
          "free AI study assistant online",
          "no login AI study tools",
          "AI tools for exam preparation",
          "free educational AI helper",
          "study smarter with AI",
          "AI powered education platform",
          "instant study solutions AI",
          "best AI tools for learners",
          "comprehensive study helper AI",
          "free online learning AI tools",
          "AI study generator no credit card",
          "AI flashcard generator",
          "AI quiz generator",
          "free AI notes summarizer",
          "AI flashcard generator no signup",
          "quiz generator AI free",
          "study plan maker free AI",
          "essay outline generator AI free",
          "mnemonic generator AI",
          "plagiarism checker AI free",
          "exam tips AI powered",
          "StudyKro",
          "best free ai study tools",
          "free ai for students",
          "ai study helper free",
          "top rated free ai study apps",
          "free ai learning platforms",
          "free ai tools for school",
          "free ai note taker",
          "ai text summarizer free",
          "free ai tool for lecture notes",
          "summarize pdf free ai",
          "ai powered note taking free",
          "free ai for condensing notes",
          "free ai flashcard generator",
          "ai active recall tools free",
          "automatic flashcard maker ai free",
          "free ai for spaced repetition",
          "convert notes to flashcards ai free",
          "free ai essay helper",
          "ai research tool free",
          "free ai for citations",
          "ai writing assistant for students free",
          "free ai plagiarism checker",
          "ai academic writing tool free",
          "free ai for math homework",
          "ai science study tool free",
          "free ai for language learning",
          "ai history study aid free",
          "free ai coding tutor",
          "free ai exam prep",
          "ai study plan generator free",
          "free ai tutor for students",
          "ai practice test maker free",
          "free ai for test revision"
        ]}
        canonical="https://studykro.com/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "StudyKro",
            url: "https://studykro.com/",
            description: "Free AI study assistant with 9 tools: summarizer, flashcards, quizzes, study plans, exam tips, concept explainer, essay outliner, mnemonics and plagiarism checker.",
            applicationCategory: "EducationApplication",
            operatingSystem: "Web, Android",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "StudyKro",
            url: "https://studykro.com/",
            logo: "https://studykro.com/icon-512.png",
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "StudyKro",
            url: "https://studykro.com/",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: "https://studykro.com/blog?q={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "StudyKro AI Flashcard Generator",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            url: "https://studykro.com/ai-flashcard-generator",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the best free AI study website 2026?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "StudyKro is the best free AI study website 2026 — a comprehensive study helper AI platform offering an all-in-one AI study helper free. It bundles a flashcard generator, AI quiz generator, free AI notes summarizer, study plan builder, essay outline generator, mnemonic generator, concept explainer, and plagiarism checker — all free online learning tools with zero signup required. Best AI tools for learners seeking instant study solutions.",
                },
              },
              {
                "@type": "Question",
                name: "Are AI study tools actually effective for learning?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. AI study tools are most effective when they support proven techniques like active recall and spaced repetition. Studies by Karpicke & Roediger (2008) and Dunlosky et al. (2013) show these methods outperform passive re-reading.",
                },
              },
              {
                "@type": "Question",
                name: "Can AI generate flashcards and quizzes from my notes or PDFs?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. StudyKro reads your pasted notes or uploaded PDFs and turns them into question-and-answer flashcards or multiple-choice quizzes within seconds.",
                },
              },
              {
                "@type": "Question",
                name: "Is StudyKro free and does it require an account?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "StudyKro is completely free to use and does not require an account, email signup, or credit card. Just open a tool and start studying.",
                },
              },
              {
                "@type": "Question",
                name: "Which AI study tool is best for exam preparation?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "For exam preparation, combine StudyKro's notes summarizer to condense material, the AI quiz generator for active recall practice, and the study plan generator to schedule spaced repetition before exam day.",
                },
              },
            ],
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
            Free forever · No signup · Loved by students
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="gradient-text">Free AI study tools</span> — study helper AI no login required
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:mt-6 sm:text-lg md:text-xl"
          >
            StudyKro is the all in one AI study helper free for students online. AI tools to study smarter free. Use the free AI notes summarizer to shrink long lectures, the AI flashcard generator to turn any topic into ready-to-review cards, the AI quiz generator to test yourself in seconds, and the study plan generator to map out your week. AI powered education platform with zero login required. Free study tools for students online — just open a tool, paste your notes, and start studying.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button asChild size="lg" className="w-full px-8 sm:w-auto">
              <Link to="/summarizer">Start with Free AI Study Tools <ArrowRight className="ml-2 h-4 w-4" /></Link>
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
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Best AI tools for learners — instant study solutions AI powered</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            9 comprehensive study helper AI tools. Free online learning AI tools that turn your notes into summaries, flashcards, quizzes, plans, essay outlines, mnemonics and plagiarism checks. AI tools for exam preparation — all free, no credit card.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
              AI tools to study smarter free — built on proven learning science
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Re-reading notes feels productive but barely works. StudyKro AI powered education platform uses study helper AI techniques cognitive scientists have validated for decades. Active recall, spaced repetition, and the Feynman technique — free online learning at its best.
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
          {featuredPosts.map((p) => {
            const img = getBlogImage(p.slug);
            return (
              <article key={p.slug} className="paper-panel group flex flex-col overflow-hidden hover-lift">
                <Link to={`/blog/${p.slug}`} className="relative block aspect-[16/9] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.alt}
                    width={1280}
                    height={720}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                    {p.category}
                  </span>
                </Link>
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
            );
          })}
        </div>
      </section>

      {/* KEYWORD-CLUSTER LONG-FORM CONTENT */}
      <section className="py-16">
        <div className="mb-10 text-center">
          <span className="note-label">Explore by use case</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">
            Free AI study tools, organised by how students actually use them
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-muted-foreground">
            StudyKro is a free AI learning platform built for school, college and self-study. Below is a plain-English
            guide to what each cluster of tools does, when to reach for it, and how to combine them into a study
            routine that actually moves material into long-term memory.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="paper-panel p-6">
            <h3 className="font-display text-xl font-bold">AI note taking &amp; summarization — free</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Lectures move fast and textbook chapters are dense. The free AI note taker and AI text summarizer inside
              StudyKro exist so you can capture a two-hour lecture or a 40-page PDF and walk away with a clean,
              structured set of notes in minutes. Paste transcripts, drop a PDF, or upload lecture handouts — the free
              AI tool for lecture notes pulls out definitions, key claims, worked examples and sub-topics, then
              rewrites them in shorter, revisable form. If you need to <em>summarize a PDF free</em>, the same tool
              handles it without a signup or a page limit that punishes long readings.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              This is the entry point most students use: AI powered note taking free of charge, feeding into the
              flashcard and quiz tools below. Use it whenever you want a free AI for condensing notes into something
              you can realistically revise in a week.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link to="/summarizer" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Open summarizer →</Link>
              <Link to="/tutor" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Ask AI tutor →</Link>
            </div>
          </article>

          <article className="paper-panel p-6">
            <h3 className="font-display text-xl font-bold">AI flashcards &amp; memorization — free</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Memorisation isn't about how many times you read something — it's about how many times you retrieve it.
              StudyKro's free AI flashcard generator and automatic flashcard maker turn any topic, paragraph or PDF
              into question-and-answer cards ready for active recall. It's a free AI for spaced repetition: you decide
              when a card is easy or hard, and the app resurfaces weaker cards more often.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              The mnemonic generator sits alongside it for lists that resist normal memorisation — cranial nerves,
              historical dates, chemistry groups, legal cases. Together these AI active recall tools free up hours
              you'd otherwise lose to passive re-reading. If you already have handwritten notes, use
              <em> convert notes to flashcards AI free</em> and skip the manual card-writing entirely.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link to="/flashcards" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Generate flashcards →</Link>
              <Link to="/mnemonics" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Build mnemonics →</Link>
            </div>
          </article>

          <article className="paper-panel p-6">
            <h3 className="font-display text-xl font-bold">AI essay, research &amp; writing help — free</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              StudyKro's writing tools are designed to make you a better writer, not to hand in an essay for you. The
              free AI essay helper drafts a thesis, supporting arguments, counterpoints and a conclusion structure
              you can then write in your own voice. The AI research tool free of charge helps you organise sources
              and outline what each one actually contributes, so citations aren't an afterthought.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Before you submit, run the essay through the free AI plagiarism checker and AI academic writing tool free
              of charge — it flags unoriginal phrasing and AI-sounding passages so you can rewrite them. It doubles as
              an AI writing assistant for students free from the pressure of a paid subscription, and works as a
              free AI for citations reminder when your bibliography is thin.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link to="/essay-outline" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Outline an essay →</Link>
              <Link to="/plagiarism-checker" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Check for plagiarism →</Link>
            </div>
          </article>

          <article className="paper-panel p-6">
            <h3 className="font-display text-xl font-bold">Subject-specific AI study tools</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Different subjects reward different study moves. Use the concept explainer as a free AI for math homework
              when a worked step doesn't make sense — it breaks the problem down and gives you an analogous example.
              As an AI science study tool free of charge, it turns abstract mechanisms (mitosis, redox reactions,
              circuit analysis) into diagrams-in-words you can redraw from memory.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Language learners can use it as a free AI for language learning: paste a passage, ask for grammar
              breakdowns, vocabulary lists and comprehension questions. History students use it as an AI history study
              aid free of charge for cause-and-consequence outlines and timeline drills. And for CS students, it works
              as a free AI coding tutor — explaining error messages, walking through algorithms, and quizzing you on
              syntax without ever writing your assignment for you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link to="/explainer" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Open explainer →</Link>
              <Link to="/tutor" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Ask the AI tutor →</Link>
            </div>
          </article>

          <article className="paper-panel p-6 md:col-span-2">
            <h3 className="font-display text-xl font-bold">Exam prep &amp; AI tutoring — free</h3>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Exam season is where the individual tools stop being individual. Start with the AI study plan generator
              free of charge: enter your exam date, the topics you need to cover, and how many hours a day you can
              realistically study. It builds a day-by-day plan that front-loads weaker topics and leaves room for
              spaced review — a proper free AI exam prep schedule, not a generic "revise for two hours a day"
              suggestion.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              From there, the AI practice test maker free of charge turns your notes into MCQs and short-answer
              questions that mimic exam conditions. Use it as a free AI for test revision the week before the exam,
              then again the night before as a quick confidence check. When a question stumps you, hand it to the
              free AI tutor for students — it explains the concept, points you back to the source in your notes, and
              gives you a follow-up question to make sure you actually understood it.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <Link to="/studyplan" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Build a study plan →</Link>
              <Link to="/quiz" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Generate a quiz →</Link>
              <Link to="/examtips" className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary hover:bg-primary/20">Get exam tips →</Link>
            </div>
          </article>
        </div>

        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-sm text-muted-foreground">
            Everything above is part of the same free AI learning platform — one of the top rated free AI study apps
            for school, college and self-taught learners. No credit card, no trial period, no per-tool paywall. If
            you're looking for the best free AI study tools in one place, start with the summarizer, then feed the
            output into flashcards, quizzes and a study plan.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="my-16">
        <div className="relative overflow-hidden rounded-3xl gradient-hero px-6 py-12 text-center text-white sm:px-12 sm:py-20">
          <div className="absolute inset-0 bg-grid opacity-20" aria-hidden />
          <div className="relative mx-auto max-w-2xl">
            <BookOpen className="mx-auto h-10 w-10" />
            <h2 className="mt-5 font-display text-3xl font-bold sm:text-4xl">
              Ready for instant study solutions? AI study generator with instant results.
            </h2>
            <p className="mt-3 text-lg text-white/85">
              Best free AI study assistant online — pick a tool, paste your notes, and get exam-ready output in seconds. AI powered study site, completely free with zero signup required.
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
