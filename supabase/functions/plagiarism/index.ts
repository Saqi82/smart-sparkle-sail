import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.length < 30 || text.length > 12000) {
      return new Response(
        JSON.stringify({ error: "Provide between 30 and 12,000 characters of text." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
              "You are an academic-integrity assistant. Analyze the user's text for likely plagiarism, AI-generated patterns, and unoriginal phrasing. Be strict but fair. Always respond by calling the return_plagiarism_report tool.",
          },
          {
            role: "user",
            content: `Analyze the following text and report plagiarism likelihood, originality score (0-100, where 100 = fully original), AI-generated likelihood (0-100), and list suspicious passages with reasons and a suggested rewrite. Also estimate which passages match common online sources (textbooks, Wikipedia-style phrasing, news sites) and label them.

TEXT:
"""
${text}
"""`,
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
                  originality_score: { type: "number", description: "0-100, higher = more original" },
                  plagiarism_likelihood: { type: "number", description: "0-100, higher = more likely plagiarised" },
                  ai_generated_likelihood: { type: "number", description: "0-100, higher = more likely AI-generated" },
                  verdict: {
                    type: "string",
                    enum: ["original", "minor_concerns", "likely_plagiarised", "highly_plagiarised"],
                  },
                  summary: { type: "string", description: "1-2 sentence verdict explanation" },
                  suspicious_passages: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        passage: { type: "string" },
                        reason: { type: "string" },
                        likely_source_type: { type: "string", description: "e.g. encyclopedia, textbook, news article, generic AI output" },
                        match_confidence: { type: "number", description: "0-100" },
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
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "AI usage credits depleted. Please add credits in workspace settings." }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("plagiarism error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
