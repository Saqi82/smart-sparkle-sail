import { useState } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { Brain, Lightbulb, BookOpen, AlertTriangle, Sparkles } from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSeo } from "@/lib/seo";

interface Result {
  title?: string;
  eli5?: string;
  analogy?: string;
  detailed?: string;
  key_terms?: { term: string; meaning: string }[];
  example?: string;
  common_misconceptions?: string[];
}

export default function Explainer() {
  useSeo({
    title: "AI Concept Explainer – Understand Any Topic Instantly | StudyKro",
    description: "Free AI concept explainer using the Feynman technique. Get ELI5, analogies, key terms, and examples for any difficult topic in seconds.",
    keywords: ["AI concept explainer", "Feynman technique", "ELI5", "study help", "topic explainer"],
  });
  const [concept, setConcept] = useState("");
  const [level, setLevel] = useState("beginner");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  const handleSubmit = async () => {
    if (!concept.trim() || concept.trim().length < 3) {
      toast.error("Type a topic to explain.");
      return;
    }
    if (!isOnline) { toast.error("You’re offline."); return; }
    if (!checkRate()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = (await callAI("explainer", { concept, level })) as Result;
      setResult(data);
      toast.success("Here’s your explanation.");
    } catch (e: any) {
      toast.error(e.message || "Couldn’t fetch the explanation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>

      <Seo
        title="Free AI Concept Explainer – ELI5, Analogies & Deep Dives | StudyKro"
        description="Free AI concept explainer. Get ELI5 explanations, analogies and deep-dive breakdowns of any concept — built around the Feynman technique."
        canonical="https://studykro.com/explainer"
        keywords={["AI concept explainer","ELI5 generator","Feynman technique AI","explain like I'm 5","AI tutor","study concept breakdown"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AI Concept Explainer",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description: "Free AI concept explainer. Get ELI5 explanations, analogies and deep-dive breakdowns of any concept — built around the Feynman technique.",
          url: "https://studykro.com/explainer",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Understand</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Concept Explainer</h1>
              <p className="text-sm text-muted-foreground">Confusing topic? Get an ELI5, an analogy, and a deeper version side-by-side.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Built around the Feynman technique: if you can explain it simply, you actually know it. Use this when a textbook leaves you more confused than when you started.
          </p>
        </div>

        <div className="field-shell">
          <label className="text-sm font-semibold text-foreground">What should we explain?</label>
          <Textarea
            placeholder="e.g. Quantum entanglement, photosynthesis, supply and demand..."
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            maxLength={1000}
            className="mt-4 min-h-[120px]"
          />
          <div className="mt-4">
            <label className="text-sm font-semibold text-foreground">Explain at level</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {["beginner", "intermediate", "advanced"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`rounded-full px-4 py-2 text-sm capitalize transition-colors ${level === l ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="mt-5 gradient-bg text-primary-foreground">
            {loading ? "Explaining..." : "Explain it to me"}
          </Button>
        </div>
      </section>

      {loading && <Loader message="Breaking the concept into clearer layers..." />}

      {result && (
        <section className="mt-8 space-y-6">
          {result.title && (
            <div className="paper-panel p-6">
              <p className="note-label">Topic</p>
              <h2 className="mt-3 font-display text-2xl font-bold">{result.title}</h2>
            </div>
          )}
          {result.eli5 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <Sparkles className="h-5 w-5 text-primary" /> Explain like I'm 5
              </h3>
              <p className="helper-copy">{result.eli5}</p>
            </div>
          )}
          {result.analogy && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <Lightbulb className="h-5 w-5 text-warning" /> Everyday analogy
              </h3>
              <p className="helper-copy">{result.analogy}</p>
            </div>
          )}
          {result.detailed && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">The detailed version</h3>
              <p className="helper-copy whitespace-pre-line">{result.detailed}</p>
            </div>
          )}
          {result.key_terms && result.key_terms.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <BookOpen className="h-5 w-5 text-info" /> Key terms
              </h3>
              <div className="space-y-3">
                {result.key_terms.map((t, i) => (
                  <div key={i} className="rounded-[14px] bg-muted/55 px-4 py-3 text-sm leading-7">
                    <span className="font-semibold text-primary">{t.term}</span>
                    <span className="text-muted-foreground"> — {t.meaning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.example && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Worked example</h3>
              <p className="helper-copy">{result.example}</p>
            </div>
          )}
          {result.common_misconceptions && result.common_misconceptions.length > 0 && (
            <div className="rounded-[18px] border border-warning/30 bg-warning/10 p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <AlertTriangle className="h-5 w-5 text-warning" /> Common misconceptions
              </h3>
              <ul className="space-y-2">
                {result.common_misconceptions.map((m, i) => (
                  <li key={i} className="text-sm leading-7">• {m}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </PageWrapper>
  );
}
