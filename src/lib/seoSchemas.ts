// src/lib/seoSchemas.ts
// Central schema library — import per page as needed

const BASE = 'https://studykro.com'

export const makeAppSchema = (name: string, url: string, desc: string, features: string[]) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": name,
  "url": url,
  "applicationCategory": "EducationalApplication",  // ← correct spelling
  "operatingSystem": "Web",
  "description": desc,
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "1240" },
  "featureList": features,
  "publisher": { "@type": "Organization", "name": "SialTech", "url": BASE }
})

export const makeFAQSchema = (qas: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": qas.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a }
  }))
})

export const makeHowToSchema = (name: string, desc: string, steps: { name: string; text: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": name,
  "description": desc,
  "step": steps.map(s => ({ "@type": "HowToStep", "name": s.name, "text": s.text }))
})