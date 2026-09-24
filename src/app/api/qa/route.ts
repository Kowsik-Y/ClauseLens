import { DEFAULT_MODEL, ai } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText, scanForInjectionArtifacts } from '@/lib/validators';
import { type Schema, Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 60;

export const runtime = 'edge';

const QaRequestSchema = z.object({
	documentText: z.string().min(1).max(100000),
	question: z.string().min(1).max(2000),
});

const QA_RESPONSE_SCHEMA: Schema = {
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
			description: 'True if the answer cannot be found in the document.',
		},
		followUps: {
			type: Type.ARRAY,
			items: { type: Type.STRING },
			description: 'Follow-up questions.',
		},
	},
	required: ['answer', 'citations', 'notFound', 'followUps'],
};

export async function POST(req: NextRequest) {
	try {
		const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		// Limit the request body size parsing to avoid OOM
		const bodyText = await req.text();
		if (bodyText.length > 500000) {
			// 500KB max raw body size
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

		const parseResult = QaRequestSchema.safeParse(body);

		if (!parseResult.success) {
			return NextResponse.json(
				{ error: 'Invalid request data', details: parseResult.error.format() },
				{ status: 400 },
			);
		}

		const { documentText, question } = parseResult.data;

		const systemInstruction = `You are a legal document copilot answering a user's question about a document.
Follow these rules strictly:
1. ONLY use information contained in the provided document to answer the question.
2. NEVER fabricate information or guess. If the answer cannot be supported by the document, set notFound to true.
3. State when the answer is not found in the document clearly.
4. Include a concise source basis in the citations array.
5. Provide 2 logical follow-up questions the user might want to ask.

User Question: ${sanitizeText(question)}
`;

		const response = await ai.models.generateContent({
			model: DEFAULT_MODEL,
			contents: [
				{
					role: 'user',
					parts: [{ text: `Document text:\n${sanitizeText(documentText)}` }],
				},
			],
			config: {
				systemInstruction,
				responseMimeType: 'application/json',
				responseSchema: QA_RESPONSE_SCHEMA,
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
			console.warn('Injection artifacts detected in QA output');
			return NextResponse.json(
				{
					error:
						'Analysis could not be completed due to document content issues.',
				},
				{ status: 502 },
			);
		}

		// Defense in Depth: Strip any properties not explicitly requested in our QA_RESPONSE_SCHEMA
		const allowedKeys = new Set(
			Object.keys(QA_RESPONSE_SCHEMA.properties as Record<string, unknown>),
		);
		const safeData: Record<string, unknown> = {};
		for (const key of allowedKeys) {
			if (key in data) {
				safeData[key] = data[key];
			}
		}

		return NextResponse.json(safeData);
	} catch (error: unknown) {
		console.error('AI QA Error:', error);
		return NextResponse.json(
			{ error: 'An internal error occurred while answering the question.' },
			{ status: 500 },
		);
	}
}
