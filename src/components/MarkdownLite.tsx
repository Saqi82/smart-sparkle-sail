// Tiny zero-dep markdown renderer for our blog content.
// Supports: ## headings, ### headings, lists, tables, bold, paragraphs.
import { useMemo } from "react";

function renderInline(text: string) {
  const html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-sm">$1</code>');
  return html;
}

export function MarkdownLite({ source }: { source: string }) {
  const html = useMemo(() => {
    const lines = source.trim().split("\n");
    const out: string[] = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (!line.trim()) {
        i++;
        continue;
      }
      if (line.startsWith("## ")) {
        out.push(`<h2 class="mt-10 mb-4 font-display text-2xl font-bold text-foreground">${renderInline(line.slice(3))}</h2>`);
        i++;
        continue;
      }
      if (line.startsWith("### ")) {
        out.push(`<h3 class="mt-6 mb-3 font-display text-xl font-semibold text-foreground">${renderInline(line.slice(4))}</h3>`);
        i++;
        continue;
      }
      // ordered list
      if (/^\d+\.\s/.test(line)) {
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(`<li class="ml-6 list-decimal pb-1">${renderInline(lines[i].replace(/^\d+\.\s/, ""))}</li>`);
          i++;
        }
        out.push(`<ol class="my-4 space-y-1 text-foreground/90">${items.join("")}</ol>`);
        continue;
      }
      // unordered list
      if (line.startsWith("- ")) {
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith("- ")) {
          items.push(`<li class="ml-6 list-disc pb-1">${renderInline(lines[i].slice(2))}</li>`);
          i++;
        }
        out.push(`<ul class="my-4 space-y-1 text-foreground/90">${items.join("")}</ul>`);
        continue;
      }
      // table
      if (line.startsWith("|")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        if (tableLines.length >= 2) {
          const header = tableLines[0].split("|").slice(1, -1).map((c) => c.trim());
          const rows = tableLines.slice(2).map((r) => r.split("|").slice(1, -1).map((c) => c.trim()));
          out.push(
            `<div class="my-6 overflow-x-auto"><table class="w-full border-collapse text-sm"><thead><tr>${header
              .map((h) => `<th class="border-b border-border px-3 py-2 text-left font-semibold">${renderInline(h)}</th>`)
              .join("")}</tr></thead><tbody>${rows
              .map(
                (r) =>
                  `<tr>${r
                    .map((c) => `<td class="border-b border-border/50 px-3 py-2 text-foreground/90">${renderInline(c)}</td>`)
                    .join("")}</tr>`,
              )
              .join("")}</tbody></table></div>`,
          );
        }
        continue;
      }
      // paragraph
      out.push(`<p class="my-4 leading-relaxed text-foreground/90">${renderInline(line)}</p>`);
      i++;
    }
    return out.join("");
  }, [source]);

  return <div className="max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}
