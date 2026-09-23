import { GoogleGenAI } from '@google/genai';

/**
 * Shared Google GenAI client instance.
 * Configured via environment variables for API key, base URL, and model.
 * Used by all API routes to avoid duplicate instantiation.
 */
export const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
	...(process.env.GEMINI_BASE_URL && {
		httpOptions: { baseUrl: process.env.GEMINI_BASE_URL },
	}),
});

/** Default Gemini model identifier, configurable via GEMINI_MODEL env var. */
export const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
