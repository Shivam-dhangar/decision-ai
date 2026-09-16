import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_DECISION_PHILOSOPHY } from './prompts';

/**
 * Extracts and cleans JSON from AI responses (handles markdown codeblocks, whitespace, trailing commas)
 */
function cleanAndParseJSON<T>(rawText: string): T {
  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (error) {
    // Try to find the first '{' or '[' and last '}' or ']'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted) as T;
    }
    throw new Error(`Failed to parse structured JSON from AI output: ${rawText.slice(0, 100)}...`);
  }
}

const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-latest',
  'gemini-pro',
];

/**
 * Calls Gemini with provided prompt and returns parsed JSON.
 * Tries the modern recommended models in sequence with graceful fallback.
 */
export async function callGeminiStructured<T>(prompt: string): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: Error | null = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_DECISION_PHILOSOPHY,
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return cleanAndParseJSON<T>(text);
    } catch (err: any) {
      lastError = err;
      // If model not found (404) or deprecated, try next model in CANDIDATE_MODELS
      if (
        err.message?.includes('404') ||
        err.message?.includes('not found') ||
        err.message?.includes('no longer available')
      ) {
        continue;
      }
      // If it's a quota or auth error, throw immediately
      throw err;
    }
  }

  throw lastError || new Error('All candidate Gemini models failed to generate content.');
}
