import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { blogPosts, getPostBySlug } from "@/data/blogPosts";
import { useSeo } from "@/lib/seo";
import { MarkdownLite } from "@/components/MarkdownLite";
import NotFound from "./NotFound";

export default function BlogPost() {
  const { slug = "" } = useParams();
  const post = getPostBySlug(slug);

  if (!post) return <NotFound />;

  const idx = blogPosts.findIndex((p) => p.slug === slug);
  const next = blogPosts[(idx + 1) % blogPosts.length];

  return <BlogPostInner post={post} next={next} />;
}

function BlogPostInner({ post, next }: { post: NonNullable<ReturnType<typeof getPostBySlug>>; next: typeof blogPosts[number] }) {
  useSeo({
    title: `${post.title} | StudyKro Blog`,
    description: post.description,
    keywords: post.keywords,
    canonical: `https://studykro.com/blog/${post.slug}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { "@type": "Organization", name: "StudyKro" },
      publisher: { "@type": "Organization", name: "StudyKro" },
      keywords: post.keywords.join(", "),
      mainEntityOfPage: `https://studykro.com/blog/${post.slug}`,
    },
  });

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <PageWrapper>
      <article className="container max-w-3xl px-4 py-12 sm:py-16">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>

        <header className="mb-10">
          <span className="note-label mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
            <Tag className="h-3.5 w-3.5" /> {post.category}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-text font-display text-3xl font-bold leading-tight sm:text-4xl"
          >
            {post.title}
          </motion.h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </div>
        </header>

        <MarkdownLite source={post.content} />

        <div className="mt-12 flex flex-wrap gap-2">
          {post.keywords.map((k) => (
            <span key={k} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
              #{k}
            </span>
          ))}
        </div>

        <div className="mt-16 paper-panel flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="note-label mb-1">Up next</p>
            <p className="font-display text-lg font-semibold text-foreground">{next.title}</p>
          </div>
          <Link
            to={`/blog/${next.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Read next <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </article>
    </PageWrapper>
  );
}
