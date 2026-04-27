import { useState } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { Target, AlertTriangle, Clock, Trophy } from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface ExamTipsResult {
  likely_questions: string[];
  must_study_topics: string[];
  common_mistakes: string[];
  last_minute_tips: string[];
  time_management: string;
  scoring_strategy: string;
}

export default function ExamTips() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [examType, setExamType] = useState("Midterm");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExamTipsResult | null>(null);
  const [error, setError] = useState("");
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  const handleGenerate = async () => {
    setError("");
    if (!subject.trim()) {
      setError("Enter the subject so we can focus the guidance.");
      return;
    }
    if (subject.trim().length < 3) {
      setError("Please use at least 3 characters for the subject.");
      return;
    }
    if (!isOnline) {
      toast.error("You’re offline right now. Reconnect and try again.");
      return;
    }
    if (!checkRate()) return;

    setLoading(true);
    try {
      const data = (await callAI("examtips", { subject, topic, examType })) as ExamTipsResult;
      if (data.likely_questions) {
        setResult(data);
        toast.success("Your exam guidance is ready.");
      } else {
        toast.error("The exam guidance came back incomplete. Please try again.");
      }
    } catch (e: any) {
      toast.error(e.message || "The exam guidance could not be created just yet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>

      <Seo
        title="Free AI Exam Tips – Predicted Questions & Last-Mile Prep | StudyKro"
        description="Free AI exam tips generator. Get predicted exam questions, focus areas and last-mile preparation strategy for any subject — in seconds."
        canonical="https://studykro.com/examtips"
        keywords={["AI exam tips","predicted exam questions","exam preparation guide","last-minute exam prep","exam strategy AI"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AI Exam Tips Generator",
          applicationCategory: "EducationApplication",
          operatingSystem: "Web",
          description: "Free AI exam tips generator. Get predicted exam questions, focus areas and last-mile preparation strategy for any subject — in seconds.",
          url: "https://studykro.com/examtips",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Smart</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Exam Predictor</h1>
              <p className="text-sm text-muted-foreground">Use likely themes and practical tips to focus the time you have left.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Why this matters: the final stretch before an exam often feels noisy. This screen narrows the field so learners can decide what deserves attention first.
          </p>
        </div>

        {!result ? (
          <div className="field-shell max-w-xl space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">Subject</label>
              <Input
                placeholder="Subject (e.g., Data Structures)"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setError("");
                }}
                maxLength={200}
                className={`mt-3 ${error ? "border-destructive" : ""}`}
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Specific topic</label>
              <p className="micro-note mt-1">Optional, but useful if you already know the area you’re revising.</p>
              <Input placeholder="Specific topic (optional)" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={200} className="mt-3" />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Exam type</label>
              <Select value={examType} onValueChange={setExamType}>
                <SelectTrigger className="mt-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Midterm">Midterm</SelectItem>
                  <SelectItem value="Final">Final Exam</SelectItem>
                  <SelectItem value="Semester">Semester Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="gradient-bg text-primary-foreground">
              Predict Exam Content
            </Button>
            {loading && <Loader message="Looking for likely themes and strategy cues..." />}
          </div>
        ) : (
          <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => setResult(null)}>
              New Prediction
            </Button>
            <div className="paper-panel p-6">
              <h3 className="mb-4 font-display text-xl font-semibold">Likely exam questions</h3>
              <div className="space-y-3">
                {result.likely_questions.map((question, index) => (
                  <div key={index} className="flex gap-3 rounded-[14px] bg-muted/55 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-bg text-xs font-bold text-primary-foreground">{index + 1}</span>
                    <span className="text-sm leading-7">{question}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Must-study topics</h3>
              <div className="flex flex-wrap gap-2">
                {result.must_study_topics.map((topicName, index) => (
                  <span key={index} className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                    {topicName}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[18px] border border-destructive/30 bg-destructive/10 p-6">
              <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold">
                <AlertTriangle className="h-5 w-5 text-destructive" /> Common mistakes
              </h3>
              <ul className="space-y-2 text-sm leading-7">
                {result.common_mistakes.map((mistake, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-destructive">×</span>
                    {mistake}
                  </li>
                ))}
              </ul>
            </div>
            <div className="paper-panel p-6">
              <h3 className="mb-3 font-display text-xl font-semibold">Last-minute tips</h3>
              <ul className="space-y-2 text-sm leading-7">
                {result.last_minute_tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="paper-panel p-6">
                <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
                  <Clock className="h-5 w-5 text-info" /> Time management
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">{result.time_management}</p>
              </div>
              <div className="paper-panel p-6">
                <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-semibold">
                  <Trophy className="h-5 w-5 text-warning" /> Scoring strategy
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">{result.scoring_strategy}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
