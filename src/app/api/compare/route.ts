import { DEFAULT_MODEL, ai } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/validators';
import { Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'edge';

const CompareRequestSchema = z.object({
	documentA: z.string().min(1).max(100000),
	documentB: z.string().min(1).max(100000),
});

export async function POST(req: NextRequest) {
	try {
		const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		const body = await req.json();
		const parseResult = CompareRequestSchema.safeParse(body);

		if (!parseResult.success) {
			return NextResponse.json(
				{ error: 'Invalid request data', details: parseResult.error.format() },
				{ status: 400 },
			);
		}

		const { documentA, documentB } = parseResult.data;

		const prompt = `You are a legal document copilot comparing two versions of a contract.
Identify the meaningful changes between Document A (Original) and Document B (New).

Rules:
1. Do not claim one contract is universally "better".
2. Use neutral descriptions of the impact (e.g., "Document B introduces an additional termination notice requirement").
3. Focus on important categories: payment, dates, termination, liability, confidentiality, renewal, intellectual property, data usage, dispute resolution.
4. Ignore minor formatting or trivial word changes that don't affect legal meaning.

Document A (Original):
${sanitizeText(documentA)}

Document B (New):
${sanitizeText(documentB)}
`;

		const response = await ai.models.generateContent({
			model: DEFAULT_MODEL,
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
		const message =
			error instanceof Error ? error.message : 'An unexpected error occurred';
		return NextResponse.json(
			{ error: `Failed to compare documents: ${message}` },
			{ status: 500 },
		);
	}
}
