export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  readTime: string;
  date: string;
  content: string; // markdown-lite, rendered with simple parser
};

export const blogPosts: BlogPost[] = [
  {
    slug: "active-recall-vs-passive-reading",
    title: "Active Recall vs Passive Reading: The Study Technique That Actually Works",
    description:
      "Active recall beats re-reading every time. Learn how to use AI flashcards and self-testing to remember more in half the study time.",
    keywords: ["active recall", "study techniques", "AI flashcards", "memory retention"],
    category: "Study Techniques",
    readTime: "6 min read",
    date: "2025-01-08",
    content: `
## Why re-reading feels productive but isn't

You highlight a textbook, re-read your notes, and feel like you "studied." But cognitive research is brutally clear: passive review is one of the **least effective** ways to learn. Every meta-analysis on study habits ranks **active recall** at the top.

## What is active recall?

Active recall means **retrieving** information from memory instead of staring at it. Closing the book, asking yourself a question, and answering it — that single act strengthens neural pathways more than reading the same page five times.

## How to do active recall in 4 steps

1. **Read** a chapter once.
2. **Close the book.**
3. **Write down** everything you remember.
4. **Compare** and fix the gaps.

That's it. The struggle to retrieve is the workout.

## Where AI study tools fit in

Manually building flashcards for every chapter takes hours. With **StudyKro's AI flashcard generator**, you upload your notes and get ready-to-test cards in seconds — so you can spend your time *recalling*, not *formatting*.

Pair active recall with **spaced repetition** (covered in another post) and you'll outperform classmates who study twice as long.

## TL;DR
- Re-reading = comfortable, ineffective.
- Active recall = harder, dramatically more effective.
- Use AI to skip the prep work and start testing yourself today.
`,
  },
  {
    slug: "spaced-repetition-explained",
    title: "Spaced Repetition Explained: The Science of Remembering Anything",
    description:
      "Spaced repetition is the secret behind med students, polyglots, and elite test-takers. Here's how to use it with AI-generated flashcards.",
    keywords: ["spaced repetition", "memory", "flashcards", "study method"],
    category: "Study Techniques",
    readTime: "7 min read",
    date: "2025-01-12",
    content: `
## The forgetting curve

In 1885, Hermann Ebbinghaus discovered that we forget about **70% of new information within 24 hours**. The fix? Review the material right before you'd forget it. That's spaced repetition.

## How the intervals work

A simple schedule:

- Day 1 — learn it
- Day 2 — review
- Day 4 — review
- Day 8 — review
- Day 16 — review
- Day 30+ — long-term memory

Each successful recall pushes the next review further out.

## Why it pairs perfectly with AI flashcards

Building 200 flashcards per subject by hand is a non-starter. With an **AI flashcard generator** you can convert a 40-page PDF into a deck in under a minute, then run them through any spaced repetition app.

## A realistic weekly plan

- **Mon/Wed/Fri:** new material → generate flashcards.
- **Tue/Thu:** review old decks.
- **Sat:** mixed quiz with the **AI quiz generator** to simulate a test.
- **Sun:** rest. Sleep consolidates memory.

## The bottom line

Spaced repetition isn't a hack — it's how your brain wants to learn. Combine it with AI tools and you'll cut study time while remembering more.
`,
  },
  {
    slug: "how-to-summarize-notes-with-ai",
    title: "How to Summarize Notes with AI (Without Losing the Important Parts)",
    description:
      "A step-by-step guide to using an AI notes summarizer for textbooks, lectures, and PDFs — with prompts that keep key concepts intact.",
    keywords: ["AI notes summarizer", "summarize notes", "study guide generator", "PDF summary"],
    category: "AI Study Tools",
    readTime: "5 min read",
    date: "2025-01-15",
    content: `
## Why most AI summaries are shallow

Generic chatbots compress text by deleting things. For studying, you need a summary that **preserves definitions, formulas, and named concepts** — not one that turns chemistry into a TED talk.

## The 3-layer summary method

When you use **StudyKro's AI notes summarizer**, you get three layers:

1. **Short summary** — the chapter in 3 sentences.
2. **Key points** — 5–7 bullet points you'd write on an exam cheat sheet.
3. **Definitions & formulas** — preserved verbatim.

That structure mirrors how examiners actually test you.

## Step-by-step

1. Paste your notes or upload a PDF.
2. Pick the depth (short / detailed).
3. Skim the short summary first.
4. Drill into key points.
5. Convert definitions into flashcards (one click).

## Pro tip: layer with active recall

Don't *read* the summary. **Cover it** and explain each key point out loud. The summary is a checklist, not a substitute for thinking.
`,
  },
  {
    slug: "exam-prep-checklist-30-days",
    title: "The 30-Day Exam Prep Checklist (Backed by Research)",
    description:
      "A day-by-day exam prep checklist combining study plans, AI flashcards, and practice quizzes. Stop cramming, start scoring.",
    keywords: ["exam prep", "study plan", "30 day plan", "exam tips"],
    category: "Exam Prep",
    readTime: "8 min read",
    date: "2025-01-18",
    content: `
## The cramming trap

Pulling an all-nighter spikes cortisol, tanks recall, and ruins the next morning. The data is unambiguous: **distributed practice beats cramming by 1–2 letter grades** on average.

## Week 1 — Map the territory

- Day 1: List every topic.
- Day 2: Use the **AI study plan generator** to schedule them.
- Day 3–5: Summarize each chapter with AI.
- Day 6–7: Convert summaries into flashcards.

## Week 2 — Active recall sprint

Daily: 20 minutes of flashcard recall + 1 mini quiz.

## Week 3 — Practice tests

- Generate full quizzes per chapter.
- Track which topics you bomb.
- Re-summarize weak areas.

## Week 4 — Polish

- Day 22–25: Mixed practice tests.
- Day 26–28: Past papers.
- Day 29: Light review only.
- Day 30: **Sleep 8 hours.** Walk in calm.

## Tools that automate the boring parts

- **StudyKro Summarizer** — turn chapters into outlines.
- **StudyKro Flashcards** — instant decks.
- **StudyKro Quiz** — chapter-by-chapter mock exams.
- **StudyKro Study Plan** — your 30-day schedule, generated.
`,
  },
  {
    slug: "pomodoro-technique-students",
    title: "The Pomodoro Technique for Students: Beat Procrastination in 25-Minute Sprints",
    description:
      "How to use the Pomodoro Technique with AI study tools to stay focused, dodge burnout, and finish assignments on time.",
    keywords: ["pomodoro technique", "focus", "productivity", "study habits"],
    category: "Productivity",
    readTime: "5 min read",
    date: "2025-01-22",
    content: `
## What is the Pomodoro Technique?

Invented by Francesco Cirillo in the late 80s, the rule is simple:

- **25 minutes** of pure focus.
- **5 minutes** of rest.
- After 4 rounds, take a **15–30 minute** break.

That's one Pomodoro.

## Why 25 minutes works

It's short enough to start (you can do *anything* for 25 minutes) and long enough to enter flow. The strict break prevents the dreaded "I'll just check Instagram" spiral.

## Mapping Pomodoros to AI tools

| Pomodoro | Task |
|---|---|
| 1 | Read chapter |
| 2 | AI summarize + clean notes |
| 3 | Generate flashcards |
| 4 | Active recall round |

Four Pomodoros = one chapter mastered, in under 2 hours.

## Apps to try

A simple kitchen timer works. So does any free Pomodoro app. The real magic comes from pairing it with **StudyKro** so each block has a clear, finishable task.
`,
  },
  {
    slug: "ai-flashcards-vs-quizlet",
    title: "AI Flashcards vs Manual Decks: Which Helps You Remember More?",
    description:
      "AI-generated flashcards save hours, but are they as effective as decks you build by hand? Here's what the evidence (and 200 students) say.",
    keywords: ["AI flashcards", "flashcard generator", "Quizlet alternative", "study apps"],
    category: "AI Study Tools",
    readTime: "6 min read",
    date: "2025-01-26",
    content: `
## The classic argument

"Building flashcards is *part of* learning." That used to be true — the act of phrasing a question forces understanding.

## What changed

Modern **AI flashcard generators** don't just summarize text. They:

- Identify key terms.
- Generate cloze deletions.
- Create variant questions for the same concept.
- Highlight definitions you'd otherwise miss.

In other words, they do the *boring* part (typing) while leaving you the *valuable* part (recalling).

## A fair comparison

| Factor | Manual deck | AI deck |
|---|---|---|
| Time to build | 2–4 hours per chapter | 60 seconds |
| Coverage | Limited by stamina | Comprehensive |
| Variety | Same wording each time | Multiple phrasings |
| Editing | Painful | One click |

## Recommended workflow

1. Generate AI flashcards from your notes.
2. **Edit** any card that feels off — that 60-second edit is itself a learning moment.
3. Test daily with active recall.

That's the best of both worlds.
`,
  },
  {
    slug: "best-note-taking-methods",
    title: "5 Note-Taking Methods That Actually Help You Learn (Cornell, Mapping, and More)",
    description:
      "Compare Cornell notes, mind mapping, the outline method, and more — then turn any of them into AI-powered flashcards in seconds.",
    keywords: ["note taking", "Cornell notes", "mind mapping", "study skills"],
    category: "Study Techniques",
    readTime: "7 min read",
    date: "2025-01-30",
    content: `
## 1. Cornell Method

Split the page into cues, notes, and a summary box. Forces you to summarize after class — half the work of revision is done.

## 2. Outline Method

Hierarchical bullets. Best for structured subjects: history, biology, law.

## 3. Mind Mapping

A central concept with branching ideas. Excellent for brainstorming and seeing relationships. Poor for definition-heavy material.

## 4. Charting Method

A table per topic. Perfect for compare/contrast (e.g., empires, pathologies, frameworks).

## 5. Sentence Method

Just write fast. Best for unpredictable lectures. Cleanup happens later — ideally with an **AI notes summarizer**.

## The unifying tip

Whatever method you use, **convert your notes into recall practice within 24 hours.** That's where StudyKro's flashcard and quiz generators carry the load.
`,
  },
  {
    slug: "how-to-create-study-plan",
    title: "How to Build a Study Plan You'll Actually Stick To",
    description:
      "A practical guide to building a personalized study plan using AI — with realistic schedules, breaks, and progress tracking.",
    keywords: ["study plan", "AI study planner", "study schedule", "time management"],
    category: "Productivity",
    readTime: "6 min read",
    date: "2025-02-03",
    content: `
## Why most plans fail

They're too ambitious, too rigid, and ignore real life. A perfect spreadsheet that you abandon on day 3 is worse than a sloppy plan you follow for a month.

## The 3 inputs of a great plan

1. **Deadline** — when's the exam?
2. **Topics** — list everything you must cover.
3. **Hours/day** — be honest. 2 sustainable hours beat 6 fantasy hours.

## Generate it in 30 seconds

The **StudyKro Study Plan generator** takes those three inputs and produces a day-by-day schedule with built-in review days. No spreadsheet needed.

## Stickiness rules

- **Same time, same place** — habit > willpower.
- **Two-day rule** — never miss two days in a row.
- **Weekly review** — adjust the plan, don't abandon it.

## What to do when you fall behind

You will. Don't restart from scratch — **redistribute** the missed topics across the next week. The AI planner can regenerate in one click.
`,
  },
  {
    slug: "best-foods-for-studying",
    title: "Brain Foods for Students: What to Eat Before an Exam",
    description:
      "Boost focus and memory naturally. The best foods, drinks, and habits for peak academic performance — backed by nutrition science.",
    keywords: ["brain foods", "study nutrition", "exam day", "student health"],
    category: "Wellness",
    readTime: "5 min read",
    date: "2025-02-07",
    content: `
## What to eat the day before

- **Complex carbs**: oats, brown rice, whole-grain pasta — slow-release energy.
- **Lean protein**: eggs, fish, chicken, tofu — sustained focus.
- **Omega-3s**: salmon, walnuts, flaxseed — long-term memory.
- **Berries**: antioxidants linked to cognition.

## Exam morning

A balanced breakfast with protein + complex carbs + a little fat. Skip pastries and sugary cereals — the crash hits exactly when you need to focus.

## Hydration

Even **2% dehydration** measurably reduces concentration. Bring a water bottle to every study session.

## Caffeine: friend or foe?

A cup of coffee 30–45 min before studying can sharpen focus. **Three cups** mostly gives you anxiety. Know your dose.

## What to avoid

Heavy meals, energy drinks back-to-back, alcohol the night before. None of these are a hack — they're just leaks in your performance.
`,
  },
  {
    slug: "dealing-with-exam-stress",
    title: "How to Deal With Exam Stress: 7 Techniques That Actually Work",
    description:
      "Practical, science-backed ways to manage exam anxiety — from breathing exercises to AI-generated practice tests.",
    keywords: ["exam stress", "test anxiety", "mental health", "exam tips"],
    category: "Wellness",
    readTime: "6 min read",
    date: "2025-02-12",
    content: `
## Stress isn't the enemy — panic is

A little arousal sharpens performance. Full-blown panic shuts down recall. The goal isn't *zero* stress; it's **managed** stress.

## 1. Box breathing

4 seconds in, 4 hold, 4 out, 4 hold. Three rounds drops your heart rate fast.

## 2. Practice tests under exam conditions

Anxiety is largely fear of the unknown. Use the **AI quiz generator** to simulate a real test — same length, same timer, no notes.

## 3. The 5-4-3-2-1 grounding trick

5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. Pulls you out of a spiral.

## 4. Sleep is non-negotiable

A 6-hour sleeper underperforms an 8-hour sleeper by roughly a full grade band.

## 5. Reframe the story

"This is panic" → "This is energy I can use."

## 6. Move your body

A 10-minute walk before the exam beats 10 more minutes of cramming.

## 7. Have a plan B

Know what you'll do if you blank. (Skip → return → easiest first.) A plan kills the spiral before it starts.

## When to ask for help

If anxiety stops you from showing up or sleeping, talk to a counselor. That's strength, not weakness.
`,
  },
  {
    slug: "feynman-technique-step-by-step",
    title: "The Feynman Technique: Learn Anything by Teaching It Back",
    description:
      "The Feynman technique turns confusion into clarity in 4 steps. Learn how to use it with an AI concept explainer to master tough topics fast.",
    keywords: ["Feynman technique", "learning method", "concept explainer", "study smarter"],
    category: "Study Techniques",
    readTime: "6 min read",
    date: "2025-02-04",
    content: `
## Why the Feynman technique works

Nobel-winning physicist Richard Feynman had a simple rule: **if you can't explain it simply, you don't understand it.** That single idea is one of the most powerful learning tools ever created.

## The 4 steps

1. **Pick a concept.** Write its name at the top of a blank page.
2. **Explain it like you're teaching a 12-year-old.** No jargon allowed.
3. **Find the gaps.** The places where you stumble are the parts you don't actually know.
4. **Go back to the source**, fix the gap, and try again.

## Why it beats highlighting

Highlighting is recognition. Teaching is **production**. Production forces your brain to organize, connect, and translate — three things passive review never does.

## Use AI to speed up step 3

The hard part is spotting your own gaps. Drop the concept into **StudyKro's Concept Explainer** and compare its ELI5, analogy, and detailed version against your own. The mismatches are your study targets.

## Common mistakes

- **Copy-pasting the textbook definition.** That's recognition, not understanding.
- **Skipping the "explain to a kid" step.** The simplification is the whole point.
- **Stopping at one pass.** Real mastery shows up on the second or third loop.

## TL;DR

Teach it. Find the holes. Patch them. Repeat. That's the entire method — and it works on anything from calculus to constitutional law.
`,
  },
  {
    slug: "memory-palace-method-for-students",
    title: "The Memory Palace Method: Remember Lists, Dates, and Vocab With Ease",
    description:
      "The memory palace (method of loci) is a 2,000-year-old trick used by world memory champions. Here's how students can use it for exams.",
    keywords: ["memory palace", "method of loci", "mnemonics", "memory techniques", "exam prep"],
    category: "Memory & Recall",
    readTime: "7 min read",
    date: "2025-02-11",
    content: `
## What is a memory palace?

A memory palace is a mental walk through a familiar place — your bedroom, your school hallway, your route to class — where you "place" the things you need to remember at specific spots.

Greek orators used it to deliver hour-long speeches without notes. Modern memory champions use it to memorize the order of multiple shuffled decks of cards. **It works because your brain is wired for spatial memory.**

## Build your first palace in 4 steps

1. **Pick a place you know cold** — the more familiar, the better.
2. **Pick a route through it.** Front door → hallway → kitchen → couch → bedroom. Always the same order.
3. **Convert each item to a vivid image.** Boring images don't stick. Weird, funny, or gross ones do.
4. **Place each image at one stop on the route.** To recall, walk the palace in your head.

## Example: the planets

Walking through your kitchen:

- **Fridge** — a giant thermometer (Mercury)
- **Sink** — Venus de Milo washing dishes
- **Stove** — Earth on a frying pan
- **Microwave** — a Mars bar melting inside
- **Toaster** — Jupiter-sized, popping out a red spot

You'll remember it tomorrow. And next month.

## Where AI fits in

Coming up with vivid imagery is the hard part. **StudyKro's Mnemonic Generator** spits out acronyms, stories, and memory palace walkthroughs for any list — so you can spend your time *placing* and *recalling*, not brainstorming.

## What it's best for

- Ordered lists (cranial nerves, presidents, taxonomies)
- Vocabulary in a new language
- Speech outlines and presentation points
- Multi-step procedures (chemistry, anatomy)

## TL;DR

Pick a place. Walk a route. Place weird images. Recall by walking the route again. It feels silly. It works absurdly well.
`,
  },
];

export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
