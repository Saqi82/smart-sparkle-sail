// Production integration for the hosted web app.
// StudyMind Web calls Supabase Edge Functions directly; no local server is required.

import { supabase } from "@/integrations/supabase/client";

export async function callAI(functionName: string, body: Record<string, any>) {
  const { data, error } = await supabase.functions.invoke(functionName, { body });

  if (error) {
    throw new Error(error.message || "AI request failed");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data) {
    throw new Error("Empty response from AI service");
  }

  return data;
}

// Legacy local API fallback:
// The files below are kept only as a dev reference and are not part of the
// Hostinger production deployment path.
/*
import { callAI as callLocalAI } from "./aiLocal";

export async function callAI(functionName: string, body: Record<string, any>) {
  try {
    const result = await callLocalAI(functionName, body);
    if (!result) {
      throw new Error("Empty response from AI service");
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("timeout") || error.message.includes("API server")) {
        throw new Error(
          "StudyBuddy AI API server is not running. Please start it with: python api.py in Model folder"
        );
      }
      throw error;
    }
    throw new Error("Unknown error occurred during AI request");
  }
}
*/
