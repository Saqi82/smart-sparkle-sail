import { useState } from "react";
import { callAI } from "@/lib/ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import Loader from "@/components/Loader";
import DocumentUploader from "@/components/DocumentUploader";
import { toast } from "sonner";
import { ClipboardList, RotateCcw, BrainCircuit, BookOpenCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import ToolSeoContent from "@/components/ToolSeoContent";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState("5");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();

  const handleGenerate = async () => {
    setError("");
    if (!topic.trim()) {
      setError("Enter a topic so we know what to quiz you on.");
      return;
    }
    if (topic.trim().length < 3) {
      setError("Please use at least 3 characters for the topic.");
      return;
    }
    if (!isOnline) {
      toast.error("You’re offline right now. Reconnect and try again.");
      return;
    }
    if (!checkRate()) return;

    setLoading(true);
    try {
      const data = (await callAI("quiz", { topic, difficulty, count: parseInt(count, 10) })) as { questions: Question[]; quiz_title: string };
      if (data.questions) {
        setQuestions(data.questions);
        setQuizTitle(data.quiz_title || topic);
        setCurrentQ(0);
        setSelected(null);
        setScore(0);
        setFinished(false);
        toast.success("Your quiz is ready.");
      } else {
        toast.error("The quiz came back incomplete. Please try again.");
      }
    } catch (e: any) {
      toast.error(e.message || "The quiz could not be generated just yet.");
    } finally {
      setLoading(false);
    }
  };

  const getCorrectIndex = (question: Question): number => {
    const correctAnswer = question.correct_answer.trim();
    const letterIndex = "ABCD".indexOf(correctAnswer.charAt(0).toUpperCase());
    if (correctAnswer.length <= 2 && letterIndex >= 0) return letterIndex;
    const fullMatch = question.options.findIndex((option) => option === correctAnswer || option.replace(/^[A-D]\)\s*/, "") === correctAnswer);
    if (fullMatch >= 0) return fullMatch;
    return question.options.findIndex((option) => option.charAt(0).toUpperCase() === correctAnswer.charAt(0).toUpperCase());
  };

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const correctIdx = getCorrectIndex(questions[currentQ]);
    if (optionIndex === correctIdx) setScore(score + 1);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const retake = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : pct >= 50 ? "D" : "F";
  const feedback =
    pct >= 90
      ? "Outstanding. You’re answering with real confidence."
      : pct >= 70
        ? "Solid work. A short review pass could lift this even higher."
        : pct >= 50
          ? "You’re partway there. Review the explanations and try another round."
          : "This is a good checkpoint, not a failure. Use the misses to guide your next study block.";
  const currentQuestion = questions[currentQ];

  return (
    <PageWrapper>

      <Seo
        title="Free AI Quiz Generator – Practice Quizzes from Notes | StudyKro"
        description="Free AI quiz generator. Create multiple-choice practice quizzes from your notes or any topic and self-test instantly. Perfect for exam prep."
        canonical="https://studykro.com/quiz"
        keywords={["AI quiz generator","practice quiz maker","MCQ generator","self-test AI","exam prep quiz","free quiz maker"]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "StudyKro Free AI Quiz Generator",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description: "Free AI quiz generator. Create multiple-choice practice quizzes from your notes or any topic and self-test instantly. Perfect for exam prep.",
          url: "https://studykro.com/quiz",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "1240" },
        }}
      />
      <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Smart</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <ClipboardList className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Free AI Quiz Generator</h1>
              <p className="text-sm text-muted-foreground">Practice with feedback that explains the answer instead of just scoring it.</p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Why this matters: answering a question under light pressure reveals weak spots faster than rereading. The explanation panel is there so every miss becomes part of the lesson.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[16px] bg-muted/55 p-4">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <p className="mt-3 font-display font-semibold">Best for</p>
              <p className="micro-note mt-1">Topic checks before exams, self-testing after summaries, and quick revision sprints.</p>
            </div>
            <div className="rounded-[16px] bg-muted/55 p-4">
              <BookOpenCheck className="h-5 w-5 text-accent" />
              <p className="mt-3 font-display font-semibold">Tip</p>
              <p className="micro-note mt-1">Pick fewer questions when you want a fast pulse check. Pick more when you want a deeper review set.</p>
            </div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="field-shell max-w-xl">
            <label className="text-sm font-semibold text-foreground">Choose your quiz setup</label>
            <p className="micro-note mt-1">A specific topic — or uploaded notes — makes the questions sharper and the explanations more useful.</p>
            <div className="mt-4">
              <DocumentUploader
                label="Upload notes to quiz from (optional)"
                disabled={loading}
                onText={(text) => {
                  setTopic(text);
                  setError("");
                }}
              />
            </div>
            <div className="mt-4">
              <Textarea
                placeholder="…or type a topic / paste notes (e.g., Photosynthesis)"
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value);
                  setError("");
                }}
                maxLength={60000}
                className={`min-h-[100px] ${error ? "border-destructive" : ""}`}
              />
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
              <p className="mt-1 text-xs text-muted-foreground">{topic.length.toLocaleString()} / 60,000 characters</p>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Difficulty</p>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Questions</p>
                <Select value={count} onValueChange={setCount}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Questions</SelectItem>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="15">15 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="mt-5 gradient-bg text-primary-foreground">
              Generate Quiz
            </Button>
            {loading && <Loader message="Writing practice questions and explanations..." />}
          </div>
        ) : finished ? (
          <div className="paper-panel py-12 text-center">
            <p className="note-label">Results</p>
            <div className="mt-4 text-6xl font-display font-bold gradient-text">{pct}%</div>
            <div className="mt-3 text-3xl font-display font-bold">Grade: {grade}</div>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{feedback}</p>
            <p className="mt-2 text-sm text-muted-foreground">{score} / {questions.length} concepts unlocked</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={retake} variant="outline">
                <RotateCcw className="mr-1 h-4 w-4" /> Retake
              </Button>
              <Button onClick={() => setQuestions([])} className="gradient-bg text-primary-foreground">
                New Quiz
              </Button>
            </div>
          </div>
        ) : currentQuestion && (
          <div className="space-y-6">
            <div className="paper-panel p-5">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>{score} correct so far</span>
              </div>
              <p className="mt-2 font-display text-lg font-semibold">{quizTitle || "Practice set"}</p>
            </div>
            <div className="paper-panel p-6">
              <h2 className="mb-6 font-display text-xl font-semibold">{currentQuestion.question}</h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const correctIdx = getCorrectIndex(currentQuestion);
                  const isCorrect = index === correctIdx;
                  const isSelected = index === selected;
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(index)}
                      disabled={selected !== null}
                      className={cn(
                        "w-full rounded-[14px] border p-4 text-left text-sm leading-7 transition-all",
                        selected === null && "border-border/20 hover:border-primary/40 hover:bg-primary/5",
                        selected !== null && isCorrect && "border-success/40 bg-success/10",
                        selected !== null && isSelected && !isCorrect && "border-destructive/40 bg-destructive/10",
                        selected !== null && !isCorrect && !isSelected && "opacity-55",
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <div className="mt-4 rounded-[14px] bg-muted px-4 py-4 text-sm leading-7">
                  <span className="font-semibold">Why this answer matters:</span> {currentQuestion.explanation}
                </div>
              )}
            </div>
            {selected !== null && (
              <Button onClick={nextQuestion} className="gradient-bg text-primary-foreground">
                {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              </Button>
            )}
          </div>
        )}
      </section>

      <ToolSeoContent
        toolName="Free AI Quiz Generator"
        whatItDoes="StudyKro's free AI quiz generator turns any topic, paragraph of notes, or uploaded document into a multiple-choice practice quiz with instant feedback. Each question comes with four answer options, the correct answer, and a clear explanation of why it's right — so every miss becomes a mini lesson. You can pick your difficulty (easy, medium, hard) and how many questions you want (5, 10, or 15). It's the fastest way to self-test before an exam, and unlike static question banks, the AI quiz generator creates fresh questions every time."
        howToUse={[
          "Type a topic, paste your notes, or upload a PDF / DOCX of the chapter you want to be quizzed on.",
          "Pick the difficulty and number of questions, then click Generate Quiz.",
          "Answer each question, read the explanation for any miss, and retake to lock in the concepts.",
        ]}
        benefits={[
          { title: "Instant exam prep", body: "Generate practice tests on demand instead of hunting for question banks. Great for midterms, finals, and licensing exams." },
          { title: "Free with no signup", body: "Unlimited quizzes, no account needed. The free AI quiz generator works in your browser." },
          { title: "Explanations on every question", body: "Every answer includes a reasoning blurb so you actually learn the material instead of just guessing." },
        ]}
        faqs={[
          { q: "Is the AI quiz generator free?", a: "Yes — completely free, no signup, no trial, no credit card required." },
          { q: "Can I quiz myself on uploaded notes?", a: "Yes. Upload a PDF, DOCX, PPTX, TXT, or image and the AI will write questions tied to that source material." },
          { q: "How many questions can I generate?", a: "5, 10, or 15 questions per quiz, with no daily limit on how many quizzes you can run." },
          { q: "Does it support different difficulty levels?", a: "Yes. Choose easy for definitions, medium for application, or hard for analysis-style questions." },
          { q: "What subjects work best?", a: "Anything: medicine, law, finance, programming, languages, biology, history, GRE/SAT/MCAT prep, and more." },
        ]}
        related={[
          { to: "/flashcards", label: "AI Flashcard Generator", desc: "Make a study deck on the same topic and reinforce what you missed." },
          { to: "/examtips", label: "AI Exam Tips Generator", desc: "Get predicted questions and a final-stretch revision strategy." },
          { to: "/studyplan", label: "AI Study Plan Generator", desc: "Schedule your quiz practice into a personalized revision timetable." },
        ]}
      />
    </PageWrapper>
  );
}
