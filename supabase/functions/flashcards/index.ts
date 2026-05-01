import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_INPUT_CHARS = 60_000;
const MIN_INPUT_CHARS = 5;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { content } = await req.json();
    if (typeof content !== "string") {
      return jsonResponse({ error: "Content must be provided as text." }, 400);
    }
    const trimmed = content.trim();
    if (trimmed.length < MIN_INPUT_CHARS) {
      return jsonResponse({ error: `Content must be at least ${MIN_INPUT_CHARS} characters.` }, 400);
    }
    if (trimmed.length > MAX_INPUT_CHARS) {
      return jsonResponse({ error: `Content must be under ${MAX_INPUT_CHARS.toLocaleString()} characters.` }, 400);
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
          { role: "system", content: "You are a study assistant. Always call the return_flashcards tool." },
          {
            role: "user",
            content: `Create 10 high-quality flashcards from this content. Mix difficulties.\n\nContent:\n${trimmed}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_flashcards",
              description: "Return generated flashcards",
              parameters: {
                type: "object",
                properties: {
                  flashcards: {
                    type: "array",
                    minItems: 5,
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        answer: { type: "string" },
                        difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
                      },
                      required: ["question", "answer", "difficulty"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["flashcards"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_flashcards" } },
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
    console.error("flashcards error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
