// Central map of blog hero images + SEO alt text.
// Kept separate from blogPosts.ts so content edits stay clean and images are tree-shakeable.

import activeRecall from "@/assets/blog/active-recall-vs-passive-reading.jpg";
import spacedRepetition from "@/assets/blog/spaced-repetition-explained.jpg";
import summarizeNotes from "@/assets/blog/how-to-summarize-notes-with-ai.jpg";
import examPrepChecklist from "@/assets/blog/exam-prep-checklist-30-days.jpg";
import pomodoro from "@/assets/blog/pomodoro-technique-students.jpg";
import aiFlashcards from "@/assets/blog/ai-flashcards-vs-quizlet.jpg";
import noteTaking from "@/assets/blog/best-note-taking-methods.jpg";
import studyPlan from "@/assets/blog/how-to-create-study-plan.jpg";
import brainFoods from "@/assets/blog/best-foods-for-studying.jpg";
import examStress from "@/assets/blog/dealing-with-exam-stress.jpg";
import feynman from "@/assets/blog/feynman-technique-step-by-step.jpg";
import memoryPalace from "@/assets/blog/memory-palace-method-for-students.jpg";

export type BlogImage = { src: string; alt: string };

export const blogImages: Record<string, BlogImage> = {
  "active-recall-vs-passive-reading": {
    src: activeRecall,
    alt: "Student practicing active recall by closing a textbook and writing answers from memory — proven study technique",
  },
  "spaced-repetition-explained": {
    src: spacedRepetition,
    alt: "Spaced repetition forgetting curve graph with flashcard review intervals across days",
  },
  "how-to-summarize-notes-with-ai": {
    src: summarizeNotes,
    alt: "Stack of student notes being condensed into a clean bullet-point summary by an AI notes summarizer",
  },
  "exam-prep-checklist-30-days": {
    src: examPrepChecklist,
    alt: "30-day exam preparation calendar checklist with study books and a clock counting down to test day",
  },
  "pomodoro-technique-students": {
    src: pomodoro,
    alt: "Pomodoro tomato timer next to an open laptop and notebook — 25-minute focused study session for students",
  },
  "ai-flashcards-vs-quizlet": {
    src: aiFlashcards,
    alt: "AI-generated flashcards on a phone compared to a manually built Quizlet deck",
  },
  "best-note-taking-methods": {
    src: noteTaking,
    alt: "Open notebook showing Cornell notes and outline note-taking methods side by side with a pen",
  },
  "how-to-create-study-plan": {
    src: studyPlan,
    alt: "Color-coded weekly study planner with subject blocks, clock and goal target — personalized study plan template",
  },
  "best-foods-for-studying": {
    src: brainFoods,
    alt: "Brain-boosting foods for studying — blueberries, walnuts, dark chocolate, green tea and salmon next to study books",
  },
  "dealing-with-exam-stress": {
    src: examStress,
    alt: "Calm student meditating beside study books — managing exam stress and test anxiety",
  },
  "feynman-technique-step-by-step": {
    src: feynman,
    alt: "Student explaining a concept on a chalkboard to a child — Feynman technique step by step",
  },
  "memory-palace-method-for-students": {
    src: memoryPalace,
    alt: "Memory palace illustration: a house of rooms holding study symbols connected by a path — method of loci for students",
  },
};

const FALLBACK: BlogImage = {
  src: spacedRepetition,
  alt: "StudyKro article illustration",
};

export function getBlogImage(slug: string): BlogImage {
  return blogImages[slug] ?? FALLBACK;
}
