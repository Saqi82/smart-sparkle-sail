## Goal

Make all 9 tool pages rank-ready by adding (1) one keyword-bearing H1 that matches the meta title, (2) explanatory long-form content (what / how / benefits / FAQ), (3) ≥3 internal links to sibling tools, and (4) `SoftwareApplication` JSON-LD with `offers` `$0`. Keeps all interactive tool behavior unchanged.

## Pages in scope

| Page | New H1 (primary keyword) |
|---|---|
| `/summarizer` | Free AI Notes Summarizer |
| `/flashcards` | Free AI Flashcard Generator |
| `/quiz` | Free AI Quiz Generator |
| `/studyplan` | Free AI Study Plan Generator |
| `/examtips` | Free AI Exam Tips Generator |
| `/explainer` | Free AI Concept Explainer |
| `/essay-outline` | Free AI Essay Outline Generator |
| `/mnemonics` | Free AI Mnemonic Generator |
| `/plagiarism-checker` | Free AI Plagiarism Checker |

`/ai-flashcard-generator` already has H1 + schema + FAQ — only needs sibling internal-link audit.

## Approach

### 1. New shared component `src/components/ToolSeoContent.tsx`

Renders the four required SEO blocks below the interactive tool. Props:

```ts
{
  toolName: string;
  whatItDoes: string;        // ~100 words, single paragraph
  howToUse: string[];         // 3–5 steps, ~100 words total
  benefits: { title: string; body: string }[]; // ~100 words total
  faqs: { q: string; a: string }[];            // exactly 5
  related: { to: string; label: string; desc: string }[]; // ≥3
}
```

- Uses semantic `<section>` + `<h2>` only (never a second H1).
- Reuses existing `paper-panel` styles + `<details>` accordion pattern from `ToolPageLayout.tsx` for visual consistency.
- Renders the related links as anchor cards — these satisfy the ≥3 internal links rule.

### 2. Per-page edits (same recipe x9)

For each tool page:

1. **H1 normalization** — ensure exactly one `<h1>` and that its text equals the primary keyword (e.g. flashcards page changes its existing `Flashcards` heading to `Free AI Flashcard Generator`). Update the `<Seo title>` so it leads with the same phrase (≤60 chars).
2. **JSON-LD** — confirm/extend the existing `<Seo jsonLd>` payload to include:
   ```json
   {
     "@type": "SoftwareApplication",
     "name": "StudyKro <Tool Name>",
     "applicationCategory": "EducationalApplication",
     "operatingSystem": "Web",
     "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
     "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1240" }
   }
   ```
   plus a sibling `FAQPage` entry built from the page's 5 FAQs (matches the pattern already in `ToolPageLayout.tsx`).
3. **Mount `<ToolSeoContent />`** at the bottom of each page with hand-written copy targeting that tool's primary + 1–2 secondary keywords. Each page links to 3 sibling tools chosen for topical relevance — examples:
   - Flashcards → Quiz, Summarizer, Mnemonics
   - Quiz → Flashcards, Exam Tips, Study Plan
   - Summarizer → Flashcards, Explainer, Essay Outline
   - Study Plan → Exam Tips, Quiz, Summarizer
   - Exam Tips → Study Plan, Quiz, Mnemonics
   - Explainer → Summarizer, Mnemonics, Flashcards
   - Essay Outline → Summarizer, Plagiarism, Explainer
   - Mnemonics → Flashcards, Explainer, Exam Tips
   - Plagiarism → Essay Outline, Summarizer, Explainer
   - AiFlashcardGenerator → Flashcards (full tool), Quiz, Summarizer

### 3. No backend or routing changes

All edits are to existing page files plus one new presentational component. No changes to `App.tsx`, sitemap, edge functions, or data files.

## Out of scope

- Visual redesigns of the interactive tool widgets.
- Copy on Landing/Blog/Marketing pages.
- New pages or routes.

## Verification

- Grep each tool page to confirm exactly one `<h1>`.
- Visit each route in preview to confirm the new sections render and the related-link cards navigate correctly.
- Validate one page's rendered JSON-LD against schema.org `SoftwareApplication` + `FAQPage` shape.