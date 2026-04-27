import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, ChevronRight, Clock, Tag } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import Seo from "@/components/Seo";
import { blogPosts, getPostBySlug } from "@/data/blogPosts";
import { getBlogImage } from "@/data/blogImages";
import { MarkdownLite } from "@/components/MarkdownLite";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);
  if (!post) return <NotFound />;

  const idx = blogPosts.findIndex((p) => p.slug === slug);
  const next = blogPosts[(idx + 1) % blogPosts.length];
  const prev = blogPosts[(idx - 1 + blogPosts.length) % blogPosts.length];
  const related = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <PageWrapper>
      <Seo
        title={`${post.title} | StudyKro Blog`}
        description={post.description}
        keywords={post.keywords}
        canonical={`https://studykro.com/blog/${post.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: "StudyKro" },
            publisher: {
              "@type": "Organization",
              name: "StudyKro",
              logo: { "@type": "ImageObject", url: "https://studykro.com/icon-512.png" },
            },
            keywords: post.keywords.join(", "),
            mainEntityOfPage: `https://studykro.com/blog/${post.slug}`,
            articleSection: post.category,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://studykro.com/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://studykro.com/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: `https://studykro.com/blog/${post.slug}` },
            ],
          },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 text-foreground">{post.title}</span>
        </nav>

        <Link to="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>

        <header className="mb-10 border-b border-border pb-8">
          <span className="note-label inline-flex items-center gap-1.5">
            <Tag className="h-3 w-3" /> {post.category}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          >
            {post.title}
          </motion.h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formattedDate}</span>
            <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.readTime}</span>
            <span>By <span className="font-semibold text-foreground">StudyKro Team</span></span>
          </div>
        </header>

        <div className="prose-mag">
          <MarkdownLite source={post.content} />
        </div>

        {/* Tags */}
        <div className="mt-12 flex flex-wrap gap-2">
          {post.keywords.map((k) => (
            <span key={k} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              #{k.replace(/\s+/g, "")}
            </span>
          ))}
        </div>

        {/* Author / share box */}
        <div className="mt-10 paper-panel p-6">
          <p className="font-display font-semibold text-foreground">Written by the StudyKro Team</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We build free AI tools for students. Try our <Link to="/summarizer" className="font-semibold text-primary hover:underline">Notes Summarizer</Link>,{" "}
            <Link to="/flashcards" className="font-semibold text-primary hover:underline">Flashcard Generator</Link>, and{" "}
            <Link to="/quiz" className="font-semibold text-primary hover:underline">Quiz Generator</Link> to put these techniques into practice.
          </p>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 font-display text-2xl font-bold">Related articles</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} to={`/blog/${r.slug}`} className="paper-panel block p-5 hover-lift">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{r.category}</span>
                  <p className="mt-2 font-display text-base font-semibold leading-snug line-clamp-3">{r.title}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev/Next */}
        <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          <Link to={`/blog/${prev.slug}`} className="paper-panel block p-5 hover-lift">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">← Previous</span>
            <p className="mt-1 font-display font-semibold text-foreground line-clamp-2">{prev.title}</p>
          </Link>
          <Link to={`/blog/${next.slug}`} className="paper-panel block p-5 text-right hover-lift">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Next →</span>
            <p className="mt-1 font-display font-semibold text-foreground line-clamp-2">{next.title}</p>
          </Link>
        </nav>
      </article>
    </PageWrapper>
  );
}
