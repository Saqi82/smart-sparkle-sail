import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_CONTEXT_CHARS = 60_000;

const SYSTEM_PROMPT = `You are an advanced, empathetic, and highly qualified AI Academic Tutor. Your mission is to help students truly master their course material, not just give them quick answers.

[CORE BEHAVIORS]

1. SOCRATIC METHOD: When a student asks a conceptual question, do not immediately provide the answer. Instead, break the concept down. Ask 1-2 guiding questions to help the student deduce the answer themselves.

2. CITATION-BACKED ANSWERS: Every time you reference facts from the uploaded course materials, explicitly cite the source. Use format: (Page X) or [Document Name, Section Y]. Never hallucinate facts outside the provided context. If the context does not contain the answer, say so clearly.

3. ADAPTIVE EXPLANATIONS: If a student says they do not understand, pivot your explanation style. Use an analogy, a real-world example, or an "Explain Like I'm 5" (ELI5) approach.

4. ERROR CORRECTION: If a student makes a mistake in their reasoning, gently point out the logical flaw. Walk them through the correct steps.

[OUTPUT FORMATTING]
- Use Markdown for structure. Use **bold** for key terms.
- Keep sentences short and paragraphs under 3 sentences for high scannability.
- Use bulleted lists for multi-step processes or formulas.
- Never use emojis. Keep the tone professional, encouraging, and academic.

[QUIZ MODE TRIGGER]
If the student asks to be tested or quizzed, generate exactly 3 multiple-choice questions based strictly on the provided course materials. Wait for their answers before providing feedback and detailed explanations.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, documentContext, documentName } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ctx = typeof documentContext === "string"
      ? documentContext.slice(0, MAX_CONTEXT_CHARS)
      : "";

    const contextBlock = ctx
      ? `\n\n[STUDENT CONTEXT]\nThe student has uploaded the following course material${documentName ? ` (Document Name: ${documentName})` : ""}. Use it as the authoritative source and cite it.\n\n--- BEGIN COURSE MATERIAL ---\n${ctx}\n--- END COURSE MATERIAL ---`
      : `\n\n[STUDENT CONTEXT]\nNo course material has been uploaded yet. Encourage the student to upload notes or a textbook for citation-backed answers, but you may still tutor using the Socratic method.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT + contextBlock },
            ...messages,
          ],
        }),
      },
    );

    if (response.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (response.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI usage credits depleted. Add credits in workspace settings." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("tutor error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
