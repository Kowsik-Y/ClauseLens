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
		const { documentA, documentB } = await req.json();

		if (!documentA || !documentB) {
			return NextResponse.json(
				{ error: 'Missing documentA or documentB' },
				{ status: 400 },
			);
		}

		const prompt = `You are a legal document copilot comparing two versions of a contract.
Identify the meaningful changes between Document A (Original) and Document B (New).

Rules:
1. Do not claim one contract is universally "better".
2. Use neutral descriptions of the impact (e.g., "Document B introduces an additional termination notice requirement").
3. Focus on important categories: payment, dates, termination, liability, confidentiality, renewal, intellectual property, data usage, dispute resolution.
4. Ignore minor formatting or trivial word changes that don't affect legal meaning.

Document A (Original):
${documentA}

Document B (New):
${documentB}
`;

		const response = await ai.models.generateContent({
			model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
			contents: prompt,
			config: {
				responseMimeType: 'application/json',
				responseSchema: {
					type: Type.OBJECT,
					properties: {
						summary: {
							type: Type.STRING,
							description: 'A high-level summary of the overall changes.',
						},
						changes: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									category: { type: Type.STRING },
									documentA: {
										type: Type.STRING,
										description: 'Previous wording or meaning.',
									},
									documentB: {
										type: Type.STRING,
										description: 'New wording or meaning.',
									},
									impact: {
										type: Type.STRING,
										description: "Neutral explanation of the change's impact.",
									},
									sourceA: { type: Type.STRING },
									sourceB: { type: Type.STRING },
								},
								required: ['category', 'documentA', 'documentB', 'impact'],
							},
						},
					},
					required: ['summary', 'changes'],
				},
			},
		});

		const data = JSON.parse(response.text || '{}');
		return NextResponse.json(data);
	} catch (error: unknown) {
		console.error('AI Compare Error:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ error: `Failed to compare documents: ${message}` },
			{ status: 500 },
		);
	}
}
