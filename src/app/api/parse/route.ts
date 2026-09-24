import { type NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
	try {
		const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
		}

		const formData = await req.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		}

		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'File size exceeds the 5MB limit.' },
				{ status: 413 },
			);
		}

		const buffer = Buffer.from(await file.arrayBuffer());
		let text = '';

		if (file.name.endsWith('.pdf') || file.type === 'application/pdf') {
			const mod = await import('pdf-parse');
			const pdfParse = ('default' in mod ? mod.default : mod) as unknown as (
				buffer: Buffer,
			) => Promise<{ text: string }>;
			const pdfData = await pdfParse(buffer);
			text = pdfData.text;
		} else if (
			file.name.endsWith('.docx') ||
			file.type.includes('wordprocessingml.document')
		) {
			const mammoth = await import('mammoth');
			const result = await mammoth.extractRawText({ buffer });
			text = result.value;
		} else if (file.name.endsWith('.txt') || file.type.includes('text')) {
			text = buffer.toString('utf-8');
		} else {
			return NextResponse.json(
				{ error: 'Unsupported file format. Please upload PDF, DOCX, or TXT.' },
				{ status: 400 },
			);
		}

		if (!text.trim()) {
			return NextResponse.json(
				{ error: 'Could not extract text from the file.' },
				{ status: 400 },
			);
		}

		return NextResponse.json({ text });
	} catch (error: unknown) {
		console.error('Parse Error:', error);
		const message = error instanceof Error ? error.message : 'Unknown error';
		return NextResponse.json(
			{ error: `Failed to parse document: ${message}` },
			{ status: 500 },
		);
	}
}
