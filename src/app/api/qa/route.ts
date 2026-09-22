import { GoogleGenAI, Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
	...(process.env.GEMINI_BASE_URL && {
		httpOptions: { baseUrl: process.env.GEMINI_BASE_URL },
	}),
});

export async function POST(req: NextRequest) {
	try {
		const { documentText, question } = await req.json();

		if (!documentText || !question) {
			return NextResponse.json(
				{ error: 'Missing document text or question' },
				{ status: 400 },
			);
		}

		const prompt = `You are a legal document copilot answering a user's question about a document.
Follow these rules strictly:
1. ONLY use information contained in the provided document to answer the question.
2. NEVER fabricate information or guess. If the answer cannot be supported by the document, set notFound to true.
3. State when the answer is not found in the document clearly.
4. Include a concise source basis in the citations array.
5. Provide 2 logical follow-up questions the user might want to ask.

User Question: ${question}

Document text:
${documentText.substring(0, 80000)}
`;

		const response = await ai.models.generateContent({
			model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
			contents: prompt,
			config: {
				responseMimeType: 'application/json',
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						answer: {
							type: Type.STRING,
							description: 'Plain-English response based on the document.',
						},
						citations: {
							type: Type.ARRAY,
							items: { type: Type.STRING },
							description: "Sources like 'Page 6 - Termination Clause'",
						},
						notFound: {
							type: Type.BOOLEAN,
							description:
								'True if the answer cannot be found in the document.',
						},
						followUps: {
							type: Type.ARRAY,
							items: { type: Type.STRING },
							description: 'Follow-up questions.',
						},
					},
					required: ['answer', 'citations', 'notFound', 'followUps'],
				},
			},
		});

		const data = JSON.parse(response.text || '{}');
		return NextResponse.json(data);
	} catch (error: unknown) {
		console.error('AI QA Error:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ error: `Failed to answer question: ${message}` },
			{ status: 500 },
		);
	}
}
