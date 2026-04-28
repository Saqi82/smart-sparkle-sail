import { useState } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import {
  ShieldCheck, AlertTriangle, FileSearch, Sparkles, BadgeCheck, ScanLine,
} from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface SuspiciousPassage {
  passage: string;
  reason: string;
  likely_source_type: string;
  match_confidence: number;
  suggested_rewrite: string;
}

interface PlagiarismResult {
  originality_score: number;
  plagiarism_likelihood: number;
  ai_generated_likelihood: number;
  verdict: "original" | "minor_concerns" | "likely_plagiarised" | "highly_plagiarised";
  summary: string;
  suspicious_passages: SuspiciousPassage[];
  recommendations: string[];
}

const verdictMeta: Record<PlagiarismResult["verdict"], { label: string; tone: string }> = {
  original: { label: "Looks original", tone: "text-green-600 bg-green-500/10 border-green-500/30" },
  minor_concerns: { label: "Minor concerns", tone: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
  likely_plagiarised: { label: "Likely plagiarised", tone: "text-orange-600 bg-orange-500/10 border-orange-500/30" },
  highly_plagiarised: { label: "Highly plagiarised", tone: "text-red-600 bg-red-500/10 border-red-500/30" },
};

export default function Plagiarism() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [error, setError] = useState("");
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  const handleSubmit = async () => {
    setError("");
    if (!text.trim() || text.trim().length < 30) {
      setError("Paste at least 30 characters of text to scan.");
      return;
    }
    if (!isOnline) {
      toast.error("You’re offline right now. Reconnect and try again.");
      return;
    }
    if (!checkRate()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = (await callAI("plagiarism", { text })) as PlagiarismResult;
      setResult(data);
      toast.success("Plagiarism scan complete.");
    } catch (e: any) {
      toast.error(e.message || "Couldn’t complete the scan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Seo
        title="Free AI Plagiarism Checker – 100% Accuracy Originality Scanner | StudyKro"
        description="Free AI plagiarism checker for students. Scan essays, assignments and articles for plagiarism, AI-generated text and unoriginal phrasing. Get an originality score and rewrite suggestions instantly."
        canonical="https://studykro.com/plagiarism-checker"
        keywords={[
          "plagiarism checker",
          "free plagiarism checker",
          "AI plagiarism detector",
          "originality checker",
          "AI content detector",
          "essay plagiarism checker",
          "100% accurate plagiarism checker",
          "student plagiarism scanner",
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "StudyKro Plagiarism Checker",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description:
            "Free AI plagiarism checker. Scan essays and assignments for plagiarism, AI-generated text, and unoriginal phrasing — with an originality score and rewrite suggestions.",
          url: "https://studykro.com/plagiarism-checker",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Verify</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Plagiarism Checker</h1>
              <p className="text-sm text-muted-foreground">
                Scan any essay or assignment for plagiarism, AI-generated text and unoriginal phrasing.
              </p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Powered by an academic-grade language model trained to spot copied phrasing, encyclopedic patterns, and
            generic AI output. Get an originality score, flagged passages, and a clean rewrite for every issue.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[16px] bg-muted/55 p-4">
              <FileSearch className="h-5 w-5 text-primary" />
              <p className="mt-3 font-display font-semibold">Deep scan</p>
              <p className="micro-note mt-1">Sentence-level analysis with confidence ratings on every flagged passage.</p>
            </div>
            <div className="rounded-[16px] bg-muted/55 p-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="mt-3 font-display font-semibold">Rewrite ready</p>
              <p className="micro-note mt-1">Each flagged sentence comes with an original, in-your-voice replacement.</p>
            </div>
          </div>
        </div>

        <div className="field-shell">
          <label className="text-sm font-semibold text-foreground">Paste your text</label>
          <p className="micro-note mt-1">Essay, assignment, paragraph or article — minimum 30 characters.</p>
          <Textarea
            placeholder="Paste the text you want to check for plagiarism..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            maxLength={12000}
            className={`mt-4 min-h-[260px] ${error ? "border-destructive" : ""}`}
          />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <div className="mt-3 flex items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">{text.length.toLocaleString()} / 12,000 characters</span>
            <span className="text-xs text-muted-foreground">100% private — nothing is stored.</span>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 gradient-bg text-primary-foreground"
          >
            <ScanLine className="mr-2 h-4 w-4" />
            {loading ? "Scanning..." : "Check Plagiarism"}
          </Button>
        </div>
      </section>

      {loading && <Loader message="Comparing phrasing patterns and originality signals..." />}

      {!loading && !result && (
        <section className="paper-panel mt-8 px-6 py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-9 w-9" />
          </div>
          <h2 className="mt-5 text-2xl font-display font-bold">No scan yet.</h2>
          <p className="mx-auto mt-3 max-w-2xl helper-copy">
            Paste your essay or assignment above and we’ll return an originality score, AI-detection score, flagged
            passages and rewrite suggestions in seconds.
          </p>
        </section>
      )}

      {result && (
        <section className="mt-8 space-y-6">
          {/* Score panel */}
          <div className="paper-panel p-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${verdictMeta[result.verdict].tone}`}>
                  <BadgeCheck className="h-3.5 w-3.5" />
                  {verdictMeta[result.verdict].label}
                </span>
                <h2 className="mt-3 font-display text-2xl font-bold">Originality report</h2>
                <p className="mt-2 max-w-xl helper-copy">{result.summary}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <ScoreTile label="Originality" value={result.originality_score} good />
                <ScoreTile label="Plagiarism" value={result.plagiarism_likelihood} />
                <ScoreTile label="AI-written" value={result.ai_generated_likelihood} />
              </div>
            </div>
          </div>

          {/* Suspicious passages */}
          {result.suspicious_passages?.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold">
                <AlertTriangle className="h-5 w-5 text-warning" /> Flagged passages
              </h3>
              <div className="space-y-4">
                {result.suspicious_passages.map((p, i) => (
                  <div key={i} className="rounded-[16px] border border-border bg-muted/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-destructive">
                        {p.likely_source_type}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        Match confidence: {Math.round(p.match_confidence)}%
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-foreground/90">“{p.passage}”</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">Why flagged: </span>
                      {p.reason}
                    </p>
                    <div className="mt-3 rounded-[12px] bg-background p-3 text-sm leading-7">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                        Suggested rewrite
                      </span>
                      <p className="mt-1">{p.suggested_rewrite}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations?.length > 0 && (
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Next steps</h3>
              <ul className="space-y-2 text-sm leading-7">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="rounded-[14px] bg-muted/55 px-4 py-3">{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </PageWrapper>
  );
}

function ScoreTile({ label, value, good }: { label: string; value: number; good?: boolean }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const isGoodSignal = good ? v >= 70 : v <= 30;
  const tone = isGoodSignal
    ? "text-green-600"
    : (good ? v >= 40 : v <= 60)
      ? "text-amber-600"
      : "text-red-600";
  return (
    <div className="rounded-[14px] bg-muted/55 px-3 py-3">
      <div className={`font-display text-2xl font-bold ${tone}`}>{v}%</div>
      <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
