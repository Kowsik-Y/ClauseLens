import { DEFAULT_MODEL, ai } from '@/lib/ai/client';
import { buildAnalysisPrompt, parseAnalysisResponse } from '@/lib/ai/prompts';
import { checkRateLimit } from '@/lib/rateLimit';
import { sanitizeText } from '@/lib/validators';
import { Type } from '@google/genai';
import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const AnalyzeRequestSchema = z.object({
	documentText: z.string().min(1).max(100000),
	mode: z.string().optional().default('Full Analysis'),
});

export async function POST(req: NextRequest) {
	try {
		const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		const body = await req.json();
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
		const data = parseAnalysisResponse(rawText);
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
