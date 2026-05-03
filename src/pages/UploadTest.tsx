import { useState } from "react";
import { FileSearch } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import DocumentUploader from "@/components/DocumentUploader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function UploadTest() {
  const [text, setText] = useState("");
  const [meta, setMeta] = useState<{ fileName: string; characters: number; truncated: boolean } | null>(null);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied extracted text to clipboard.");
  };

  const reset = () => {
    setText("");
    setMeta(null);
  };

  return (
    <ToolPageLayout
      seoTitle="Upload & OCR Test — Extract Text from PDFs and Images"
      seoDescription="Test the document uploader: drop a PDF, scanned image, DOCX, PPTX or TXT and instantly see the extracted text."
      canonical="/upload-test"
      category="Developer Tool"
      title="Upload & OCR Test"
      intro="Upload a scanned image, photo of notes, PDF, DOCX, PPTX, TXT or MD file. We send it through the parse-document edge function and show you the raw extracted text immediately — useful for verifying the pipeline before wiring it into another tool."
      icon={FileSearch}
    >
      <div className="space-y-5">
        <DocumentUploader
          onText={(t, m) => {
            setText(t);
            setMeta(m);
          }}
          label="Drop any document or image"
        />

        {meta && (
          <div className="paper-panel flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
            <div className="text-muted-foreground">
              <span className="font-semibold text-foreground">{meta.fileName}</span>
              {" — "}
              {meta.characters.toLocaleString()} characters
              {meta.truncated && <span className="ml-1 text-amber-500">(truncated to 60k)</span>}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={copy}>
                Copy text
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={reset}>
                Clear
              </Button>
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Extracted text
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Upload a file above and the OCR / parsed text will appear here..."
            className="min-h-[360px] font-mono text-xs leading-6"
          />
          <p className="micro-note mt-2">
            Tip: try a screenshot of handwritten notes, a scanned PDF, or a PowerPoint deck to see how each path is handled.
          </p>
        </div>
      </div>
    </ToolPageLayout>
  );
}
