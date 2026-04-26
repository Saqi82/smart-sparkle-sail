import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Layers, ClipboardList, Calendar, Target, Sparkles, BookOpen, Rocket, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/PageWrapper";
import { mobileAppDownload } from "@/lib/mobileApp";

const features = [
  {
    icon: FileText,
    title: "Notes Summarizer",
    desc: "Turn long notes into concise explanations, key points, and revision-ready material.",
    why: "Use it when you need to understand content quickly before moving into review.",
    to: "/summarizer",
  },
  {
    icon: Layers,
    title: "Flashcard Generator",
    desc: "Convert study material into flashcards for active recall and repeated revision.",
    why: "Useful when you want faster revision instead of passive rereading.",
    to: "/flashcards",
  },
  {
    icon: ClipboardList,
    title: "Quiz Generator",
    desc: "Create practice questions to test understanding and identify weak areas.",
    why: "Helpful for checking progress before exams or assignments.",
    to: "/quiz",
  },
  {
    icon: Calendar,
    title: "Study Plan",
    desc: "Build a realistic study schedule based on your timeline and priorities.",
    why: "Best for turning pressure into a practical preparation plan.",
    to: "/studyplan",
  },
  {
    icon: Target,
    title: "Exam Tips",
    desc: "Focus on likely topics, important areas, and last-step preparation guidance.",
    why: "Useful when you need direction for efficient final review.",
    to: "/examtips",
  },
];

const steps = [
  { icon: Sparkles, title: "Choose a Tool", desc: "Select the feature that fits your current study task." },
  { icon: BookOpen, title: "Add Your Material", desc: "Paste your notes or topic details to generate focused support." },
  { icon: Rocket, title: "Review and Prepare", desc: "Use the output to revise, test yourself, and plan the next step." },
];

export default function Landing() {
  return (
    <PageWrapper>
      <section className="py-6 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-[28px] border border-border/20 gradient-hero px-5 py-8 text-left text-white soft-shadow sm:px-8 md:px-10 md:py-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(240,195,138,0.32),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.18fr_0.82fr]">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/82">
                Clear AI tools for better study preparation
              </span>
              <div className="mt-5 flex items-center gap-4">
                <img src="/favicon.png" alt="StudyKro logo" className="h-16 w-16 rounded-[1.4rem] bg-white/90 p-2 object-contain shadow-lg sm:h-20 sm:w-20" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/65">StudyKro</p>
                  <h1 className="mt-2 max-w-3xl text-3xl font-display font-bold tracking-tight sm:text-5xl md:text-[3.7rem]">
                    Summarize, revise, and prepare with clarity.
                  </h1>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                StudyKro helps students turn notes into concise summaries, flashcards, quizzes, study plans, and exam-focused preparation support.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/78">
                <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2">Summaries that save time</span>
                <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2">Flashcards for active recall</span>
                <span className="rounded-full border border-white/15 bg-white/8 px-4 py-2">Focused exam preparation</span>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full bg-white px-7 font-semibold text-slate-900 hover:bg-white/90 sm:w-auto">
                  <Link to="/summarizer">Get Started</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full border-white/25 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
                  <Link to="/about" className="inline-flex items-center gap-2">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-3">
                <Button asChild size="lg" variant="outline" className="w-full border-[#d5b87b]/70 bg-[#d5b87b] text-[#103937] hover:bg-[#e1c58f] hover:text-[#103937] sm:w-auto">
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
            </div>

            <div className="relative">
              <div className="mx-auto max-w-sm rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="rounded-[1.7rem] bg-[#f7f1e7] p-4 text-slate-900 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <img src="/favicon.png" alt="StudyKro icon" className="h-11 w-11 rounded-2xl bg-white p-1 object-contain shadow-sm" />
                    <div>
                      <p className="font-display text-lg font-bold">StudyKro</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b8f89]">Focused study support</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7b6b55]">Built for practical revision</p>
                      <p className="mt-2 text-sm text-slate-600">Understand the material first, then practice recall, then organize the next steps of preparation.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-2xl bg-[#103937] px-3 py-4 text-center text-white">
                        <p className="text-lg font-bold">5</p>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">Tools</p>
                      </div>
                      <div className="rounded-2xl bg-white px-3 py-4 text-center shadow-sm">
                        <p className="text-lg font-bold text-[#103937]">Clear</p>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Outputs</p>
                      </div>
                      <div className="rounded-2xl bg-[#d5b87b] px-3 py-4 text-center text-[#103937]">
                        <p className="text-lg font-bold">Ethical</p>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-[#103937]/70">Approach</p>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-dashed border-[#d5b87b] bg-[#fff8eb] px-4 py-3 text-sm text-[#5d5546]">
                      Designed to support learning with focused tools and professional presentation.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="note-label">Core tools</p>
            <h2 className="mt-3 text-3xl font-display font-bold">Everything on the platform serves a real study need.</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div key={feature.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}>
              <Link
                to={feature.to}
                className="group block h-full rounded-[20px] border border-border/20 bg-card/88 p-6 card-shadow transition-all hover:-translate-y-1 hover:border-primary/30 hover:elevated-shadow"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mb-2 text-lg font-display font-semibold transition-colors group-hover:text-primary">{feature.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{feature.desc}</p>
                <div className="mt-4 rounded-[14px] bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Why this matters:</span> {feature.why}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="mb-8 text-center">
          <p className="note-label">How it works</p>
          <h2 className="mt-3 text-3xl font-display font-bold">A simple workflow for better preparation.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-[24px] border border-border/20 bg-card/88 p-6 text-center card-shadow"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg">
                <step.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Step {index + 1}</div>
              <h3 className="mb-1 font-display font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 py-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Professional focus</p>
          <h2 className="mt-4 text-3xl font-display font-bold">Built to keep study preparation clear, useful, and responsible.</h2>
          <p className="mt-3 helper-copy">
            StudyKro is designed to help users understand material, practice actively, and prepare with structure. The platform stays focused on learning outcomes instead of clutter or unnecessary claims.
          </p>
          <div className="mt-6 rounded-[16px] bg-muted/55 p-4">
            <p className="font-display font-semibold">What users can expect</p>
            <p className="micro-note mt-2">Clear inputs, practical outputs, and support that respects accuracy, effort, and academic integrity.</p>
          </div>
        </div>
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Recommended flow</p>
          <ol className="mt-4 space-y-4">
            <li className="flex gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 font-semibold text-primary">1</span>
              <div>
                <p className="font-display font-semibold">Start with the Summarizer</p>
                <p className="micro-note">Use it to reduce information overload and create a clearer base for revision.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 font-semibold text-primary">2</span>
              <div>
                <p className="font-display font-semibold">Move to Flashcards or Quiz</p>
                <p className="micro-note">Switch into active recall to strengthen understanding and memory.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 font-semibold text-primary">3</span>
              <div>
                <p className="font-display font-semibold">Finish with Plan or Exam Tips</p>
                <p className="micro-note">Organize the remaining work and focus attention where it matters most.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </PageWrapper>
  );
}
