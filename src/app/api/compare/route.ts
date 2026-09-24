import { DEFAULT_MODEL, ai } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText, scanForInjectionArtifacts } from '@/lib/validators';
import { type Schema, Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 60;

export const runtime = 'edge';

const CompareRequestSchema = z.object({
	documentA: z.string().min(1).max(100000),
	documentB: z.string().min(1).max(100000),
});

const COMPARE_RESPONSE_SCHEMA: Schema = {
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
};

export async function POST(req: NextRequest) {
	try {
		const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		// Limit the request body size parsing to avoid OOM
		const bodyText = await req.text();
		if (bodyText.length > 1000000) {
			// 1MB max raw body size
			return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
		}

		const body = (() => {
			try {
				return JSON.parse(bodyText);
			} catch {
				return null;
			}
		})();

		if (!body) {
			return NextResponse.json(
				{ error: 'Invalid JSON payload' },
				{ status: 400 },
			);
		}

		const parseResult = CompareRequestSchema.safeParse(body);

		if (!parseResult.success) {
			return NextResponse.json(
				{ error: 'Invalid request data', details: parseResult.error.format() },
				{ status: 400 },
			);
		}

		const { documentA, documentB } = parseResult.data;

		const systemInstruction = `You are a legal document copilot comparing two versions of a contract.
Identify the meaningful changes between Document A (Original) and Document B (New).

Rules:
1. Do not claim one contract is universally "better".
2. Use neutral descriptions of the impact (e.g., "Document B introduces an additional termination notice requirement").
3. Focus on important categories: payment, dates, termination, liability, confidentiality, renewal, intellectual property, data usage, dispute resolution.
4. Ignore minor formatting or trivial word changes that don't affect legal meaning.`;

		const response = await ai.models.generateContent({
			model: DEFAULT_MODEL,
			contents: [
				{
					role: 'user',
					parts: [
						{
							text: `Document A (Original):\n${sanitizeText(documentA)}\n\nDocument B (New):\n${sanitizeText(documentB)}`,
						},
					],
				},
			],
			config: {
				systemInstruction,
				responseMimeType: 'application/json',
				responseSchema: COMPARE_RESPONSE_SCHEMA,
			},
		});

		const rawText = response.text || '{}';
		const data = (() => {
			try {
				return JSON.parse(rawText);
			} catch {
				return null;
			}
		})();

		if (!data) {
			return NextResponse.json(
				{
					error:
						'Live analysis unavailable. The service returned an invalid response format.',
				},
				{ status: 502 },
			);
		}

		if (scanForInjectionArtifacts(data)) {
			console.warn('Injection artifacts detected in Compare output');
			return NextResponse.json(
				{
					error:
						'Analysis could not be completed due to document content issues.',
				},
				{ status: 502 },
			);
		}

		// Defense in Depth: Strip any properties not explicitly requested in our COMPARE_RESPONSE_SCHEMA
		const allowedKeys = new Set(
			Object.keys(
				COMPARE_RESPONSE_SCHEMA.properties as Record<string, unknown>,
			),
		);
		const safeData: Record<string, unknown> = {};
		for (const key of allowedKeys) {
			if (key in data) {
				safeData[key] = data[key];
			}
		}

		return NextResponse.json(safeData);
	} catch (error: unknown) {
		console.error('AI Compare Error:', error);
		return NextResponse.json(
			{ error: 'An internal error occurred during comparison.' },
			{ status: 500 },
		);
	}
}
