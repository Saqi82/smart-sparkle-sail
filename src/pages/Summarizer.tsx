import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import ToolSeoContent from "@/components/ToolSeoContent";
import DocumentUploader from "@/components/DocumentUploader";
import { MarkdownLite } from "@/components/MarkdownLite";
import { toast } from "sonner";
import { GraduationCap, Send, Sparkles, BookOpen, Trash2, User } from "lucide-react";
import { useRateLimit } from "@/hooks/useRateLimit";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tutor`;
const AUTH = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const STARTER_PROMPTS = [
  "Explain the main concept in chapter 1 using an analogy.",
  "Quiz me with 3 multiple-choice questions on this material.",
  "I don't understand this topic — can you ELI5?",
  "Help me build a study plan from these notes.",
];

export default function Tutor() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [docContext, setDocContext] = useState("");
  const [docName, setDocName] = useState<string | null>(null);
  const checkRate = useRateLimit();
  const isOnline = useOnlineStatus();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    if (!isOnline) {
      toast.error("You're offline. Reconnect to continue tutoring.");
      return;
    }
    if (!checkRate()) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput("");
    setIsStreaming(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${AUTH}`,
        },
        body: JSON.stringify({
          messages: nextHistory,
          documentContext: docContext,
          documentName: docName,
        }),
      });

      if (resp.status === 429) {
        toast.error("Rate limit reached. Please wait a moment.");
        setIsStreaming(false);
        return;
      }
      if (resp.status === 402) {
        toast.error("AI credits depleted. Add credits in workspace settings.");
        setIsStreaming(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        toast.error("Tutor is unavailable right now. Try again shortly.");
        setIsStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Streaming failed.");
    } finally {
      setIsStreaming(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Conversation cleared.");
  };

  return (
    <PageWrapper>
      <Seo
        title="Free AI Tutor – Personal Academic Tutor Online No Login | StudyKro"
        description="StudyKro's free AI tutor uses the Socratic method to help you master any subject. Upload PDFs or paste notes for cited, personalized explanations. Quiz mode included. No signup required."
        canonical="https://studykro.com/tutor"
        keywords={[
          "free AI tutor",
          "AI tutor online",
          "AI academic tutor",
          "personal AI tutor free",
          "Socratic AI tutor",
          "study tutor AI",
          "AI tutor no login",
          "AI tutor with my notes",
          "free AI tutor for students",
          "AI tutor that quizzes me",
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "StudyKro Free AI Tutor",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          description:
            "Free AI academic tutor. Upload course material and chat with a Socratic, citation-backed AI tutor that adapts explanations and quizzes you.",
          url: "https://studykro.com/tutor",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "860",
          },
        }}
      />

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="paper-panel px-6 py-7">
          <p className="note-label">Tutor</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[14px] gradient-bg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Free AI Tutor</h1>
              <p className="text-sm text-muted-foreground">
                A patient Socratic tutor that cites your uploaded notes and adapts to how you learn.
              </p>
            </div>
          </div>
          <p className="mt-5 helper-copy">
            Upload your course material so every answer is anchored to your own textbook. Ask
            anything — the tutor will guide you with questions, correct mistakes gently, and quiz
            you when you're ready.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[16px] bg-muted/55 p-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <p className="mt-3 font-display font-semibold">Cited answers</p>
              <p className="micro-note mt-1">
                Every fact from your notes is referenced like (Page X) so you can verify it.
              </p>
            </div>
            <div className="rounded-[16px] bg-muted/55 p-4">
              <Sparkles className="h-5 w-5 text-accent" />
              <p className="mt-3 font-display font-semibold">Adaptive teaching</p>
              <p className="micro-note mt-1">
                Say "I don't get it" and the tutor switches to an ELI5 or real-world example.
              </p>
            </div>
          </div>
        </div>

        <div className="field-shell">
          <label className="text-sm font-semibold text-foreground">
            Upload your course material (optional)
          </label>
          <p className="micro-note mt-1">
            PDFs, lecture slides, or notes. The tutor will cite directly from this source.
          </p>
          <div className="mt-4">
            <DocumentUploader
              label="Upload textbook or notes (PDF, DOCX, PPTX, TXT, image)"
              disabled={isStreaming}
              onText={(text, meta) => {
                setDocContext(text);
                setDocName(meta.fileName);
              }}
            />
          </div>
          {docName && (
            <div className="mt-3 flex items-center justify-between rounded-[12px] bg-primary/5 px-3 py-2 text-sm">
              <span className="truncate text-foreground/80">
                Context loaded: <span className="font-semibold">{docName}</span> (
                {docContext.length.toLocaleString()} chars)
              </span>
              <button
                type="button"
                onClick={() => {
                  setDocContext("");
                  setDocName(null);
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="paper-panel mt-8 flex flex-col overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Tutoring session</span>
            {docName && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Using {docName}
              </span>
            )}
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} disabled={isStreaming}>
              <Trash2 className="mr-1 h-4 w-4" /> Clear
            </Button>
          )}
        </div>

        <div ref={scrollRef} className="max-h-[60vh] min-h-[340px] overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">Start your session</h2>
              <p className="mx-auto mt-2 max-w-md helper-copy">
                Ask a question about your material, or try one of these:
              </p>
              <div className="mx-auto mt-5 grid max-w-2xl gap-2 sm:grid-cols-2">
                {STARTER_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-[12px] border border-border/60 bg-background/60 px-3 py-3 text-left text-sm text-foreground/80 transition hover:border-primary/50 hover:bg-primary/5"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      m.role === "user"
                        ? "bg-muted text-foreground"
                        : "gradient-bg text-primary-foreground"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <GraduationCap className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`min-w-0 flex-1 rounded-[14px] px-4 py-3 text-sm leading-7 ${
                      m.role === "user"
                        ? "bg-muted/55 text-foreground"
                        : "bg-background ring-1 ring-border/60"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <MarkdownLite source={m.content || "..."} />
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isStreaming &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-bg text-primary-foreground">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div className="rounded-[14px] bg-background px-4 py-3 text-sm text-muted-foreground ring-1 ring-border/60">
                      Thinking...
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        <div className="border-t border-border/60 bg-background/70 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              placeholder={
                docName
                  ? "Ask anything about your uploaded material..."
                  : "Ask a question, or upload notes above for cited answers..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              maxLength={4000}
              className="min-h-[60px] flex-1 resize-none"
              disabled={isStreaming}
            />
            <Button
              onClick={() => send(input)}
              disabled={isStreaming || !input.trim()}
              className="gradient-bg text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Press Enter to send · Shift+Enter for a new line · The tutor uses the Socratic method,
            so expect guiding questions before direct answers.
          </p>
        </div>
      </section>

      <ToolSeoContent
        toolName="Free AI Tutor"
        whatItDoes="The StudyKro Free AI Tutor is an intelligent academic assistant that helps students learn faster using the Socratic method. Unlike generic chatbots, it adapts to your course material—upload a PDF, DOCX, PPTX, TXT, or even an image of your notes and every explanation is anchored to your own textbook with page-level citations. It asks guiding questions instead of spoon-feeding answers, corrects misconceptions gently, and can generate custom quizzes on demand to test your understanding."
        howToUse={[
          "Upload your course material (PDF, lecture slides, notes) or skip this step to ask general questions.",
          "Type any question about the topic. The tutor will respond with Socratic questions, analogies, or step-by-step explanations.",
          "Request a quiz by typing 'quiz me' and the AI will generate 3 multiple-choice questions based strictly on your uploaded material.",
          "Review cited answers that reference specific pages or sections so you can verify every fact in your textbook.",
          "Clear the conversation anytime and start a new study session with different material.",
        ]}
        benefits={[
          {
            title: "Socratic teaching method",
            body: "The tutor guides you to the answer through targeted questions, building critical thinking and long-term retention instead of short-term memorization.",
          },
          {
            title: "Document-aware citations",
            body: "Every fact pulled from your uploaded notes includes a citation like (Page 42) so you can instantly verify accuracy against your own material.",
          },
          {
            title: "Adaptive difficulty",
            body: "Say 'I don't get it' and the tutor automatically dials down to ELI5-level analogies. Say 'advanced' and it dives into nuance and edge cases.",
          },
          {
            title: "Built-in quiz generator",
            body: "Switch to quiz mode anytime to generate 3 multiple-choice questions drawn strictly from your uploaded context. Get instant feedback and detailed explanations.",
          },
          {
            title: "No login required",
            body: "Start tutoring immediately without creating an account. Your session is private and no personal data is stored.",
          },
          {
            title: "Works on any device",
            body: "Responsive design means you can study on your phone during a commute or on a laptop at your desk with the same seamless experience.",
          },
        ]}
        faqs={[
          {
            q: "Is the StudyKro AI tutor really free?",
            a: "Yes. The AI tutor is completely free to use with no credit card or signup required. We fund the service through premium features and partnerships so students everywhere can access high-quality academic help.",
          },
          {
            q: "What file types can I upload for the tutor to reference?",
            a: "You can upload PDF, DOCX, PPTX, TXT, and even images (JPG, PNG). The tutor extracts the text and uses it as grounded context, citing page numbers or sections whenever it references your material.",
          },
          {
            q: "How does the Socratic method work in practice?",
            a: "Instead of giving you the answer immediately, the tutor asks 1-2 guiding questions that nudge you toward the correct reasoning. This builds deeper understanding and better exam recall than passive reading.",
          },
          {
            q: "Can I use the tutor without uploading any documents?",
            a: "Absolutely. You can ask general academic questions on any subject. Uploading documents simply makes the answers more personalized and citation-backed.",
          },
          {
            q: "Is my uploaded material kept private?",
            a: "Yes. Your documents are processed in real time and are not stored permanently on our servers. Each session is independent and no personal data is retained after you close the page.",
          },
        ]}
        related={[
          {
            to: "/ai-flashcard-generator",
            label: "AI Flashcard Generator",
            desc: "Turn your notes into smart flashcards with spaced-repetition scheduling.",
          },
          {
            to: "/quiz",
            label: "AI Quiz Maker",
            desc: "Generate full quizzes with explanations from any topic or uploaded text.",
          },
          {
            to: "/studyplan",
            label: "Study Plan Generator",
            desc: "Build a personalized day-by-day study schedule for your next exam.",
          },
          {
            to: "/explainer",
            label: "AI Explainer",
            desc: "Get complex topics broken down into simple, visual explanations.",
          },
          {
            to: "/flashcards",
            label: "Flashcards",
            desc: "Browse and study pre-made flashcard decks on popular subjects.",
          },
          {
            to: "/mnemonics",
            label: "Mnemonic Generator",
            desc: "Create memory aids and acronyms to memorize facts faster.",
          },
        ]}
      />
    </PageWrapper>
  );
}
