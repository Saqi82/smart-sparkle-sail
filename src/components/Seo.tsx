import { useSeo } from "@/lib/seo";

type Props = {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

/**
 * Component wrapper around the useSeo hook so pages can declare SEO inline.
 */
export default function Seo(props: Props) {
  useSeo(props);
  return null;
}
