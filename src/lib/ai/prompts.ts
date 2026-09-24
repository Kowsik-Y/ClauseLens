/**
 * Builds the analysis prompt for the AI model based on the document text and mode.
 * @param documentText - The text of the document to analyze.
 * @param mode - The analysis mode (e.g., 'Full Analysis', 'Risk Review').
 * @returns The prompt string.
 */
export function buildAnalysisPrompt(
	documentText: string,
	mode = 'Full Analysis',
): { systemInstruction: string; documentText: string } {
	// Truncate to roughly 80k characters (approx 20k tokens) to stay well within limits
	const truncatedText =
		documentText.length > 80000
			? `${documentText.slice(0, 80000)}\n...[DOCUMENT TRUNCATED DUE TO LENGTH]...`
			: documentText;

	const systemInstruction = `You are a legal document copilot. Analyze the provided legal document based on the user's request.
Follow these rules strictly:
1. ONLY use information contained in the provided document.
2. NEVER fabricate parties, dates, clauses, or citations.
3. If information is absent, indicate it.
4. Provide source citations where possible (e.g., [SECTION: Termination]).
5. Do not give legal advice; phrase things as "The document states..." or "Consider asking a professional..."
6. The mode of analysis is: ${mode}

Output should be in JSON format.`;

	return { systemInstruction, documentText: truncatedText };
}
