import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { blogPosts } from "@/data/blogPosts";
import { useSeo } from "@/lib/seo";

export default function Blog() {
  useSeo({
    title: "StudyKro Blog – Study Techniques, Exam Prep & AI Study Tips",
    description:
      "Evidence-based articles on active recall, spaced repetition, exam prep, AI flashcards, and study techniques that help students remember more and stress less.",
    keywords: [
      "study techniques",
      "exam prep",
      "AI study tools",
      "active recall",
      "spaced repetition",
      "student blog",
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "StudyKro Blog",
      url: "https://studykro.com/blog",
      blogPost: blogPosts.map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `https://studykro.com/blog/${p.slug}`,
        datePublished: p.date,
        keywords: p.keywords.join(", "),
      })),
    },
  });

  return (
    <PageWrapper>
      <div className="container max-w-6xl px-4 py-12 sm:py-16">
        <header className="mb-12 text-center">
          <p className="note-label mb-4 inline-flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5" /> StudyKro blog
          </p>
          <h1 className="gradient-text mx-auto max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Study smarter, not longer
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Evidence-based study techniques, exam prep guides, and tips for getting the most out of AI study tools.
          </p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, idx) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="paper-panel group flex flex-col p-6 transition-all hover:-translate-y-1 hover:card-shadow"
            >
              <span className="note-label mb-3 self-start rounded-full bg-primary/10 px-3 py-1 text-primary">
                {post.category}
              </span>
              <h2 className="mb-3 font-display text-xl font-bold leading-snug text-foreground group-hover:text-primary">
                <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0">
                  {post.title}
                </Link>
              </h2>
              <p className="mb-5 line-clamp-3 flex-1 text-sm text-muted-foreground">{post.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {post.readTime}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  Read <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
