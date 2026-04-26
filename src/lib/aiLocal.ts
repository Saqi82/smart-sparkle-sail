// Legacy local API integration for optional development-only fallback.
// The hosted web app does not import this file in production.

import { API_CONFIG, makeAPIRequest } from "./apiConfig";

// ========== SUMMARIZATION ==========
export async function callAI(functionName: string, body: Record<string, any>) {
  switch (functionName) {
    case "summarize":
      return summarizeContent(body.notes || body.text || "");
    case "flashcards":
      return generateFlashcards(body.content || "");
    case "quiz":
      return generateQuiz(body);
    case "study_plan":
      return createStudyPlan(body);
    case "exam_tips":
      return getExamTips(body);
    default:
      throw new Error(`Unknown function: ${functionName}`);
  }
}

export async function summarizeContent(text: string) {
  if (!text.trim()) {
    throw new Error("No text provided for summarization");
  }

  const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.SUMMARIZE, "POST", {
    text: text.trim(),
  });

  // Parse the response to extract structured data
  return {
    title: "Summary",
    short_summary: response.summary || "",
    key_points: extractKeyPoints(response.summary || ""),
    definitions: extractDefinitions(response.summary || ""),
    important_formulas: extractFormulas(text),
    remember_this: extractRememberThis(response.summary || ""),
  };
}

// ========== FLASHCARDS ==========
export async function generateFlashcards(content: string) {
  if (!content.trim()) {
    throw new Error("No content provided for flashcard generation");
  }

  const response = await makeAPIRequest(
    API_CONFIG.ENDPOINTS.FLASHCARDS,
    "POST",
    { content: content.trim() }
  );

  // Parse flashcards from response
  const flashcards = parseFlashcards(response.flashcards || response || "");

  return {
    flashcards: flashcards.length > 0 ? flashcards : generateDefaultFlashcards(content),
  };
}

// ========== QUIZ ==========
export async function generateQuiz(params: any) {
  const { topic, difficulty = "Medium", count = 5, content } = params;
  const input = content || topic;

  if (!input.trim()) {
    throw new Error("No topic provided for quiz generation");
  }

  const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.QUIZ, "POST", {
    content: input.trim(),
  });

  const questions = parseQuizQuestions(response.quiz || response || "");

  return {
    quiz_title: `${input} Quiz`,
    questions:
      questions.length > 0
        ? questions.slice(0, parseInt(count || "5"))
        : generateDefaultQuiz(input, parseInt(count || "5")),
  };
}

// ========== STUDY PLAN ==========
export async function createStudyPlan(params: any) {
  const {
    subject,
    duration = "4 weeks",
    topics = "",
    daily_hours = 2,
  } = params;

  if (!subject.trim()) {
    throw new Error("Subject is required for study plan creation");
  }

  const response = await makeAPIRequest(
    API_CONFIG.ENDPOINTS.STUDY_PLAN,
    "POST",
    {
      subject,
      duration,
      topics,
      daily_hours,
    }
  );

  return {
    study_plan: response.study_plan || response || "",
    subject,
    duration,
    topics,
    daily_hours,
  };
}

// ========== EXAM TIPS ==========
export async function getExamTips(params: any) {
  const { subject, sub_topics } = params;

  if (!subject.trim()) {
    throw new Error("Subject is required for exam tips");
  }

  const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.EXAM_TIPS, "POST", {
    subject,
    sub_topics,
  });

  return {
    exam_tips: response.exam_tips || response || "",
    subject,
    topics: sub_topics,
  };
}

// ========== HELPER FUNCTIONS ==========

function extractKeyPoints(text: string): string[] {
  const points = text
    .split(/[\.\n]/)
    .map((p) => p.trim())
    .filter((p) => p.length > 10 && p.length < 200)
    .slice(0, 5);

  if (points.length === 0) {
    return [text.substring(0, 100) + "...", text.substring(100, 200) + "..."];
  }

  return points;
}

function extractDefinitions(
  text: string
): Array<{ term: string; definition: string }> {
  const definitions: Array<{ term: string; definition: string }> = [];
  const pattern = /(\w+(?:\s+\w+)*)\s*(?:is|=|:)\s*([^\.]+)/g;
  let match;

  while ((match = pattern.exec(text)) && definitions.length < 3) {
    definitions.push({
      term: match[1].trim(),
      definition: match[2].trim(),
    });
  }

  return definitions;
}

function extractFormulas(text: string): string[] {
  const formulas: string[] = [];
  const pattern = /([A-Z]\s*=\s*[^\.]+|[A-Z]+\s*=\s*[^\.]*\d+[^\.]*)/g;
  let match;

  while ((match = pattern.exec(text)) && formulas.length < 3) {
    formulas.push(match[0].trim());
  }

  return formulas;
}

function extractRememberThis(text: string): string {
  const important = text.split(/[\.\n]/).find((s) => s.length > 50);
  return important?.trim() || "Review this material regularly for better retention.";
}

interface Flashcard {
  question: string;
  answer: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

function parseFlashcards(response: any): Flashcard[] {
  if (Array.isArray(response)) {
    return response;
  }

  const text = typeof response === "string" ? response : JSON.stringify(response);
  const flashcards: Flashcard[] = [];

  const pairs = text.split(/[?]\s*[A-Z]|Q\d+:|---/);

  for (let i = 0; i < pairs.length - 1; i += 2) {
    const question = pairs[i]?.trim();
    const answer = pairs[i + 1]?.trim();

    if (question && answer && question.length > 5 && answer.length > 5) {
      flashcards.push({
        question: question.substring(0, 200),
        answer: answer.substring(0, 300),
        difficulty: Math.random() > 0.66 ? "Hard" : Math.random() > 0.33 ? "Medium" : "Easy",
      });
    }
  }

  return flashcards;
}

function generateDefaultFlashcards(content: string): Flashcard[] {
  const sentences = content.split(/[\.!?]+/).filter((s) => s.trim().length > 20);

  return sentences.slice(0, 4).map((sentence, i) => ({
    question: `What can you tell me about part ${i + 1}?`,
    answer: sentence.trim(),
    difficulty: i % 3 === 0 ? "Hard" : i % 2 === 0 ? "Medium" : "Easy",
  }));
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

function parseQuizQuestions(response: any): QuizQuestion[] {
  if (Array.isArray(response)) {
    return response;
  }

  const text = typeof response === "string" ? response : JSON.stringify(response);
  const questions: QuizQuestion[] = [];

  const qPattern = /(\d+)\.\s+([^?]+\?)/g;
  let match;

  while ((match = qPattern.exec(text)) && questions.length < 10) {
    const questionText = match[2];
    questions.push({
      question: questionText,
      options: ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
      correct_answer: "A",
      explanation: "Based on the provided material.",
    });
  }

  return questions;
}

function generateDefaultQuiz(topic: string, count: number): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (let i = 1; i <= count; i++) {
    questions.push({
      question: `What is the importance of ${topic} in learning? (Question ${i})`,
      options: [
        "A) Essential for understanding",
        "B) Optional concept",
        "C) Advanced topic",
        "D) Not important",
      ],
      correct_answer: "A",
      explanation: `${topic} is a fundamental concept that helps build stronger foundations.`,
    });
  }

  return questions;
}
