import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { subject, topic, examType } = await req.json();
    if (!subject || typeof subject !== "string" || subject.length > 500) {
      return new Response(JSON.stringify({ error: "Subject must be a string under 500 characters." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (topic && typeof topic === "string" && topic.length > 500) {
      return new Response(JSON.stringify({ error: "Topic must be under 500 characters." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
          { role: "system", content: "You are an exam prediction expert. Always respond with valid JSON only." },
          { role: "user", content: `Predict exam content for Subject: ${subject}, Topic: ${topic || "general"}, Exam type: ${examType}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_exam_tips",
            description: "Return exam predictions and tips",
            parameters: {
              type: "object",
              properties: {
                likely_questions: { type: "array", items: { type: "string" } },
                must_study_topics: { type: "array", items: { type: "string" } },
                common_mistakes: { type: "array", items: { type: "string" } },
                last_minute_tips: { type: "array", items: { type: "string" } },
                time_management: { type: "string" },
                scoring_strategy: { type: "string" }
              },
              required: ["likely_questions", "must_study_topics", "common_mistakes", "last_minute_tips", "time_management", "scoring_strategy"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_exam_tips" } }
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
    console.error("examtips error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
