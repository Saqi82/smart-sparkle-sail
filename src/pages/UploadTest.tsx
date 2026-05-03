import { useRef, useState } from "react";
import { FileSearch, UploadCloud, Loader2, CheckCircle2, XCircle, FileText } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCEPTED_EXT = ["pdf", "doc", "docx", "ppt", "pptx", "txt", "md", "png", "jpg", "jpeg", "webp"];
const ACCEPT_ATTR = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.png,.jpg,.jpeg,.webp";
const MAX_BYTES = 20 * 1024 * 1024;

const MIME_MAP: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ppt: "application/vnd.ms-powerpoint",
  txt: "text/plain",
  md: "text/markdown",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

type QueueStatus = "queued" | "uploading" | "parsing" | "done" | "error";
type QueueItem = {
  id: string;
  file: File;
  status: QueueStatus;
  characters?: number;
  truncated?: boolean;
  error?: string;
};

function randomKey(name: string) {
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `uploads/${stamp}-${safe}`;
}

export default function UploadTest() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [results, setResults] = useState<{ fileName: string; text: string }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [running, setRunning] = useState(false);

  const update = (id: string, patch: Partial<QueueItem>) =>
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const parseOne = async (item: QueueItem): Promise<{ fileName: string; text: string } | null> => {
    const ext = item.file.name.toLowerCase().split(".").pop() || "";
    const mime = item.file.type || MIME_MAP[ext] || "application/octet-stream";
    const path = randomKey(item.file.name);

    update(item.id, { status: "uploading" });
    const { error: upErr } = await supabase.storage
      .from("user-documents")
      .upload(path, item.file, { contentType: mime, upsert: false });
    if (upErr) {
      update(item.id, { status: "error", error: upErr.message });
      return null;
    }

    update(item.id, { status: "parsing" });
    const { data, error } = await supabase.functions.invoke("parse-document", {
      body: { path, mimeType: mime, fileName: item.file.name },
    });

    if (error || (data as any)?.error) {
      update(item.id, {
        status: "error",
        error: ((data as any)?.error as string) || error?.message || "Extraction failed",
      });
      return null;
    }

    const text = ((data as any)?.text as string) || "";
    if (!text) {
      update(item.id, { status: "error", error: "No readable text found" });
      return null;
    }

    update(item.id, {
      status: "done",
      characters: (data as any)?.characters ?? text.length,
      truncated: !!(data as any)?.truncated,
    });
    return { fileName: item.file.name, text };
  };

  const enqueue = (files: File[]) => {
    const accepted: QueueItem[] = [];
    const rejected: string[] = [];
    for (const f of files) {
      const ext = f.name.toLowerCase().split(".").pop() || "";
      if (!ACCEPTED_EXT.includes(ext)) {
        rejected.push(`${f.name} (unsupported type)`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        rejected.push(`${f.name} (over 20 MB)`);
        continue;
      }
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        status: "queued",
      });
    }
    if (rejected.length) toast.error(`Skipped: ${rejected.join(", ")}`);
    if (accepted.length === 0) return;

    setItems((prev) => [...prev, ...accepted]);
    void runQueue(accepted);
  };

  const runQueue = async (newItems: QueueItem[]) => {
    setRunning(true);
    let okCount = 0;
    for (const item of newItems) {
      const res = await parseOne(item);
      if (res) {
        okCount += 1;
        setResults((prev) => [...prev, res]);
      }
    }
    setRunning(false);
    if (okCount > 0) toast.success(`Extracted text from ${okCount} file${okCount > 1 ? "s" : ""}.`);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) enqueue(files);
  };

  const combined = results
    .map((r) => `===== ${r.fileName} =====\n\n${r.text}`)
    .join("\n\n\n");

  const copy = async () => {
    if (!combined) return;
    await navigator.clipboard.writeText(combined);
    toast.success("Combined text copied to clipboard.");
  };

  const clearAll = () => {
    if (running) return;
    setItems([]);
    setResults([]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const totalChars = results.reduce((n, r) => n + r.text.length, 0);

  return (
    <ToolPageLayout
      seoTitle="Upload & OCR Test — Multi-file Extraction"
      seoDescription="Drop one or many PDFs, scanned images, DOCX, PPTX or TXT files. They are parsed sequentially and merged into one combined result."
      canonical="/upload-test"
      category="Developer Tool"
      title="Upload & OCR Test"
      intro="Drop one or several documents at once. Each file is uploaded and parsed in turn, and the extracted text from every file is merged into a single combined output."
      icon={FileSearch}
    >
      <div className="space-y-5">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "cursor-pointer rounded-[14px] border-2 border-dashed p-6 transition-colors",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            accept={ACCEPT_ATTR}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length) enqueue(files);
            }}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {dragOver ? "Drop the files to queue them" : "Drag & drop multiple files, or click to choose"}
                </p>
                <p className="micro-note">
                  Each file up to 20 MB. Files are uploaded and parsed one after another.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                inputRef.current?.click();
              }}
            >
              <UploadCloud className="mr-2 h-4 w-4" />
              Choose files
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["PDF", "DOCX", "PPTX", "TXT", "MD", "PNG", "JPG", "WEBP"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground ring-1 ring-border/50"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {items.length > 0 && (
          <div className="paper-panel divide-y divide-border/40 overflow-hidden p-0">
            {items.map((it) => {
              const pct =
                it.status === "done"
                  ? 100
                  : it.status === "parsing"
                  ? 75
                  : it.status === "uploading"
                  ? 35
                  : it.status === "error"
                  ? 100
                  : 5;
              return (
                <div key={it.id} className="flex items-center gap-3 p-3 text-sm">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-muted text-muted-foreground">
                    {it.status === "done" ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : it.status === "error" ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : it.status === "queued" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-medium text-foreground">{it.file.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {it.status === "done"
                          ? `${it.characters?.toLocaleString()} chars${it.truncated ? " (truncated)" : ""}`
                          : it.status === "error"
                          ? it.error
                          : it.status}
                      </span>
                    </div>
                    <Progress
                      value={pct}
                      className={cn(
                        "mt-1.5 h-1",
                        it.status === "error" && "[&>div]:bg-destructive",
                      )}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {results.length > 0 && (
          <div className="paper-panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <div className="text-muted-foreground">
              <span className="font-semibold text-foreground">{results.length}</span> file
              {results.length > 1 ? "s" : ""} merged · {totalChars.toLocaleString()} characters total
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={copy}>
                Copy combined
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={clearAll} disabled={running}>
                Clear all
              </Button>
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Combined extracted text
          </label>
          <Textarea
            value={combined}
            onChange={() => {}}
            readOnly
            placeholder="Drop one or more files above. The merged OCR / parsed text from every file will appear here, separated by file headers."
            className="min-h-[360px] font-mono text-xs leading-6"
          />
          <p className="micro-note mt-2">
            Files are processed sequentially to stay within rate limits. Each section is prefixed with{" "}
            <code className="rounded bg-muted px-1">===== filename =====</code>.
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
}
