import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { subject, examDate, hours, level, weakAreas } = await req.json();
    if (!subject || typeof subject !== "string" || subject.length > 500) {
      return new Response(JSON.stringify({ error: "Subject must be a string under 500 characters." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (weakAreas && typeof weakAreas === "string" && weakAreas.length > 2000) {
      return new Response(JSON.stringify({ error: "Weak areas must be under 2,000 characters." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
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
          { role: "system", content: "You are a study planner. Always respond with valid JSON only." },
          { role: "user", content: `Create a study plan. Subject: ${subject}, Exam date: ${examDate}, Hours/day: ${hours}, Level: ${level}, Weak areas: ${weakAreas || "none specified"}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_study_plan",
            description: "Return generated study plan",
            parameters: {
              type: "object",
              properties: {
                total_days: { type: "number" },
                overall_strategy: { type: "string" },
                daily_plans: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      day: { type: "number" },
                      date: { type: "string" },
                      focus_topic: { type: "string" },
                      tasks: { type: "array", items: { type: "string" } },
                      hours: { type: "number" },
                      tip: { type: "string" }
                    },
                    required: ["day", "focus_topic", "tasks", "hours", "tip"],
                    additionalProperties: false
                  }
                },
                resources: { type: "array", items: { type: "string" } },
                warning: { type: "string" }
              },
              required: ["total_days", "overall_strategy", "daily_plans", "resources"],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_study_plan" } }
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
    console.error("studyplan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
