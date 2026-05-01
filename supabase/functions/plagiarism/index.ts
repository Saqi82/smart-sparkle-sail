import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_INPUT_CHARS = 60_000;
const MIN_INPUT_CHARS = 30;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (typeof text !== "string") {
      return jsonResponse({ error: "Text must be provided as a string." }, 400);
    }
    const trimmed = text.trim();
    if (trimmed.length < MIN_INPUT_CHARS) {
      return jsonResponse({ error: `Provide at least ${MIN_INPUT_CHARS} characters.` }, 400);
    }
    if (trimmed.length > MAX_INPUT_CHARS) {
      return jsonResponse({ error: `Text must be under ${MAX_INPUT_CHARS.toLocaleString()} characters.` }, 400);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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
            role: "system",
            content:
              "You are an academic-integrity assistant. Analyze the user's text for likely plagiarism, AI-generated patterns, and unoriginal phrasing. Be strict but fair. Always call return_plagiarism_report.",
          },
          {
            role: "user",
            content: `Analyze the following text. Score originality (0-100, higher = more original), plagiarism likelihood (0-100), and AI-generated likelihood (0-100). List suspicious passages with reason, likely source type, match confidence and a suggested rewrite.\n\nTEXT:\n"""\n${trimmed}\n"""`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_plagiarism_report",
              description: "Return structured plagiarism + originality analysis",
              parameters: {
                type: "object",
                properties: {
                  originality_score: { type: "number" },
                  plagiarism_likelihood: { type: "number" },
                  ai_generated_likelihood: { type: "number" },
                  verdict: {
                    type: "string",
                    enum: ["original", "minor_concerns", "likely_plagiarised", "highly_plagiarised"],
                  },
                  summary: { type: "string" },
                  suspicious_passages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        passage: { type: "string" },
                        reason: { type: "string" },
                        likely_source_type: { type: "string" },
                        match_confidence: { type: "number" },
                        suggested_rewrite: { type: "string" },
                      },
                      required: ["passage", "reason", "likely_source_type", "match_confidence", "suggested_rewrite"],
                    },
                  },
                  recommendations: { type: "array", items: { type: "string" } },
                },
                required: [
                  "originality_score",
                  "plagiarism_likelihood",
                  "ai_generated_likelihood",
                  "verdict",
                  "summary",
                  "suspicious_passages",
                  "recommendations",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_plagiarism_report" } },
      }),
    });

    if (response.status === 429) {
      return jsonResponse({ error: "Rate limit exceeded. Please try again in a moment." }, 429);
    }
    if (response.status === 402) {
      return jsonResponse({ error: "AI usage credits depleted. Please add credits in workspace settings." }, 402);
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall
      ? JSON.parse(toolCall.function.arguments)
      : JSON.parse(data.choices[0].message.content);

    return jsonResponse(result);
  } catch (e) {
    console.error("plagiarism error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
