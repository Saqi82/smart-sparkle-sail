import { useState } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import DocumentUploader from "@/components/DocumentUploader";
import { toast } from "sonner";
import { Layers, ChevronLeft, ChevronRight, Shuffle, Check, BookMarked, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import ToolSeoContent from "@/components/ToolSeoContent";

interface Flashcard {
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

const diffColors: Record<string, string> = {
  Easy: "bg-success/10 text-success border-success/30",
  Medium: "bg-warning/10 text-warning border-warning/30",
  Hard: "bg-destructive/10 text-destructive border-destructive/30",
};

export default function Flashcards() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learned, setLearned] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  const activeCards = cards.filter((_, index) => !learned.has(index));

  const handleGenerate = async () => {
    setError("");
    if (!input.trim()) {
      setError("Enter a topic or paste a few notes so the deck has something to work from.");
      return;
    }
    if (input.trim().length < 5) {
      setError("Add a bit more detail. Five characters is the minimum.");
      return;
    }
    if (!isOnline) {
      toast.error("You’re offline right now. Reconnect and try again.");
      return;
    }
    if (!checkRate()) return;

    setLoading(true);
    try {
      const data = (await callAI("flashcards", { content: input })) as { flashcards: Flashcard[] };
      if (data.flashcards) {
        setCards(data.flashcards);
        setCurrent(0);
        setFlipped(false);
        setLearned(new Set());
        toast.success(`${data.flashcards.length} flashcards are ready.`);
      } else {
        toast.error("The deck came back incomplete. Please try again.");
      }
    } catch (e: any) {
      toast.error(e.message || "The deck could not be created just yet.");
    } finally {
      setLoading(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrent(0);
    setFlipped(false);
    setLearned(new Set());
  };

  const markLearned = () => {
    const realIndex = cards.indexOf(activeCards[current]);
    const next = new Set(learned);
    next.add(realIndex);
    setLearned(next);
    if (current >= activeCards.length - 1) setCurrent(Math.max(0, current - 1));
    setFlipped(false);
    toast.success("Card marked as learned.");
  };

  const card = activeCards[current];

  return (
    <PageWrapper>

      <Seo
        title="Free AI Flashcard Generator – Make Flashcards from Notes | StudyKro"
        description="Free AI flashcard generator. Turn your notes or any topic into ready-to-study flashcards instantly. Built for active recall and spaced repetition."
        canonical="https://studykro.com/flashcards"
        keywords={["AI flashcard generator","make flashcards from notes","free flashcard maker","active recall flashcards","study flashcards AI"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AI Flashcard Generator",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description: "Free AI flashcard generator. Turn your notes or any topic into ready-to-study flashcards instantly. Built for active recall and spaced repetition.",
          url: "https://studykro.com/flashcards",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Smart</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <Layers className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Flashcard Generator</h1>
              <p className="text-sm text-muted-foreground">Turn large topics into small prompts you can revisit anywhere.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Why this matters: flashcards are strongest when they nudge retrieval, not recognition. That is why the screen frames this as pages read and concepts remembered, not just items completed.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[16px] bg-muted/55 p-4">
              <BookMarked className="h-5 w-5 text-primary" />
              <p className="mt-3 font-display font-semibold">Best for</p>
              <p className="micro-note mt-1">Definitions, processes, date-heavy subjects, and any topic you want to practice on repeat.</p>
            </div>
            <div className="rounded-[16px] bg-muted/55 p-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="mt-3 font-display font-semibold">Tip</p>
              <p className="micro-note mt-1">Paste summarized notes for cleaner cards, or paste rough notes to build a first review deck.</p>
            </div>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="field-shell">
            <label className="text-sm font-semibold text-foreground">Add a topic, paste notes, or upload a document</label>
            <p className="micro-note mt-1">A few complete sentences usually create better prompts than a list of disconnected keywords.</p>
            <div className="mt-4">
              <DocumentUploader
                label="Upload source material"
                disabled={loading}
                onText={(text) => {
                  setInput(text);
                  setError("");
                }}
              />
            </div>
            <Textarea
              placeholder="…or paste notes / type a topic"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              maxLength={60000}
              className={`mt-4 min-h-[220px] ${error ? "border-destructive" : ""}`}
            />
            {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            <p className="mt-3 text-sm text-muted-foreground">{input.length.toLocaleString()} / 60,000 characters</p>
            <Button onClick={handleGenerate} disabled={loading} className="mt-5 gradient-bg text-primary-foreground">
              Generate Flashcards
            </Button>
            {loading && <Loader message="Building a flashcard deck you can review quickly..." />}
            {!loading && (
              <div className="mt-6 rounded-[16px] border border-dashed border-border/30 bg-muted/35 px-5 py-5 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Layers className="h-8 w-8" />
                </div>
                <h2 className="mt-4 font-display text-xl font-bold">Your deck will appear here.</h2>
                <p className="mx-auto mt-2 max-w-md helper-copy">No blank dead-ends. Once you generate a deck, you’ll be able to flip cards, shuffle the stack, and track what feels learned.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="paper-panel p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{activeCards.length} pages left in this review stack • {learned.size} concepts unlocked</p>
                  <p className="micro-note mt-1">Click or press Enter to flip a card. Mark it learned only when you can answer without guessing.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={shuffleCards}>
                    <Shuffle className="mr-1 h-4 w-4" /> Shuffle
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => { setCards([]); setCurrent(0); setLearned(new Set()); }}>
                    New Deck
                  </Button>
                </div>
              </div>
              <Progress value={(learned.size / cards.length) * 100} className="mt-4 h-2.5" />
            </div>
            {activeCards.length === 0 ? (
              <div className="paper-panel py-16 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check className="h-10 w-10" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-bold">All cards learned for now.</h2>
                <p className="mx-auto mt-3 max-w-lg helper-copy">That does not mean “done forever.” It means the deck has moved from unfamiliar to familiar enough for a spaced review later.</p>
                <Button variant="outline" className="mt-5" onClick={() => setLearned(new Set())}>
                  Review Again
                </Button>
              </div>
            ) : card && (
              <>
                <div
                  className="flip-card mx-auto cursor-pointer"
                  style={{ width: "100%", maxWidth: 520, height: 320 }}
                  onClick={() => setFlipped(!flipped)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setFlipped(!flipped);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={flipped ? "Flip to question" : "Flip to answer"}
                >
                  <div className={cn("flip-card-inner relative h-full w-full", flipped && "flipped")}>
                    <div className="flip-card-front absolute inset-0 flex flex-col items-center justify-center rounded-[22px] border border-border/20 bg-card px-8 py-10 card-shadow">
                      <span className={cn("mb-4 rounded-full border px-3 py-1 text-xs", diffColors[card.difficulty])}>{card.difficulty}</span>
                      <p className="text-center font-display text-xl font-semibold">{card.question}</p>
                      <p className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Click to reveal the answer</p>
                    </div>
                    <div className="flip-card-back absolute inset-0 flex flex-col items-center justify-center rounded-[22px] border border-transparent gradient-bg px-8 py-10">
                      <p className="text-center font-medium leading-7 text-primary-foreground">{card.answer}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button variant="outline" size="icon" disabled={current === 0} onClick={() => { setCurrent(current - 1); setFlipped(false); }}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="rounded-full bg-muted/60 px-4 py-2 text-sm font-medium">{current + 1} / {activeCards.length}</span>
                  <Button variant="outline" size="icon" disabled={current >= activeCards.length - 1} onClick={() => { setCurrent(current + 1); setFlipped(false); }}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={markLearned} className="ml-2">
                    <Check className="mr-1 h-4 w-4" /> Learned
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
