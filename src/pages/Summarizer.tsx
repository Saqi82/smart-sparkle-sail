import { useState, useRef, useEffect } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import DocumentUploader from "@/components/DocumentUploader";
import { toast } from "sonner";
import { FileText, Lightbulb, BookOpen, AlertTriangle, PencilRuler, Sparkles } from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import ToolSeoContent from "@/components/ToolSeoContent";

interface SummaryResult {
  title?: string;
  short_summary?: string;
  key_points?: string[];
  definitions?: { term: string; definition: string }[];
  important_formulas?: string[];
  remember_this?: string;
}

export default function Summarizer() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState("");
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();
  const resultRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const handleSubmit = async () => {
    setError("");
    if (!notes.trim()) {
      setError("Paste a few notes first so I have something to shape.");
      return;
    }
    if (notes.trim().length < 20) {
      setError("Add a little more detail. Around 20 characters is the minimum.");
      return;
    }
    if (!isOnline) {
      toast.error("You’re offline right now. Reconnect and we’ll keep going.");
      return;
    }
    if (!checkRate()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = (await callAI("summarize", { notes })) as SummaryResult;
      setResult(data);
      toast.success("Your notes are ready to review.");
    } catch (e: any) {
      toast.error(e.message || "That summary didn’t come through. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>

      <Seo
        title="Free AI Notes Summarizer – Turn Long Notes into Key Points | StudyKro"
        description="Free AI notes summarizer. Paste lecture notes, textbook chapters or articles and get concise summaries, key points, definitions and formulas in seconds."
        canonical="https://studykro.com/summarizer"
        keywords={["AI notes summarizer","summarize notes online","AI summary generator","study notes summarizer","lecture summary AI","free summarizer"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AI Notes Summarizer",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description: "Free AI notes summarizer. Paste lecture notes, textbook chapters or articles and get concise summaries, key points, definitions and formulas in seconds.",
          url: "https://studykro.com/summarizer",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Smart</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Notes Summarizer</h1>
              <p className="text-sm text-muted-foreground">Turn raw notes into something easier to revise and explain back to yourself.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Why this matters: most study friction starts before memorization. A clean summary gives you a more stable first layer, so later tools feel sharper instead of repetitive.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[16px] bg-muted/55 p-4">
              <PencilRuler className="h-5 w-5 text-primary" />
              <p className="mt-3 font-display font-semibold">Best for</p>
              <p className="micro-note mt-1">Lecture notes, textbook passages, or rough brainstorms that need structure.</p>
            </div>
            <div className="rounded-[16px] bg-muted/55 p-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="mt-3 font-display font-semibold">You’ll get</p>
              <p className="micro-note mt-1">Key points, definitions, formulas, and one final idea worth holding onto.</p>
            </div>
          </div>
        </div>

        <div className="field-shell">
          <label className="text-sm font-semibold text-foreground">Paste your notes or upload a document</label>
          <p className="micro-note mt-1">Aim for complete thoughts instead of fragments. The clearer the source, the more teachable the summary.</p>
          <div className="mt-4">
            <DocumentUploader
              label="Upload notes (PDF, DOCX, PPTX, TXT, image)"
              disabled={loading}
              onText={(text) => {
                setNotes(text);
                setError("");
              }}
            />
          </div>
          <Textarea
            placeholder="…or paste your lecture notes here"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setError("");
            }}
            maxLength={60000}
            className={`mt-4 min-h-[220px] ${error ? "border-destructive" : ""}`}
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{notes.length.toLocaleString()} / 60,000 characters</span>
            <span className="text-xs text-muted-foreground">Think of this as page 1 of your revision pack.</span>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="mt-5 gradient-bg text-primary-foreground">
            {loading ? "Summarizing..." : "Summarize Notes"}
          </Button>
        </div>
      </section>

      {loading && <Loader message="Shaping your notes into a cleaner study guide..." />}

      {!loading && !result && (
        <section className="paper-panel mt-8 px-6 py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileText className="h-9 w-9" />
          </div>
          <h2 className="mt-5 text-2xl font-display font-bold">Nothing summarized yet.</h2>
          <p className="mx-auto mt-3 max-w-2xl helper-copy">
            Start with a chunk of notes and the app will turn it into a lesson-friendly outline. This empty state stays useful on purpose, so learners are never dropped into a blank area.
          </p>
        </section>
      )}

      {result && (
        <section ref={resultRef} className="mt-8 space-y-6 scroll-mt-24">
          {result.title && (
            <div className="paper-panel p-6">
              <p className="note-label">Overview</p>
              <h2 className="mt-3 font-display text-2xl font-bold">{result.title}</h2>
              <p className="mt-3 helper-copy">{result.short_summary}</p>
            </div>
          )}
          {result.key_points && result.key_points.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <Lightbulb className="h-5 w-5 text-warning" /> Concepts unlocked
              </h3>
              <p className="micro-note mb-4">Use these as the backbone for recall. If you can explain them aloud, you’re moving in the right direction.</p>
              <ol className="space-y-3 text-sm leading-7">
                {result.key_points.map((point, index) => (
                  <li key={index} className="rounded-[14px] bg-muted/55 px-4 py-3">
                    {point}
                  </li>
                ))}
              </ol>
            </div>
          )}
          {result.definitions && result.definitions.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <BookOpen className="h-5 w-5 text-info" /> Definitions
              </h3>
              <div className="space-y-3">
                {result.definitions.map((definition, index) => (
                  <div key={index} className="rounded-[14px] bg-muted/55 px-4 py-4 text-sm leading-7">
                    <span className="font-semibold text-primary">{definition.term}</span>
                    <span className="text-muted-foreground"> — {definition.definition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.important_formulas && result.important_formulas.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Important formulas</h3>
              <p className="micro-note mb-4">These are the lines worth revisiting until they feel familiar, not fragile.</p>
              <div className="space-y-2">
                {result.important_formulas.map((formula, index) => (
                  <code key={index} className="block rounded-[14px] bg-muted px-4 py-3 text-sm">
                    {formula}
                  </code>
                ))}
              </div>
            </div>
          )}
          {result.remember_this && (
            <div className="rounded-[18px] border border-warning/30 bg-warning/10 p-6">
              <h3 className="mb-2 flex items-center gap-2 font-display text-xl font-semibold">
                <AlertTriangle className="h-5 w-5 text-warning" /> Hold onto this idea
              </h3>
              <p className="font-medium leading-7">{result.remember_this}</p>
            </div>
          )}
        </section>
      )}
    </PageWrapper>
  );
}
