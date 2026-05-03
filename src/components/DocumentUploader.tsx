import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UploadCloud, FileText, X, Loader2 } from "lucide-react";

const ACCEPTED_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "text/plain",
  "text/markdown",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const ACCEPT_ATTR = ".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.png,.jpg,.jpeg,.webp";
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

interface DocumentUploaderProps {
  onText: (text: string, meta: { fileName: string; characters: number; truncated: boolean }) => void;
  disabled?: boolean;
  label?: string;
}

function randomKey(name: string) {
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `uploads/${stamp}-${safe}`;
}

export default function DocumentUploader({ onText, disabled, label }: DocumentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<"idle" | "uploading" | "parsing" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);

  const reset = () => {
    setStage("idle");
    setProgress(0);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    if (!ACCEPTED_MIMES.includes(file.type)) {
      // Some browsers report empty type for .md / .txt — fall back to extension
      const ext = file.name.toLowerCase().split(".").pop();
      const okExt = ["pdf", "doc", "docx", "ppt", "pptx", "txt", "md", "png", "jpg", "jpeg", "webp"].includes(
        ext || "",
      );
      if (!okExt) {
        toast.error("Unsupported file type. Use PDF, DOCX, PPTX, TXT, MD or an image.");
        return;
      }
    }
    if (file.size > MAX_BYTES) {
      toast.error("File is over the 20 MB limit.");
      return;
    }

    setFileName(file.name);
    setStage("uploading");
    setProgress(20);

    const path = randomKey(file.name);
    const { error: upErr } = await supabase.storage
      .from("user-documents")
      .upload(path, file, { contentType: file.type || undefined, upsert: false });

    if (upErr) {
      console.error(upErr);
      toast.error(upErr.message || "Upload failed.");
      reset();
      return;
    }

    setProgress(55);
    setStage("parsing");

    // Resolve mime: prefer browser type, otherwise infer from extension.
    let mime = file.type;
    if (!mime) {
      const ext = file.name.toLowerCase().split(".").pop();
      const map: Record<string, string> = {
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
      mime = map[ext || ""] || "application/octet-stream";
    }

    const { data, error } = await supabase.functions.invoke("parse-document", {
      body: { path, mimeType: mime, fileName: file.name },
    });

    setProgress(100);

    if (error || data?.error) {
      console.error(error || data?.error);
      toast.error((data?.error as string) || error?.message || "Could not extract text.");
      reset();
      return;
    }

    const text = (data as any)?.text as string;
    if (!text) {
      toast.error("No readable text was found in this file.");
      reset();
      return;
    }

    setStage("done");
    onText(text, {
      fileName: file.name,
      characters: (data as any)?.characters ?? text.length,
      truncated: !!(data as any)?.truncated,
    });
    toast.success(
      `Extracted ${text.length.toLocaleString()} characters from ${file.name}${
        (data as any)?.truncated ? " (truncated)" : ""
      }.`,
    );
  };

  const busy = stage === "uploading" || stage === "parsing";
  const [dragOver, setDragOver] = useState(false);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (busy || disabled) return;
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;
    if (files.length > 1) {
      toast.error("Please drop one file at a time.");
      return;
    }
    void handleFile(files[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!busy && !disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      onClick={() => !busy && !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !busy && !disabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={cn(
        "cursor-pointer rounded-[14px] border-2 border-dashed p-5 transition-colors",
        dragOver
          ? "border-primary bg-primary/5"
          : "border-border/50 bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
        (busy || disabled) && "cursor-not-allowed opacity-80",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={ACCEPT_ATTR}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-primary/10 text-primary">
            {fileName ? <FileText className="h-5 w-5" /> : <UploadCloud className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {label || (dragOver ? "Drop the file to upload" : "Drag & drop or click to upload")}
            </p>
            <p className="micro-note truncate">
              {fileName
                ? `${fileName}`
                : "Up to 20 MB. We extract the text for you."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {fileName && stage === "done" && (
            <Button type="button" variant="ghost" size="sm" onClick={reset} disabled={busy}>
              <X className="mr-1 h-4 w-4" /> Clear
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {stage === "uploading" ? "Uploading..." : "Reading..."}
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" />
                {fileName ? "Replace file" : "Choose file"}
              </>
            )}
          </Button>
        </div>
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

      {busy && <Progress value={progress} className="mt-3 h-1.5" />}
    </div>
  );
}
