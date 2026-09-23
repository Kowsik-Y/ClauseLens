import { POST } from '@/app/api/qa/route';
import { ai } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { NextRequest } from 'next/server';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rateLimit', () => ({
	checkRateLimit: vi.fn(),
}));

vi.mock('@/lib/ai/client', () => ({
	ai: {
		models: {
			generateContent: vi.fn(),
		},
	},
	DEFAULT_MODEL: 'test-model',
}));

describe('QA API Route', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		(checkRateLimit as Mock).mockReturnValue(true);
	});

	const mockRequest = (body: unknown, ip = '1.2.3.4') => {
		return new NextRequest('http://localhost/api/qa', {
			method: 'POST',
			headers: { 'x-forwarded-for': ip },
			body: JSON.stringify(body),
		});
	};

	it('returns 429 when rate limit exceeded', async () => {
		(checkRateLimit as Mock).mockReturnValue(false);
		const req = mockRequest({ documentText: 'doc', question: 'q' });
		const res = await POST(req);
		expect(res.status).toBe(429);
	});

	it('returns 400 for invalid request body', async () => {
		// Missing question
		const req = mockRequest({ documentText: 'doc' });
		const res = await POST(req);
		expect(res.status).toBe(400);
	});

	it('returns 200 and parses AI response for valid request', async () => {
		const mockResponse = {
			answer: 'Yes',
			citations: ['Page 1'],
			notFound: false,
			followUps: [],
		};
		(ai.models.generateContent as Mock).mockResolvedValueOnce({
			text: JSON.stringify(mockResponse),
		});

		const req = mockRequest({ documentText: 'doc', question: 'q' });
		const res = await POST(req);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data).toEqual(mockResponse);
	});

	it('returns 500 when AI generation fails', async () => {
		(ai.models.generateContent as Mock).mockRejectedValueOnce(
			new Error('AI error'),
		);

		const req = mockRequest({ documentText: 'doc', question: 'q' });
		const res = await POST(req);
		expect(res.status).toBe(500);
	});
});
