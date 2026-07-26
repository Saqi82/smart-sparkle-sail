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
        title="Free AI Mnemonic Generator – Memory Tricks & Acronyms | StudyKro"
        description="Mnemonic generator AI. Turn lists, terms or facts into memorable acronyms, stories and memory palaces. Study helper AI for faster memorization."
        canonical="https://studykro.com/mnemonics"
        keywords={["mnemonic generator AI","AI mnemonic generator","memory palace generator","acronym maker","mnemonic device creator","memorization AI","study helper AI","ai active recall tools free","free ai for spaced repetition","ai study helper free","free ai for students"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "StudyKro Free AI Mnemonic Generator",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description: "Mnemonic generator AI. Turn lists, terms or facts into memorable acronyms, stories and memory palaces. Study helper AI for faster memorization. No login required.",
          url: "https://studykro.com/mnemonics",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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

      <ToolSeoContent
        toolName="Free AI Mnemonic Generator"
        guideTitle="How to build mnemonics that actually survive exam day"
        guide={[
          {
            heading: "Why mnemonics work when re-reading doesn't",
            body: [
              "Rote repetition creates weak, isolated memory traces. A mnemonic does the opposite: it forces you to encode new material against something you already know well — a familiar word, a silly image, the layout of your kitchen. That extra structure gives your brain more than one route back to the information, which is exactly what you need under exam pressure when the obvious route goes blank.",
              "The two mechanisms doing the heavy lifting are dual coding (pairing verbal information with a mental image) and elaborative encoding (connecting new facts to existing knowledge). Both are among the most consistently replicated findings in cognitive psychology, and both are things a plain list of terms gives you none of.",
            ],
          },
          {
            heading: "Choosing the right type of mnemonic for the material",
            body: [
              "Short, fixed-order lists — the planets, the order of operations, the stages of mitosis — are best served by an acronym or acrostic. The first letters carry the sequence, and one short phrase does all the work.",
              "Longer lists of ten or more items, or lists where you need to recall each item in isolation, respond better to a memory palace. Placing items along a route you can walk in your head gives each one a unique retrieval cue, which is why competitive memorisers use nothing else.",
              "Material that is conceptual rather than list-based — a process, a cause-and-effect chain, a legal test — usually sticks best as a short story, because the narrative itself encodes the order and the causal links at the same time.",
            ],
          },
          {
            heading: "Making a generated mnemonic your own",
            body: [
              "Treat whatever the generator returns as a first draft. Mnemonics are personal: the version that works is the one built from images and references that mean something to you. Swap in your own street, your own pets, your own in-jokes. A slightly clumsy mnemonic you invented usually beats a polished one you were handed.",
              "Vivid, exaggerated, and mildly absurd beats tasteful every time. If an image makes you laugh or wince, it will still be there in three weeks.",
            ],
          },
          {
            heading: "Rehearsing so it lasts",
            body: [
              "A mnemonic is a retrieval scaffold, not a substitute for practice. Recite it from memory the same day you create it, again the next day, then after three days, a week, and two weeks. Each successful recall pushes the forgetting curve further out.",
              "Always practise unpacking the mnemonic back into the real content. Knowing that 'My Very Educated Mother' exists is useless if you can't get from the M to Mercury. Test the expansion, not the phrase.",
              "Finally, retire mnemonics you no longer need. Once a fact is genuinely automatic, the scaffold just adds a step — drop it and let the direct recall take over.",
            ],
          },
        ]}
        whatItDoes="StudyKro's free AI mnemonic generator turns any list of items, terms, or facts into memorable hooks in seconds. You get six different memory aids in one shot: an acronym, an acrostic sentence, a short story, vivid visual imagery, a rhyme or song, and a step-by-step memory palace walkthrough. Cognitive science shows mnemonics dramatically improve recall by tying new information to vivid, multi-sensory cues. Whether you're memorizing the cranial nerves, the planets, periodic table groups, vocabulary, or historical dates, the AI mnemonic generator gives you several angles so at least one will stick."
        howToUse={[
          "Optionally enter a subject (e.g. Biology, History) to give the AI context.",
          "List the items you want to remember, one per line, then click Generate Memory Aids.",
          "Pick the mnemonic that resonates most and rehearse it with spaced repetition.",
        ]}
        benefits={[
          { title: "Six aids in one click", body: "Acronym, acrostic, story, visual imagery, rhyme, and a memory palace — pick whichever sticks fastest for your brain." },
          { title: "Free with no signup", body: "Unlimited mnemonics, no account, no payment. Use it for every memorization-heavy subject." },
          { title: "Backed by memory science", body: "Built around dual-coding, the method of loci, and elaborative encoding — the techniques memory champions actually use." },
        ]}
        faqs={[
          { q: "Is the AI mnemonic generator free?", a: "Yes. The full mnemonic generator is free with no signup or credit card required." },
          { q: "Can it create a memory palace for me?", a: "Yes — it generates a step-by-step memory palace walkthrough, placing each item in a vivid imagined location." },
          { q: "What subjects does it work for?", a: "Anything list-based: medical school (cranial nerves, drug names), languages, history dates, biology taxonomies, law cases, geography, and more." },
          { q: "How many items can I memorize at once?", a: "Up to about 20 items per request works best — longer lists are easier to remember when split into smaller chunks." },
          { q: "Are mnemonics actually effective?", a: "Yes — peer-reviewed studies on the method of loci and dual-coding show large recall improvements vs. plain rote memorization." },
        ]}
        related={[
          { to: "/flashcards", label: "AI Flashcard Generator", desc: "Pair each mnemonic with a flashcard and review with spaced repetition." },
          { to: "/explainer", label: "AI Concept Explainer", desc: "Understand the concept first, then build a mnemonic to lock it in." },
          { to: "/examtips", label: "AI Exam Tips Generator", desc: "Get the must-memorize lists for your exam and feed them straight in here." },
        ]}
      />
    </PageWrapper>
  );
}
