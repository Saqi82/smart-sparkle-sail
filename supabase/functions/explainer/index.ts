import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_INPUT_CHARS = 60_000;
const MIN_INPUT_CHARS = 3;
const VALID_LEVELS = ["beginner", "intermediate", "advanced"];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { concept, level } = await req.json();
    if (typeof concept !== "string" || concept.trim().length < MIN_INPUT_CHARS) {
      return jsonResponse({ error: `Concept must be at least ${MIN_INPUT_CHARS} characters.` }, 400);
    }
    if (concept.length > MAX_INPUT_CHARS) {
      return jsonResponse({ error: `Concept must be under ${MAX_INPUT_CHARS.toLocaleString()} characters.` }, 400);
    }
    const safeLevel = VALID_LEVELS.includes(String(level).toLowerCase())
      ? String(level).toLowerCase()
      : "beginner";

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
            content: "You are an academic tutor who explains things clearly. Always call return_explanation.",
          },
          {
            role: "user",
            content: `Explain the following concept at a ${safeLevel} level using the Feynman technique:\n\n${concept.trim()}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_explanation",
              description: "Return a layered concept explanation",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  eli5: { type: "string" },
                  analogy: { type: "string" },
                  detailed: { type: "string" },
                  key_terms: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        term: { type: "string" },
                        meaning: { type: "string" },
                      },
                      required: ["term", "meaning"],
                    },
                  },
                  example: { type: "string" },
                  common_misconceptions: { type: "array", items: { type: "string" } },
                },
                required: ["title", "eli5", "analogy", "detailed", "key_terms", "example", "common_misconceptions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_explanation" } },
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
    console.error("explainer error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
