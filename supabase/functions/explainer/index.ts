import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { concept, level } = await req.json();
    if (!concept || typeof concept !== "string" || concept.length > 1000) {
      return new Response(JSON.stringify({ error: "Concept must be a string under 1,000 characters." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are an academic tutor who explains things clearly. Always respond with valid JSON only." },
          { role: "user", content: `Explain the concept: "${concept}" at a ${level || "beginner"} level. Use the Feynman technique.` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_explanation",
            description: "Return a layered concept explanation",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                eli5: { type: "string", description: "Explain like I'm 5" },
                analogy: { type: "string", description: "An everyday analogy" },
                detailed: { type: "string", description: "Detailed explanation" },
                key_terms: { type: "array", items: { type: "object", properties: { term: { type: "string" }, meaning: { type: "string" } }, required: ["term", "meaning"] } },
                example: { type: "string" },
                common_misconceptions: { type: "array", items: { type: "string" } },
              },
              required: ["title", "eli5", "analogy", "detailed", "key_terms", "example", "common_misconceptions"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_explanation" } }
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
    console.error("explainer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
