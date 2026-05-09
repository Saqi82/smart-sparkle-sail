// src/components/SEOHead.tsx
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string             // max 60 chars
  description: string        // max 155 chars
  canonical: string          // full URL e.g. https://studykro.com/flashcard-generator
  schemas?: object[]          // array of JSON-LD schema objects
  ogImage?: string            // full URL to 1200×630 image
  noindex?: boolean           // true only for 404/privacy/terms
}

export default function SEOHead({
  title,
  description,
  canonical,
  schemas = [],
  ogImage = 'https://studykro.com/icon-512.png',
  noindex = false
}: SEOHeadProps) {
  return (
    <Helmet>
      <{/* Core */}
      title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={canonical} />

      <{/* Open Graph */}
      meta property="og:type" content="website" />
      <meta property="og:site_name" content="StudyKro" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <{/* Twitter */}
      meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <{/* JSON-LD schemas */}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  )
}