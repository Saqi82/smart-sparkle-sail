// Parse uploaded study documents into plain text.
// Supports: PDF, DOCX, PPTX, TXT, MD, PNG/JPG/WEBP (images via vision).
//
// Flow:
//   1. Client uploads the file to the `user-documents` storage bucket.
//   2. Client invokes this function with { path, mimeType, fileName }.
//   3. Function downloads the file with the service role and extracts text.
//   4. Returns { text, characters, source }.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import JSZip from "https://esm.sh/jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
const MAX_CHARS = 60_000; // safety cap returned to client

const TEXT_TYPES = new Set(["text/plain", "text/markdown"]);
const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const PDF_TYPE = "application/pdf";
const DOCX_TYPE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PPTX_TYPE = "application/vnd.openxmlformats-officedocument.presentationml.presentation";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Decode plain XML <w:t> / <a:t> / <t> nodes into a single string.
function extractTextFromOfficeXml(xml: string): string {
  // Match <something:t ...>TEXT</something:t> or <t>TEXT</t>
  const matches = xml.match(/<(?:[a-z]+:)?t(?:\s[^>]*)?>([\s\S]*?)<\/(?:[a-z]+:)?t>/gi) || [];
  return matches
    .map((m) => m.replace(/<[^>]+>/g, ""))
    .map((s) =>
      s
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'"),
    )
    .join(" ")
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function parseDocx(bytes: Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(bytes);
  const doc = zip.file("word/document.xml");
  if (!doc) throw new Error("Invalid DOCX: missing word/document.xml");
  const xml = await doc.async("string");
  return extractTextFromOfficeXml(xml);
}

async function parsePptx(bytes: Uint8Array): Promise<string> {
  const zip = await JSZip.loadAsync(bytes);
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((a, b) => {
      const na = parseInt(a.match(/slide(\d+)\.xml/i)?.[1] || "0", 10);
      const nb = parseInt(b.match(/slide(\d+)\.xml/i)?.[1] || "0", 10);
      return na - nb;
    });
  if (slideFiles.length === 0) throw new Error("Invalid PPTX: no slides found");
  const parts: string[] = [];
  let i = 1;
  for (const name of slideFiles) {
    const xml = await zip.files[name].async("string");
    const text = extractTextFromOfficeXml(xml);
    if (text) parts.push(`Slide ${i}:\n${text}`);
    i += 1;
  }
  return parts.join("\n\n");
}

function bytesToBase64(bytes: Uint8Array): string {
  // Avoid stack overflow on large files by chunking
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunkSize)),
    );
  }
  return btoa(binary);
}

async function extractWithGemini(bytes: Uint8Array, mimeType: string, kind: "pdf" | "image"): Promise<string> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

  const base64 = bytesToBase64(bytes);
  const instruction =
    kind === "pdf"
      ? "Extract ALL readable text from this PDF document, preserving the original reading order. Include headings, paragraphs, lists and tables as plain text. Do not summarize. Do not add commentary. Output the raw text only."
      : "Perform OCR on this image. Extract every word of legible text in natural reading order as plain text. If the image is a photo of notes, transcribe everything. Do not add commentary or descriptions of the image. Output the extracted text only.";

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instruction },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        },
      ],
    }),
  });

  if (response.status === 429) throw new Error("Rate limit exceeded while extracting text. Please try again in a moment.");
  if (response.status === 402) throw new Error("AI usage credits depleted. Please add credits in workspace settings.");
  if (!response.ok) {
    const t = await response.text();
    console.error("Gemini extract error:", response.status, t);
    throw new Error("Failed to extract text from file");
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") throw new Error("Empty extraction result");
  return text.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { path, mimeType, fileName } = await req.json();

    if (!path || typeof path !== "string" || path.length > 512) {
      return jsonResponse({ error: "A valid storage path is required." }, 400);
    }
    if (!mimeType || typeof mimeType !== "string") {
      return jsonResponse({ error: "mimeType is required." }, 400);
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      throw new Error("Server is missing storage credentials");
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: blob, error: dlError } = await admin.storage
      .from("user-documents")
      .download(path);

    if (dlError || !blob) {
      console.error("download error:", dlError);
      return jsonResponse({ error: "Could not load the uploaded file. Please re-upload." }, 404);
    }

    const arrayBuffer = await blob.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_BYTES) {
      return jsonResponse({ error: "File exceeds 20 MB limit." }, 413);
    }
    const bytes = new Uint8Array(arrayBuffer);

    let text = "";
    let source = "";

    const lower = mimeType.toLowerCase();
    if (TEXT_TYPES.has(lower)) {
      text = new TextDecoder("utf-8").decode(bytes);
      source = "text";
    } else if (lower === DOCX_TYPE) {
      text = await parseDocx(bytes);
      source = "docx";
    } else if (lower === PPTX_TYPE) {
      text = await parsePptx(bytes);
      source = "pptx";
    } else if (lower === PDF_TYPE) {
      text = await extractWithGemini(bytes, PDF_TYPE, "pdf");
      source = "pdf";
    } else if (IMAGE_TYPES.has(lower)) {
      text = await extractWithGemini(bytes, lower, "image");
      source = "image";
    } else {
      return jsonResponse(
        {
          error: `Unsupported file type: ${mimeType}. Use PDF, DOCX, PPTX, TXT, MD, PNG, JPG or WEBP.`,
        },
        415,
      );
    }

    text = text.trim();
    if (!text) {
      return jsonResponse({ error: "No readable text was found in this file." }, 422);
    }

    let truncated = false;
    if (text.length > MAX_CHARS) {
      text = text.slice(0, MAX_CHARS);
      truncated = true;
    }

    return jsonResponse({
      text,
      characters: text.length,
      source,
      fileName: fileName || null,
      truncated,
    });
  } catch (e) {
    console.error("parse-document error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
