import { useMemo } from "react";
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const tips = [
  "Break big topics into one concept at a time. It keeps confidence high and fatigue low.",
  "Say the idea out loud after you read it. Retrieval beats rereading almost every time.",
  "A five-minute reset can save a twenty-minute spiral.",
  "If a lesson feels slippery, write one example in your own words before moving on.",
  "Spacing your review is kinder to your brain than a last-minute cram.",
];

export default function Loader({ message = "AI is thinking..." }: { message?: string }) {
  const tip = useMemo(() => tips[Math.floor(Math.random() * tips.length)], []);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
        <div className="rounded-[14px] border border-border/20 bg-card/90 p-4 soft-shadow">
          <Brain className="h-10 w-10 text-primary" />
        </div>
      </motion.div>
      <p className="font-display text-lg font-semibold">{message}</p>
      <p className="max-w-md text-center text-sm text-muted-foreground">Why this wait helps: the app is shaping your material into something easier to review later.</p>
      <p className="max-w-sm text-center text-sm italic text-muted-foreground">{tip}</p>
    </div>
  );
}
