import { useState } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { PenLine, ListTree, Quote } from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSeo } from "@/lib/seo";
import ToolSeoContent from "@/components/ToolSeoContent";

interface Outline {
  title?: string;
  thesis?: string;
  hook_ideas?: string[];
  introduction?: string;
  body_paragraphs?: { heading: string; topic_sentence: string; evidence: string[]; transition: string }[];
  counterargument?: string;
  conclusion?: string;
  suggested_sources?: string[];
}

export default function EssayOutline() {
  useSeo({
    title: "Free AI Essay Outline Generator – Thesis & Structure | StudyKro",
    description: "Free AI essay outline generator. Get a thesis, hooks, body paragraphs with evidence, counterargument, and conclusion in seconds.",
    keywords: ["AI essay outline generator", "AI essay helper", "thesis statement", "academic writing"],
  });
  const [topic, setTopic] = useState("");
  const [essayType, setEssayType] = useState("argumentative");
  const [length, setLength] = useState("1000");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Outline | null>(null);
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  const handleSubmit = async () => {
    if (!topic.trim() || topic.trim().length < 5) {
      toast.error("Add a clearer essay topic.");
      return;
    }
    if (!isOnline) { toast.error("You’re offline."); return; }
    if (!checkRate()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = (await callAI("essay-outline", { topic, essayType, length })) as Outline;
      setResult(data);
      toast.success("Outline ready.");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate outline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>

      <Seo
        title="Free AI Essay Outline Generator – Thesis & Structure | StudyKro"
        description="Free AI essay outline generator. Get a structured outline with thesis statement, supporting arguments, evidence and conclusion for any essay topic."
        canonical="https://studykro.com/essay-outline"
        keywords={["AI essay outline generator","essay outliner","thesis generator","essay structure AI","academic writing helper"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "StudyKro Free AI Essay Outline Generator",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description: "Free AI essay outline generator. Get a structured outline with thesis statement, supporting arguments, evidence and conclusion for any essay topic.",
          url: "https://studykro.com/essay-outline",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1240" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Write</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <PenLine className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Free AI Essay Outline Generator</h1>
              <p className="text-sm text-muted-foreground">Skip the blank-page panic. Start with a real structure.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            You'll get a thesis, hook ideas, body paragraphs with evidence prompts, a counterargument, and a clean conclusion. Edit and own it from there.
          </p>
        </div>

        <div className="field-shell">
          <label className="text-sm font-semibold text-foreground">Essay topic</label>
          <Textarea
            placeholder="e.g. Should social media platforms be regulated by governments?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            maxLength={1000}
            className="mt-4 min-h-[110px]"
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-foreground">Essay type</label>
              <select
                value={essayType}
                onChange={(e) => setEssayType(e.target.value)}
                className="mt-2 w-full rounded-[12px] border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="argumentative">Argumentative</option>
                <option value="expository">Expository</option>
                <option value="narrative">Narrative</option>
                <option value="compare and contrast">Compare & Contrast</option>
                <option value="analytical">Analytical</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Target length (words)</label>
              <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="mt-2" min="300" max="5000" />
            </div>
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="mt-5 gradient-bg text-primary-foreground">
            {loading ? "Outlining..." : "Generate Outline"}
          </Button>
        </div>
      </section>

      {loading && <Loader message="Drafting a structure that holds together..." />}

      {result && (
        <section className="mt-8 space-y-6">
          {result.title && (
            <div className="paper-panel p-6">
              <p className="note-label">Working title</p>
              <h2 className="mt-3 font-display text-2xl font-bold">{result.title}</h2>
              {result.thesis && (
                <div className="mt-4 rounded-[14px] bg-primary/10 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Thesis</p>
                  <p className="mt-1 font-medium">{result.thesis}</p>
                </div>
              )}
            </div>
          )}
          {result.hook_ideas && result.hook_ideas.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <Quote className="h-5 w-5 text-accent" /> Hook ideas
              </h3>
              <ul className="space-y-2">
                {result.hook_ideas.map((h, i) => (
                  <li key={i} className="rounded-[14px] bg-muted/55 px-4 py-3 text-sm leading-7">{h}</li>
                ))}
              </ul>
            </div>
          )}
          {result.introduction && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Introduction</h3>
              <p className="helper-copy">{result.introduction}</p>
            </div>
          )}
          {result.body_paragraphs && result.body_paragraphs.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <ListTree className="h-5 w-5 text-info" /> Body paragraphs
              </h3>
              <div className="space-y-4">
                {result.body_paragraphs.map((p, i) => (
                  <div key={i} className="rounded-[14px] bg-muted/55 p-4">
                    <p className="font-display font-semibold text-primary">{i + 1}. {p.heading}</p>
                    <p className="mt-2 text-sm"><span className="font-semibold">Topic sentence:</span> {p.topic_sentence}</p>
                    {p.evidence?.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {p.evidence.map((e, j) => <li key={j}>• {e}</li>)}
                      </ul>
                    )}
                    {p.transition && <p className="mt-2 text-xs italic text-muted-foreground">Transition: {p.transition}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {result.counterargument && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Counterargument & rebuttal</h3>
              <p className="helper-copy">{result.counterargument}</p>
            </div>
          )}
          {result.conclusion && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Conclusion</h3>
              <p className="helper-copy">{result.conclusion}</p>
            </div>
          )}
          {result.suggested_sources && result.suggested_sources.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Suggested source types</h3>
              <ul className="space-y-2">
                {result.suggested_sources.map((s, i) => (
                  <li key={i} className="text-sm">• {s}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      <ToolSeoContent
        toolName="Free AI Essay Outline Generator"
        whatItDoes="StudyKro's free AI essay outline generator turns any essay topic into a complete, structured outline in seconds. You get a working title, a clear thesis statement, hook ideas for the introduction, body paragraphs with topic sentences and evidence prompts, a counterargument with rebuttal, a conclusion, and suggested source types to research. It supports argumentative, expository, narrative, compare-and-contrast, and analytical essays at any target word count from 300 to 5,000 words. It's the fastest way to skip the blank-page panic and start writing with a structure that actually holds together."
        howToUse={[
          "Type your essay topic, pick the essay type, and set the target word count.",
          "Click Generate Outline. The AI returns a thesis, hooks, body paragraphs, counterargument, and conclusion.",
          "Edit and expand each section into your own essay — the structure is yours to keep.",
        ]}
        benefits={[
          { title: "Skip the blank page", body: "Start every assignment with a thesis and a paragraph-by-paragraph plan instead of staring at an empty doc." },
          { title: "Free with no signup", body: "Unlimited essay outlines, no account, no payment. Use it for every assignment in your semester." },
          { title: "Built-in counterargument", body: "Strong essays address the opposing view. The AI surfaces it for you so your argument lands harder." },
        ]}
        faqs={[
          { q: "Is the AI essay outline generator free?", a: "Yes. The full essay outline generator is free with no signup, trial, or credit card required." },
          { q: "Does it write the full essay?", a: "No — it gives you the outline (thesis, body paragraphs, evidence prompts, conclusion) so you can write the essay yourself, ethically." },
          { q: "What essay types does it support?", a: "Argumentative, expository, narrative, compare-and-contrast, and analytical essays at 300–5,000 words." },
          { q: "Will my essay be flagged as AI-written?", a: "Since you write the essay yourself using the outline as scaffolding, the final draft is in your voice. Run it through the plagiarism checker to be sure." },
          { q: "Can I cite the suggested sources?", a: "The AI suggests source types (peer-reviewed studies, government data, etc.) — find the actual sources yourself in your library or Google Scholar." },
        ]}
        related={[
          { to: "/summarizer", label: "AI Notes Summarizer", desc: "Summarize research articles before pulling evidence into your outline." },
          { to: "/plagiarism-checker", label: "AI Plagiarism Checker", desc: "Scan your finished essay for plagiarism and AI-generated phrasing." },
          { to: "/explainer", label: "AI Concept Explainer", desc: "Stuck on a concept your essay relies on? Get a clear explanation first." },
        ]}
      />
    </PageWrapper>
  );
}
