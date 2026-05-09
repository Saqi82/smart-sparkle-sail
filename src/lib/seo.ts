//src/lib/seo.ts
import { useEffect } from "react";

type SeoOptions = {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo({ title, description, canonical, keywords, ogImage, jsonLd }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    if (keywords?.length) setMeta("keywords", keywords.join(", "));
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    if (ogImage) setMeta("og:image", ogImage, "property");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    if (ogImage) setMeta("twitter:image", ogImage);
    const url = canonical ?? window.location.href;
    setLink("canonical", url);
    setMeta("og:url", url, "property");

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(jsonLd);
      script.dataset.dynamic = "true";
      document.head.appendChild(script);
    }
    return () => {
      if (script) script.remove();
    };
  }, [title, description, canonical, keywords?.join(","), ogImage, JSON.stringify(jsonLd)]);
}
