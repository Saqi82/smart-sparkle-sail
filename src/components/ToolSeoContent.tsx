import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type Faq = { q: string; a: string };
type Related = { to: string; label: string; desc: string };
type Benefit = { title: string; body: string };

type Props = {
  toolName: string;
  whatItDoes: string;
  howToUse: string[];
  benefits: Benefit[];
  faqs: Faq[]; // 5
  related: Related[]; // >=3
};

/**
 * Long-form SEO content block rendered below an interactive tool.
 * Adds: What it does / How to use / Benefits / FAQ / Related internal links.
 * Also injects a FAQPage JSON-LD script for rich results.
 */
export default function ToolSeoContent({
  toolName,
  whatItDoes,
  howToUse,
  benefits,
  faqs,
  related,
}: Props) {
  useEffect(() => {
    if (!faqs?.length) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.dynamic = "true";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [faqs]);

  return (
    <div className="mt-16 space-y-14">
      <section aria-labelledby="what-it-does">
        <h2 id="what-it-does" className="font-display text-2xl font-bold sm:text-3xl">
          What is the {toolName}?
        </h2>
        <p className="mt-4 max-w-3xl helper-copy leading-7">{whatItDoes}</p>
      </section>

      <section aria-labelledby="how-to-use">
        <h2 id="how-to-use" className="font-display text-2xl font-bold sm:text-3xl">
          How to use the {toolName}
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {howToUse.map((step, i) => (
            <li key={i} className="paper-panel p-5">
              <span className="text-sm font-semibold text-primary">Step {i + 1}</span>
              <p className="mt-2 text-sm leading-7 text-foreground/90">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="benefits">
        <h2 id="benefits" className="font-display text-2xl font-bold sm:text-3xl">
          Benefits &amp; features
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="paper-panel p-5">
              <h3 className="font-display text-lg font-semibold">{b.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl font-bold sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="paper-panel group p-5 [&[open]>summary>svg]:rotate-90"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-4 font-display text-base font-semibold text-foreground">
                {f.q}
                <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform" />
              </summary>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section aria-labelledby="related">
        <h2 id="related" className="font-display text-2xl font-bold sm:text-3xl">
          Related free AI study tools
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {related.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="paper-panel group block p-5 hover-lift"
            >
              <p className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                {r.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Open tool <ChevronRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
