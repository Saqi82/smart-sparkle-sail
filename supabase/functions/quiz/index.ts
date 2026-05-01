import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_TOPIC_CHARS = 60_000;
const VALID_DIFFICULTIES = ["easy", "medium", "hard"] as const;
const VALID_COUNTS = [3, 5, 10, 15, 20];

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, difficulty, count } = await req.json();

    if (typeof topic !== "string" || topic.trim().length < 3) {
      return jsonResponse({ error: "Topic must be at least 3 characters." }, 400);
    }
    if (topic.length > MAX_TOPIC_CHARS) {
      return jsonResponse(
        { error: `Topic / source content must be under ${MAX_TOPIC_CHARS.toLocaleString()} characters.` },
        400,
      );
    }
    const normalizedDifficulty = String(difficulty || "medium").toLowerCase();
    if (!VALID_DIFFICULTIES.includes(normalizedDifficulty as (typeof VALID_DIFFICULTIES)[number])) {
      return jsonResponse({ error: "Difficulty must be Easy, Medium or Hard." }, 400);
    }
    const numCount = Number(count) || 5;
    if (!VALID_COUNTS.includes(numCount)) {
      return jsonResponse({ error: `Count must be one of ${VALID_COUNTS.join(", ")}.` }, 400);
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
              "You are a quiz creator. Generate clear, unambiguous multiple-choice questions. Always set correct_answer to the FULL text of the correct option (not a letter).",
          },
          {
            role: "user",
            content: `Create a ${numCount}-question multiple choice quiz at ${normalizedDifficulty} difficulty based on the following topic or notes:\n\n${topic.trim()}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_quiz",
              description: "Return generated quiz",
              parameters: {
                type: "object",
                properties: {
                  quiz_title: { type: "string" },
                  questions: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        options: { type: "array", minItems: 4, maxItems: 4, items: { type: "string" } },
                        correct_answer: { type: "string" },
                        explanation: { type: "string" },
                      },
                      required: ["question", "options", "correct_answer", "explanation"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["quiz_title", "questions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_quiz" } },
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
    console.error("quiz error:", e);
    return jsonResponse({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});
