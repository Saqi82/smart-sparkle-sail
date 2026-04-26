// Legacy local API configuration for optional development-only experiments.
// Production hosting uses Supabase Edge Functions via src/lib/ai.ts.

const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:5000";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    HEALTH: `${API_BASE_URL}/health`,
    SUMMARIZE: `${API_BASE_URL}/summarize`,
    FLASHCARDS: `${API_BASE_URL}/flashcards`,
    QUIZ: `${API_BASE_URL}/quiz`,
    STUDY_PLAN: `${API_BASE_URL}/study-plan`,
    EXAM_TIPS: `${API_BASE_URL}/exam-tips`,
    MULTI_TASK: `${API_BASE_URL}/multi-task`,
  },
  TIMEOUT: 30000, // 30 seconds
};

export async function makeAPIRequest<T = any>(
  endpoint: string,
  method: "GET" | "POST" = "GET",
  body?: Record<string, any>
): Promise<T> {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `API Error: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout - please check if API server is running");
      }
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.HEALTH);
    return response?.status === "healthy";
  } catch {
    return false;
  }
}
