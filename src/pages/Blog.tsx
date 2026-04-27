import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock, Search } from "lucide-react";
import { useMemo, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/data/blogPosts";
import { getBlogImage } from "@/data/blogImages";

export default function Blog() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const set = new Set(blogPosts.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    return blogPosts.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      const q = query.trim().toLowerCase();
      const matchesQ =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q));
      return matchesCat && matchesQ;
    });
  }, [query, activeCategory]);

  const [featured, ...rest] = blogPosts;

  return (
    <PageWrapper>
      <Seo
        title="Study Blog – Evidence-Based Study Techniques & Exam Prep | StudyKro"
        description="Free study guides, exam-prep tips, and AI study-tool tutorials. Active recall, spaced repetition, the Feynman technique, memory palaces and more."
        keywords={[
          "study techniques", "exam prep", "study tips", "active recall", "spaced repetition",
          "Feynman technique", "memory palace", "study skills", "AI study tools",
        ]}
        canonical="https://studykro.com/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "StudyKro Blog",
          url: "https://studykro.com/blog",
          description: "Evidence-based study techniques, exam prep guides and AI study-tool tutorials.",
          blogPost: blogPosts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `https://studykro.com/blog/${p.slug}`,
            datePublished: p.date,
            keywords: p.keywords.join(", "),
            description: p.description,
            image: `https://studykro.com${getBlogImage(p.slug).src}`,
          })),
        }}
      />

      <header className="mb-10 text-center">
        <span className="note-label inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" /> StudyKro Blog
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold sm:text-5xl">
          Study smarter, not longer
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Evidence-based study techniques, exam-prep guides, and tips for getting the most out of AI study tools.
        </p>
      </header>

      {/* Featured */}
      {!query && activeCategory === "All" && (
        <section className="mb-12">
          <Link
            to={`/blog/${featured.slug}`}
            className="paper-panel group block overflow-hidden hover-lift md:grid md:grid-cols-2"
          >
            <img
              src={getBlogImage(featured.slug).src}
              alt={getBlogImage(featured.slug).alt}
              width={1280}
              height={720}
              loading="eager"
              fetchPriority="high"
              className="aspect-[16/9] h-full w-full object-cover md:aspect-auto"
            />
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <span className="note-label self-start">Featured · {featured.category}</span>
              <h2 className="mt-4 font-display text-2xl font-bold leading-tight group-hover:text-primary sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-muted-foreground">{featured.description}</p>
              <div className="mt-5 flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" /> {featured.readTime}
                <span>·</span>
                <span>{new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Search + filters */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(query || activeCategory !== "All" ? filtered : rest).map((post, idx) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.03 }}
            className="paper-panel group flex flex-col overflow-hidden hover-lift"
          >
            <div className="aspect-[16/9] gradient-hero" />
            <div className="flex flex-1 flex-col p-5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                {post.category}
              </span>
              <h2 className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-primary">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.description}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-1 font-semibold text-primary">
                  Read <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (query || activeCategory !== "All") && (
        <p className="mt-12 text-center text-muted-foreground">No articles match your search.</p>
      )}
    </PageWrapper>
  );
}
