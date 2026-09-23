import { GoogleGenAI, Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';

// Ensure the API key is set in your .env or .env.local file
const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
	...(process.env.GEMINI_BASE_URL && {
		httpOptions: { baseUrl: process.env.GEMINI_BASE_URL },
	}),
});

export async function POST(req: NextRequest) {
	try {
		const { documentText, mode } = await req.json();

		if (!documentText) {
			return NextResponse.json(
				{ error: 'No document text provided' },
				{ status: 400 },
			);
		}

		if (documentText.length > 100000) {
			return NextResponse.json(
				{ error: 'Document text exceeds the 100,000 character limit.' },
				{ status: 413 },
			);
		}

		const prompt = `You are a legal document copilot. Analyze the provided legal document based on the user's request.
Follow these rules strictly:
1. ONLY use information contained in the provided document.
2. NEVER fabricate parties, dates, clauses, or citations.
3. If information is absent, indicate it.
4. Provide source citations where possible (e.g., [SECTION: Termination]).
5. Do not give legal advice; phrase things as "The document states..." or "Consider asking a professional..."
6. The mode of analysis is: ${mode}

Document text:
${documentText}
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
							description:
								'A simple-language executive summary of the document.',
						},
						documentType: {
							type: Type.STRING,
							description:
								'The type of document (e.g., NDA, Employment Agreement).',
						},
						parties: {
							type: Type.ARRAY,
							items: { type: Type.STRING },
							description: 'The parties involved in the contract.',
						},
						effectiveDate: {
							type: Type.STRING,
							description: 'The effective date of the contract.',
						},
						termDuration: {
							type: Type.STRING,
							description: 'The term or duration of the contract.',
						},
						keyClauses: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									title: { type: Type.STRING },
									section: { type: Type.STRING },
									page: { type: Type.STRING },
									excerpt: { type: Type.STRING },
									explanation: { type: Type.STRING },
								},
								required: ['title', 'excerpt', 'explanation'],
							},
						},
						risks: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									severity: {
										type: Type.STRING,
										enum: ['high', 'medium', 'low'],
									},
									title: { type: Type.STRING },
									detail: { type: Type.STRING },
									action: { type: Type.STRING },
									page: { type: Type.STRING },
								},
								required: ['severity', 'title', 'detail', 'action'],
							},
						},
						obligations: {
							type: Type.ARRAY,
							items: {
								type: Type.OBJECT,
								properties: {
									party: { type: Type.STRING },
									obligation: { type: Type.STRING },
									trigger: { type: Type.STRING },
									page: { type: Type.STRING },
								},
								required: ['party', 'obligation', 'trigger'],
							},
						},
						questionsForCounsel: {
							type: Type.ARRAY,
							items: { type: Type.STRING },
						},
						checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
					},
					required: (() => {
						switch (mode) {
							case 'Simple Summary':
								return ['summary', 'documentType'];
							case 'Risk Review':
								return ['summary', 'documentType', 'risks'];
							case 'Obligations Extract':
								return ['summary', 'documentType', 'parties', 'obligations'];
							default:
								return [
									'summary',
									'documentType',
									'parties',
									'keyClauses',
									'risks',
									'obligations',
									'questionsForCounsel',
									'checklist',
								];
						}
					})(),
				},
			},
		});

		const rawText = response.text || '{}';
		const cleanText = rawText
			.replace(/^```(json)?\s*/i, '')
			.replace(/\s*```$/i, '');
		const data = JSON.parse(cleanText);
		return NextResponse.json(data);
	} catch (error: unknown) {
		console.error('AI Analysis Error:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ error: `Failed to analyze document: ${message}` },
			{ status: 500 },
		);
	}
}
