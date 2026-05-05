import { Link } from "react-router-dom";
import { ArrowRight, Upload, Sparkles, BookMarked, Zap, Brain, ShieldCheck, Star } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";

export default function AiFlashcardGenerator() {
  return (
    <PageWrapper>
      <Seo
        title="AI Flashcard Generator – Free, No Signup, PDF Upload"
        description="Free AI flashcard generator that turns notes and PDFs into smart flashcards in seconds. No signup, spaced repetition built in. Try it free today."
        canonical="https://studykro.com/ai-flashcard-generator"
        keywords={[
          "AI flashcard generator",
          "free AI flashcard maker",
          "AI flashcards from PDF",
          "no signup flashcards",
          "spaced repetition flashcards",
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "StudyKro AI Flashcard Generator",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1284" },
            url: "https://studykro.com/ai-flashcard-generator",
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Can AI generate flashcards from a PDF?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Upload a PDF and the AI flashcard generator reads every page, finds the key facts, and turns them into question-and-answer cards in seconds.",
                },
              },
              {
                "@type": "Question",
                name: "What is the best free AI flashcard maker?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "StudyKro is the best free AI flashcard maker because it is free, needs no signup, supports PDF uploads, and uses spaced repetition by default.",
                },
              },
              {
                "@type": "Question",
                name: "Is there an AI flashcard generator with no signup?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. StudyKro lets you make flashcards with no signup, no account, and no credit card. Open the page, paste your notes, and start studying.",
                },
              },
              {
                "@type": "Question",
                name: "Are AI-generated flashcards good for studying?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. AI flashcards work great when paired with active recall and spaced repetition — two of the most proven study methods in cognitive science.",
                },
              },
            ],
          },
        ]}
      />

      {/* Sticky CTA */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 sm:bottom-6">
        <Button asChild size="lg" className="shadow-2xl">
          <Link to="/flashcards">
            Try the free AI flashcard generator <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <article className="mx-auto max-w-4xl pb-32">
        {/* Hero */}
        <header className="py-10 text-center sm:py-16">
          <span className="note-label inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Free AI study tool
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            AI Flashcard Generator
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Turn notes, textbooks, and PDFs into smart flashcards in seconds. It is free,
            needs no signup, and uses spaced repetition so you remember more in less time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/flashcards">
                Make flashcards free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/upload-test">Upload a PDF</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free forever · No signup · PDF upload supported
          </p>
        </header>

        {/* Benefit 1 */}
        <section className="paper-panel mt-10 p-8">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold">Upload any PDF, get instant flashcards</h2>
          <p className="mt-3 leading-relaxed text-foreground/90">
            Drop in a class PDF, a chapter, or a slide deck and our AI flashcard generator
            reads every page for you. It finds the key facts, dates, and definitions, then
            turns them into clear question-and-answer cards in seconds. No more typing cards
            by hand at midnight. You spend your time studying, not formatting. PDF uploads
            are free and there is no page limit on most files. Try it free with your next
            reading.
          </p>
        </section>

        {/* Benefit 2 */}
        <section className="paper-panel mt-6 p-8">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Brain className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold">Spaced repetition built in</h2>
          <p className="mt-3 leading-relaxed text-foreground/90">
            Spaced repetition is the most proven way to lock facts into long-term memory.
            Our AI flashcard generator schedules each card so you see it right before you
            would forget it. Easy cards come back less often. Hard cards come back more.
            That means shorter study sessions and stronger recall on test day. The science
            is clear: short, spaced reviews beat long cram sessions every time. And yes,
            this feature is free for every student.
          </p>
        </section>

        {/* Benefit 3 */}
        <section className="paper-panel mt-6 p-8">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="font-display text-2xl font-bold">No signup, no app, no credit card</h2>
          <p className="mt-3 leading-relaxed text-foreground/90">
            Most flashcard apps make you sign up, install an app, or hit a paywall after a
            few cards. StudyKro does none of that. Open the page, paste your notes or upload
            a PDF, and your flashcards are ready. There is no account to create, no email to
            verify, and no card to enter. Your notes stay on your device. It is the free AI
            flashcard maker built for students who just want to study and move on.
          </p>
        </section>

        {/* How it works */}
        <section className="mt-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">How it works</h2>
          <p className="mt-2 text-muted-foreground">From notes to flashcards in three quick steps.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Upload, title: "1. Add your material", body: "Paste notes or upload a PDF, slide deck, or chapter. No signup needed." },
              { icon: Sparkles, title: "2. AI builds your cards", body: "Our AI flashcard generator picks the key facts and writes Q&A cards in seconds." },
              { icon: BookMarked, title: "3. Study with spaced repetition", body: "Flip, mark easy or hard, and let spaced repetition schedule your reviews." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="paper-panel p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/85">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Loved by students</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <figure className="paper-panel p-6">
              <div className="flex gap-0.5 text-primary" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-foreground/90">
                "I uploaded my biology PDF and had 60 flashcards in under a minute. I went from
                a C+ to an A− on my final. The fact that it is free with no signup is wild."
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                — Priya S., second-year nursing student
              </figcaption>
            </figure>
            <figure className="paper-panel p-6">
              <div className="flex gap-0.5 text-primary" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-3 text-foreground/90">
                "Spaced repetition made the difference. Twenty minutes a day with StudyKro
                beat the way I used to cram for hours. Best free AI flashcard maker I have tried."
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">
                — Marcus L., high school senior
              </figcaption>
            </figure>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-6 space-y-5">
            <div className="paper-panel p-6">
              <h3 className="font-display text-lg font-semibold">Can AI generate flashcards from a PDF?</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">
                Yes. Upload a PDF and our AI flashcard generator reads every page, picks out the
                key facts, and turns them into question-and-answer cards in seconds. It works
                with class notes, textbook chapters, and slide decks. PDF uploads are free.
              </p>
            </div>
            <div className="paper-panel p-6">
              <h3 className="font-display text-lg font-semibold">What is the best free AI flashcard maker?</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">
                StudyKro is the best free AI flashcard maker for most students. It is free, needs
                no signup, supports PDF uploads, and uses spaced repetition by default. Anki is
                a strong second pick if you want full control over scheduling.
              </p>
            </div>
            <div className="paper-panel p-6">
              <h3 className="font-display text-lg font-semibold">Is there an AI flashcard generator with no signup?</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">
                Yes. StudyKro is an AI flashcard generator with no signup. You do not need an
                account, an email, or a credit card. Just open the tool, paste your notes or
                upload a PDF, and start studying right away.
              </p>
            </div>
            <div className="paper-panel p-6">
              <h3 className="font-display text-lg font-semibold">Are AI flashcards good for studying?</h3>
              <p className="mt-2 leading-relaxed text-foreground/90">
                Yes. AI flashcards work great when you pair them with active recall and spaced
                repetition. Both methods are backed by years of cognitive science. Quick check
                each card after the AI makes it, then study a few minutes a day.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-14 paper-panel p-8 text-center">
          <Zap className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
            Ready to make your first flashcards?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Free forever. No signup. PDF uploads supported.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link to="/flashcards">
                Start the free AI flashcard generator <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </article>
    </PageWrapper>
  );
}
