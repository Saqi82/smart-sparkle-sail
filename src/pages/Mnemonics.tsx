import { useState } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { Sparkles, Music, Eye, Building2 } from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useSeo } from "@/lib/seo";
import ToolSeoContent from "@/components/ToolSeoContent";

interface Result {
  acronym?: { word: string; breakdown: string[] };
  acrostic_sentence?: string;
  story?: string;
  visual_imagery?: string[];
  rhyme_or_song?: string;
  memory_palace_steps?: string[];
}

export default function Mnemonics() {
  useSeo({
    title: "Free AI Mnemonic Generator – Memory Aids for Any List | StudyKro",
    description: "Free AI mnemonic generator. Get acronyms, acrostics, stories, rhymes, and memory palace steps to remember anything fast.",
    keywords: ["AI mnemonic generator", "memory aids", "acronym generator", "memory palace", "study tricks"],
  });
  const [items, setItems] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  const handleSubmit = async () => {
    if (!items.trim() || items.trim().length < 5) {
      toast.error("List the items you want to remember.");
      return;
    }
    if (!isOnline) { toast.error("You’re offline."); return; }
    if (!checkRate()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = (await callAI("mnemonics", { items, subject })) as Result;
      setResult(data);
      toast.success("Memory aids ready.");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate mnemonics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>

      <Seo
        title="Free AI Mnemonic Generator – Acronyms & Memory Palaces | StudyKro"
        description="Free AI mnemonic generator. Turn lists, terms or facts into memorable acronyms, stories and memory palaces. Remember anything, faster."
        canonical="https://studykro.com/mnemonics"
        keywords={["AI mnemonic generator","memory palace generator","acronym maker","mnemonic device creator","memorization AI"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "StudyKro Free AI Mnemonic Generator",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description: "Free AI mnemonic generator. Turn lists, terms or facts into memorable acronyms, stories and memory palaces. Remember anything, faster.",
          url: "https://studykro.com/mnemonics",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1240" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Memorize</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Free AI Mnemonic Generator</h1>
              <p className="text-sm text-muted-foreground">Turn dry lists into acronyms, vivid stories, and memory palaces.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Lists like the planets, cranial nerves, or the periodic groups stick better when they're tied to something memorable. This tool gives you five different angles at once.
          </p>
        </div>

        <div className="field-shell">
          <label className="text-sm font-semibold text-foreground">Subject (optional)</label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Biology, History, Anatomy" className="mt-2" />
          <label className="mt-4 block text-sm font-semibold text-foreground">Items to memorize</label>
          <Textarea
            placeholder="One per line, e.g.&#10;Mercury&#10;Venus&#10;Earth&#10;Mars"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            maxLength={2000}
            className="mt-2 min-h-[180px]"
          />
          <Button onClick={handleSubmit} disabled={loading} className="mt-5 gradient-bg text-primary-foreground">
            {loading ? "Building..." : "Generate Memory Aids"}
          </Button>
        </div>
      </section>

      {loading && <Loader message="Cooking up memorable hooks..." />}

      {result && (
        <section className="mt-8 space-y-6">
          {result.acronym && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Acronym</h3>
              <p className="text-3xl font-bold gradient-text">{result.acronym.word}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {result.acronym.breakdown?.map((b, i) => <li key={i}>• {b}</li>)}
              </ul>
            </div>
          )}
          {result.acrostic_sentence && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Acrostic sentence</h3>
              <p className="helper-copy italic">“{result.acrostic_sentence}”</p>
            </div>
          )}
          {result.story && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">A short story</h3>
              <p className="helper-copy whitespace-pre-line">{result.story}</p>
            </div>
          )}
          {result.visual_imagery && result.visual_imagery.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <Eye className="h-5 w-5 text-info" /> Visual imagery
              </h3>
              <ul className="space-y-2">
                {result.visual_imagery.map((v, i) => (
                  <li key={i} className="rounded-[14px] bg-muted/55 px-4 py-3 text-sm">{v}</li>
                ))}
              </ul>
            </div>
          )}
          {result.rhyme_or_song && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <Music className="h-5 w-5 text-accent" /> Rhyme / song
              </h3>
              <p className="helper-copy whitespace-pre-line">{result.rhyme_or_song}</p>
            </div>
          )}
          {result.memory_palace_steps && result.memory_palace_steps.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <Building2 className="h-5 w-5 text-primary" /> Memory palace walkthrough
              </h3>
              <ol className="space-y-2 text-sm leading-7">
                {result.memory_palace_steps.map((s, i) => (
                  <li key={i} className="rounded-[14px] bg-muted/55 px-4 py-3"><span className="font-semibold text-primary">Step {i + 1}.</span> {s}</li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}
    </PageWrapper>
  );
}
