import { DEFAULT_MODEL, ai } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/validators';
import { Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const QaRequestSchema = z.object({
	documentText: z.string().min(1).max(100000),
	question: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
	try {
		const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		const body = await req.json();
		const parseResult = QaRequestSchema.safeParse(body);

		if (!parseResult.success) {
			return NextResponse.json(
				{ error: 'Invalid request data', details: parseResult.error.format() },
				{ status: 400 },
			);
		}

		const { documentText, question } = parseResult.data;

		const prompt = `You are a legal document copilot answering a user's question about a document.
Follow these rules strictly:
1. ONLY use information contained in the provided document to answer the question.
2. NEVER fabricate information or guess. If the answer cannot be supported by the document, set notFound to true.
3. State when the answer is not found in the document clearly.
4. Include a concise source basis in the citations array.
5. Provide 2 logical follow-up questions the user might want to ask.

User Question: ${sanitizeText(question)}

Document text:
${sanitizeText(documentText)}
`;

		const response = await ai.models.generateContent({
			model: DEFAULT_MODEL,
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
		const message =
			error instanceof Error ? error.message : 'An unexpected error occurred';
		return NextResponse.json(
			{ error: `Failed to answer question: ${message}` },
			{ status: 500 },
		);
	}
}
