import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { topic, essayType, length } = await req.json();
    if (!topic || typeof topic !== "string" || topic.length > 1000) {
      return new Response(JSON.stringify({ error: "Topic must be under 1,000 characters." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an academic writing coach. Always respond with valid JSON only." },
          { role: "user", content: `Build an outline for a ${essayType || "argumentative"} essay (~${length || "1000"} words) on: "${topic}".` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_outline",
            description: "Return a structured essay outline",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                thesis: { type: "string" },
                hook_ideas: { type: "array", items: { type: "string" } },
                introduction: { type: "string" },
                body_paragraphs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      heading: { type: "string" },
                      topic_sentence: { type: "string" },
                      evidence: { type: "array", items: { type: "string" } },
                      transition: { type: "string" }
                    },
                    required: ["heading", "topic_sentence", "evidence", "transition"]
                  }
                },
                counterargument: { type: "string" },
                conclusion: { type: "string" },
                suggested_sources: { type: "array", items: { type: "string" } }
              },
              required: ["title", "thesis", "hook_ideas", "introduction", "body_paragraphs", "counterargument", "conclusion", "suggested_sources"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_outline" } }
      }),
    });

    if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits depleted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!response.ok) throw new Error("AI gateway error");

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : JSON.parse(data.choices[0].message.content);
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("essay-outline error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
