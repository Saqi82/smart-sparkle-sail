import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, LucideIcon } from "lucide-react";
import PageWrapper from "./PageWrapper";
import Seo from "./Seo";

type FaqItem = { q: string; a: string };

type Props = {
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords?: string[];
  canonical?: string;

  // Visual hero
  category: string; // e.g. "AI Study Tool"
  title: string;
  intro: string;
  icon: LucideIcon;

  // Page body
  children: ReactNode;

  // Long-form SEO content sections
  whyMatters?: { title: string; body: string }[];
  howItWorks?: string[];
  faqs?: FaqItem[];
  related?: { to: string; label: string; desc: string }[];

  // Schema.org type — defaults to SoftwareApplication
  schemaType?: "SoftwareApplication" | "WebApplication" | "Article";
};

export default function ToolPageLayout({
  seoTitle,
  seoDescription,
  seoKeywords,
  canonical,
  category,
  title,
  intro,
  icon: Icon,
  children,
  whyMatters,
  howItWorks,
  faqs,
  related,
  schemaType = "SoftwareApplication",
}: Props) {
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: title,
      description: seoDescription,
      applicationCategory: "EducationApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      url: canonical,
    },
  ];

  if (faqs?.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <PageWrapper>
      <Seo
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonical={canonical}
        jsonLd={jsonLd}
      />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/" className="hover:text-foreground">Tools</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{title}</span>
      </nav>

      {/* Hero */}
      <header className="mb-8 sm:mb-10">
        <span className="note-label">{category}</span>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl gradient-bg text-primary-foreground sm:h-14 sm:w-14">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl break-words">{title}</h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">{intro}</p>
          </div>
        </div>
      </header>

      {/* Tool itself */}
      <section className="mb-16">{children}</section>

      {/* Why it matters */}
      {whyMatters?.length ? (
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Why use {title}?</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyMatters.map((b) => (
              <div key={b.title} className="paper-panel p-6">
                <h3 className="mb-2 font-display text-lg font-semibold">{b.title}</h3>
                <p className="text-sm leading-7 text-muted-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* How it works */}
      {howItWorks?.length ? (
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold sm:text-3xl">How it works</h2>
          <ol className="grid gap-4 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <li key={i} className="paper-panel p-6">
                <span className="text-sm font-semibold text-primary">Step {i + 1}</span>
                <p className="mt-2 leading-7 text-foreground/90">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {/* FAQ */}
      {faqs?.length ? (
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Frequently asked questions</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="paper-panel group p-5 [&[open]>summary>svg]:rotate-90">
                <summary className="flex cursor-pointer items-start justify-between gap-4 font-display text-base font-semibold text-foreground">
                  {f.q}
                  <ChevronRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform" />
                </summary>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {/* Related tools */}
      {related?.length ? (
        <section className="mb-16">
          <h2 className="mb-6 font-display text-2xl font-bold sm:text-3xl">Related study tools</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.to}
                to={r.to}
                className="paper-panel group block p-5 hover-lift"
              >
                <p className="font-display text-base font-semibold text-foreground group-hover:text-primary">{r.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Open tool <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </PageWrapper>
  );
}
