import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_INPUT_CHARS = 60_000;
const MIN_INPUT_CHARS = 20;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { notes } = await req.json();
    if (typeof notes !== "string") {
      return jsonResponse({ error: "Notes must be provided as text." }, 400);
    }
    const trimmed = notes.trim();
    if (trimmed.length < MIN_INPUT_CHARS) {
      return jsonResponse({ error: `Notes must be at least ${MIN_INPUT_CHARS} characters.` }, 400);
    }
    if (trimmed.length > MAX_INPUT_CHARS) {
      return jsonResponse({ error: `Notes must be under ${MAX_INPUT_CHARS.toLocaleString()} characters.` }, 400);
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
            content: "You are an academic assistant. Always call the return_summary tool with structured JSON.",
          },
          {
            role: "user",
            content: `Analyze these student notes and return a structured study summary.\n\nStudent Notes:\n${trimmed}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_summary",
              description: "Return structured summary of student notes",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  short_summary: { type: "string", description: "3 sentence overview" },
                  key_points: { type: "array", items: { type: "string" }, minItems: 3 },
                  definitions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        term: { type: "string" },
                        definition: { type: "string" },
                      },
                      required: ["term", "definition"],
                    },
                  },
                  important_formulas: { type: "array", items: { type: "string" } },
                  remember_this: { type: "string" },
                },
                required: [
                  "title",
                  "short_summary",
                  "key_points",
                  "definitions",
                  "important_formulas",
                  "remember_this",
                ],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_summary" } },
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
    console.error("summarize error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
