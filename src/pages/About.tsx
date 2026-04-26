import { motion } from "framer-motion";
import { Shield, BookOpenCheck, Target, Sparkles } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const principles = [
  {
    title: "Clarity First",
    description: "Every feature is designed to help users understand material faster and study with more structure.",
    icon: BookOpenCheck,
  },
  {
    title: "Professional by Design",
    description: "The platform uses direct, useful language so the experience feels dependable and well managed.",
    icon: Target,
  },
  {
    title: "Ethical Use of AI",
    description: "StudyKro supports revision and preparation without encouraging shortcuts or misuse.",
    icon: Shield,
  },
];

export default function About() {
  return (
    <PageWrapper>
      <section className="py-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="note-label">About</p>
          <h1 className="mt-4 text-4xl font-display font-bold md:text-5xl">About StudyKro</h1>
          <p className="mx-auto mb-8 mt-4 max-w-3xl text-lg text-muted-foreground">
            StudyKro is a focused study platform that helps users summarize notes, create flashcards, generate quizzes, organize revision, and prepare with more confidence.
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <h2 className="mb-8 text-center text-2xl font-display font-bold">What guides the platform</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {principles.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className="paper-panel p-6 transition-all hover:elevated-shadow"
              >
                <IconComponent className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 font-display text-lg font-bold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="paper-panel p-8"
          >
            <div className="mb-4 flex gap-4">
              <Sparkles className="h-6 w-6 flex-shrink-0 text-primary" />
              <div>
                <h3 className="mb-2 font-display font-bold">Our Focus</h3>
                <p className="leading-relaxed text-muted-foreground">
                  The goal is to provide practical AI tools that make revision more efficient, preparation more organized, and the learning experience easier to trust.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
