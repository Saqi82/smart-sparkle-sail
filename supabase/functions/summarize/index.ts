import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { notes } = await req.json();
    if (!notes || typeof notes !== "string" || notes.length > 12000) {
      return new Response(JSON.stringify({ error: "Input must be a string under 12,000 characters." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
            content: "You are an academic assistant. Always respond with valid JSON only, no markdown or extra text."
          },
          {
            role: "user",
            content: `Analyze these student notes and return ONLY valid JSON in this exact format:
{"title":"detected topic title","short_summary":"3 sentence summary","key_points":["point 1","point 2","point 3","point 4","point 5"],"definitions":[{"term":"...","definition":"..."}],"important_formulas":["formula if any"],"remember_this":"single most important takeaway"}

Student Notes:
${notes}`
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_summary",
            description: "Return structured summary of student notes",
            parameters: {
              type: "object",
              properties: {
                title: { type: "string" },
                short_summary: { type: "string" },
                key_points: { type: "array", items: { type: "string" } },
                definitions: { type: "array", items: { type: "object", properties: { term: { type: "string" }, definition: { type: "string" } }, required: ["term", "definition"] } },
                important_formulas: { type: "array", items: { type: "string" } },
                remember_this: { type: "string" }
              },
              required: ["title", "short_summary", "key_points", "definitions", "important_formulas", "remember_this"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_summary" } }
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI usage credits depleted. Please add credits in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    const result = toolCall ? JSON.parse(toolCall.function.arguments) : JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("summarize error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
