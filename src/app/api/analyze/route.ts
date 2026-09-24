import { DEFAULT_MODEL, ai } from '@/lib/ai/client';
import { buildAnalysisPrompt } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText, scanForInjectionArtifacts } from '@/lib/validators';
import { Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 60;

export const runtime = 'edge';

const AnalyzeRequestSchema = z.object({
	documentText: z.string().min(1).max(100000),
	mode: z.string().optional().default('Full Analysis'),
});

const BASE_SCHEMA_PROPERTIES = {
	summary: {
		type: Type.STRING,
		description: 'A simple-language executive summary of the document.',
	},
	documentType: {
		type: Type.STRING,
		description: 'The type of document (e.g., NDA, Employment Agreement).',
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
};

function getRequiredFields(mode: string): string[] {
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
}

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

		const parseResult = AnalyzeRequestSchema.safeParse(body);

		if (!parseResult.success) {
			return NextResponse.json(
				{ error: 'Invalid request data', details: parseResult.error.format() },
				{ status: 400 },
			);
		}

		const { documentText, mode } = parseResult.data;

		const prompt = buildAnalysisPrompt(sanitizeText(documentText), mode);

		const response = await ai.models.generateContent({
			model: DEFAULT_MODEL,
			contents: [
				{
					role: 'user',
					parts: [{ text: prompt.documentText }],
				},
			],
			config: {
				systemInstruction: prompt.systemInstruction,
				responseMimeType: 'application/json',
				responseSchema: {
					type: Type.OBJECT,
					properties: BASE_SCHEMA_PROPERTIES,
					required: getRequiredFields(mode),
				},
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
			console.warn('Injection artifacts detected in output');
			return NextResponse.json(
				{
					error:
						'Analysis could not be completed due to document content issues.',
				},
				{ status: 502 },
			);
		}

		// Defense in Depth: Strip any properties not explicitly requested in our BASE_SCHEMA_PROPERTIES
		// This matches contextualis' strict schema validation and prevents prototype pollution.
		const allowedKeys = new Set(Object.keys(BASE_SCHEMA_PROPERTIES));
		const safeData: Record<string, unknown> = {};
		for (const key of allowedKeys) {
			if (key in data) {
				safeData[key] = data[key];
			}
		}

		return NextResponse.json(safeData);
	} catch (error: unknown) {
		console.error('AI Analysis Error:', error);
		// Return a generic error message to prevent leaking internal details
		return NextResponse.json(
			{ error: 'An internal error occurred during analysis.' },
			{ status: 500 },
		);
	}
}
