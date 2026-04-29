import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, BookOpenCheck, Target, Sparkles, Users, Lightbulb, ArrowRight } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

const principles = [
  { title: "Clarity first", description: "Every feature is designed so students understand material faster and revise with structure.", icon: BookOpenCheck },
  { title: "Evidence-based", description: "Built on active recall, spaced repetition, and the Feynman technique — not gimmicks.", icon: Target },
  { title: "Ethical AI", description: "StudyKro supports learning. We won't write essays for you or help you cheat.", icon: Shield },
  { title: "Free for students", description: "All 8 tools are 100% free with no sign-up. Education shouldn't be locked behind a paywall.", icon: Users },
];

export default function About() {
  return (
    <PageWrapper>
      <Seo
        title="About StudyKro – Free AI Study Tools Built for Students"
        description="StudyKro is a free AI study assistant with 8 tools to help students summarize notes, build flashcards, generate quizzes, plan revision, and prepare for exams."
        canonical="https://studykro.com/about"
        keywords={["about StudyKro", "free AI study tools", "student learning platform", "ethical AI education"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About StudyKro",
          url: "https://studykro.com/about",
          description: "Learn about StudyKro — a free AI study assistant for students.",
        }}
      />

      <header className="mx-auto max-w-3xl text-center">
        <span className="note-label">About</span>
        <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
          We help students learn faster with <span className="gradient-text">AI built around real study science</span>
        </h1>
        <p className="mx-auto mt-5 text-lg text-muted-foreground">
          StudyKro is a free AI study platform with 8 tools designed for one job: helping you understand,
          remember, and apply what you study.
        </p>
      </header>

      <section className="mt-16 grid gap-6 sm:grid-cols-2">
        {principles.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="paper-panel p-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <p.icon className="h-5 w-5" />
            </div>
            <h2 className="font-display text-lg font-bold">{p.title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.description}</p>
          </motion.div>
        ))}
      </section>

      <section className="mt-20 paper-panel p-8 sm:p-12">
        <Lightbulb className="h-8 w-8 text-primary" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Our story</h2>
        <div className="prose-mag mt-4 max-w-none">
          <p>
            StudyKro started with a simple frustration: students spend hours re-reading notes, highlighting
            textbooks, and building flashcards by hand — only to forget most of it within a week. Cognitive
            science has known the answer for decades. We just hadn't built the tools.
          </p>
          <p>
            Today, StudyKro packages those proven techniques — active recall, spaced repetition, the Feynman
            technique, memory palaces — into AI tools that take seconds to use. Paste your notes, get
            ready-to-test flashcards. Type a topic, get a quiz. Describe your exam, get a study plan.
          </p>
          <p>
            We don't believe in paywalls for education, sign-up forms, or selling your data. Every tool is
            free, runs in your browser, and is built to make you a more confident student.
          </p>
        </div>
      </section>

      <section className="mt-16 paper-panel p-8 sm:p-12">
        <Users className="h-8 w-8 text-primary" />
        <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">Built by the team</h2>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          StudyKro is developed by <span className="font-semibold text-foreground">Saqib Nawaz</span> and his team
          at <span className="font-semibold text-foreground">TEVTA</span>, Department of{" "}
          <span className="font-semibold text-foreground">CIT (Computer Information Technology)</span>. The team
          combines hands-on classroom insight with modern AI engineering to build study tools that actually help
          students learn — not just complete homework.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Lead Developer</p>
            <p className="mt-1 font-display text-lg font-bold">Saqib Nawaz</p>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Institution</p>
            <p className="mt-1 font-display text-lg font-bold">TEVTA</p>
          </div>
          <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Department</p>
            <p className="mt-1 font-display text-lg font-bold">CIT</p>
          </div>
        </div>
      </section>

      <section className="mt-16 text-center">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to study smarter?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Pick a tool, paste your notes, and get exam-ready output in seconds.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/summarizer">Try a tool free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/blog">Read study guides</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Or learn how to <Link to="/blog" className="font-semibold text-primary hover:underline">use AI for active recall</Link> in our blog.
        </p>
      </section>

      <Sparkles className="sr-only" /> {/* keep import used */}
    </PageWrapper>
  );
}
