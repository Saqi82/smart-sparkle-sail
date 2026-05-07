import { useState, useEffect } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { Calendar, AlertTriangle } from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import ToolSeoContent from "@/components/ToolSeoContent";

interface DailyPlan {
  day: number;
  date?: string;
  focus_topic: string;
  tasks: string[];
  hours: number;
  tip: string;
}

interface StudyPlanResult {
  total_days: number;
  overall_strategy: string;
  daily_plans: DailyPlan[];
  resources: string[];
  warning?: string | null;
}

export default function StudyPlan() {
  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hours, setHours] = useState("3");
  const [level, setLevel] = useState("Intermediate");
  const [weakAreas, setWeakAreas] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<StudyPlanResult | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const saved = localStorage.getItem("studyplan-checked");
    if (saved) setChecked(JSON.parse(saved));
  }, []);

  const toggleTask = (key: string) => {
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    localStorage.setItem("studyplan-checked", JSON.stringify(next));
  };

  const handleGenerate = async () => {
    const newErrors: Record<string, string> = {};
    if (!subject.trim()) newErrors.subject = "Add the subject you’re studying.";
    if (!examDate) newErrors.examDate = "Choose the exam date so the plan can pace itself.";
    else if (new Date(examDate) <= new Date()) newErrors.examDate = "Pick a future date so the schedule makes sense.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (!isOnline) {
      toast.error("You’re offline right now. Reconnect and try again.");
      return;
    }
    if (!checkRate()) return;

    setLoading(true);
    try {
      const data = (await callAI("studyplan", { subject, examDate, hours, level, weakAreas })) as StudyPlanResult;
      if (data.daily_plans) {
        setPlan(data);
        setChecked({});
        localStorage.removeItem("studyplan-checked");
        toast.success("Your study plan is ready.");
      } else {
        toast.error("The study plan came back incomplete. Please try again.");
      }
    } catch (e: any) {
      toast.error(e.message || "The study plan could not be created just yet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>

      <Seo
        title="Free AI Study Plan Generator – Personalized Revision | StudyKro"
        description="Free AI study plan generator. Tell us your exam date and topics — get a personalized day-by-day revision schedule built around proven study techniques."
        canonical="https://studykro.com/studyplan"
        keywords={["AI study plan generator","revision schedule","exam study planner","study timetable generator","personalized study plan"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "StudyKro Free AI Study Plan Generator",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description: "Free AI study plan generator. Tell us your exam date and topics — get a personalized day-by-day revision schedule built around proven study techniques.",
          url: "https://studykro.com/studyplan",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1240" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Smart</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Study Plan Generator</h1>
              <p className="text-sm text-muted-foreground">Turn pressure into a schedule that feels possible to follow.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Why this matters: learners often know what matters but not when to do it. A plan reduces decision fatigue, protects energy, and makes progress easier to restart the next day.
          </p>
        </div>

        {!plan ? (
          <div className="field-shell max-w-xl space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">Subject</label>
              <p className="micro-note mt-1">Use the course or exam subject, not just a chapter title.</p>
              <Input
                placeholder="Subject (e.g., Organic Chemistry)"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setErrors((prev) => ({ ...prev, subject: "" }));
                }}
                maxLength={200}
                className={`mt-3 ${errors.subject ? "border-destructive" : ""}`}
              />
              {errors.subject && <p className="mt-2 text-sm text-destructive">{errors.subject}</p>}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-foreground">Exam date</label>
                <p className="micro-note mt-1">The timeline frames each day in the plan.</p>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(e) => {
                    setExamDate(e.target.value);
                    setErrors((prev) => ({ ...prev, examDate: "" }));
                  }}
                  className={`mt-3 ${errors.examDate ? "border-destructive" : ""}`}
                />
                {errors.examDate && <p className="mt-2 text-sm text-destructive">{errors.examDate}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground">Hours each day</label>
                <p className="micro-note mt-1">Be realistic. A usable plan is better than an ambitious one.</p>
                <Select value={hours} onValueChange={setHours}>
                  <SelectTrigger className="mt-3"><SelectValue /></SelectTrigger>
                  <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map((h) => <SelectItem key={h} value={String(h)}>{h} hours</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Current level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="mt-3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Weak areas</label>
              <p className="micro-note mt-1">Optional, but helpful. Mention the concepts that usually slow you down.</p>
              <Textarea placeholder="Weak areas (optional)" value={weakAreas} onChange={(e) => setWeakAreas(e.target.value)} maxLength={2000} className="mt-3 min-h-[120px]" />
              <p className="mt-2 text-sm text-muted-foreground">{weakAreas.length.toLocaleString()} / 2,000 characters</p>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="gradient-bg text-primary-foreground">
              Generate Study Plan
            </Button>
            {loading && <Loader message="Arranging your days into a steadier study rhythm..." />}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="paper-panel flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{plan.total_days} pages in your study trail</p>
                <p className="mt-1 font-display text-lg font-semibold">{plan.overall_strategy}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPlan(null)}>
                New Plan
              </Button>
            </div>
            {plan.warning && (
              <div className="flex items-start gap-3 rounded-[18px] border border-destructive/30 bg-destructive/10 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                <p className="text-sm leading-7">{plan.warning}</p>
              </div>
            )}
            <Accordion type="multiple" className="space-y-3">
              {plan.daily_plans.map((day) => (
                <AccordionItem key={day.day} value={`day-${day.day}`} className="paper-panel px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 text-left">
                      <span className="flex h-9 w-9 items-center justify-center rounded-[12px] gradient-bg text-xs font-bold text-primary-foreground">{day.day}</span>
                      <div>
                        <div className="font-display text-base font-semibold">{day.focus_topic}</div>
                        <div className="text-xs text-muted-foreground">{day.date} • {day.hours}h planned</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="ml-11 space-y-3">
                      {day.tasks.map((task, taskIndex) => {
                        const key = `${day.day}-${taskIndex}`;
                        return (
                          <label key={key} className="flex cursor-pointer items-center gap-3 rounded-[14px] bg-muted/50 px-4 py-3 text-sm">
                            <Checkbox checked={!!checked[key]} onCheckedChange={() => toggleTask(key)} />
                            <span className={checked[key] ? "text-muted-foreground line-through" : ""}>{task}</span>
                          </label>
                        );
                      })}
                      {day.tip && <p className="text-sm italic text-primary">Study cue: {day.tip}</p>}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {plan.resources && plan.resources.length > 0 && (
              <div className="paper-panel p-6">
                <h3 className="mb-3 font-display text-xl font-semibold">Recommended resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {plan.resources.map((resource, index) => (
                    <li key={index} className="rounded-[14px] bg-muted/50 px-4 py-3">
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}
