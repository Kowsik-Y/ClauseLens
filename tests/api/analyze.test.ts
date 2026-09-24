import { POST } from '@/app/api/analyze/route';
import { ai } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rateLimit';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/ai/client', () => ({
	ai: {
		models: {
			generateContent: vi.fn(),
		},
	},
	DEFAULT_MODEL: 'gemini-2.5-flash',
}));

vi.mock('@/lib/rateLimit', () => ({
	checkRateLimit: vi.fn(),
}));

describe('Analyze API Route', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns 429 if rate limit is exceeded', async () => {
		vi.mocked(checkRateLimit).mockReturnValue(false);

		const req = new NextRequest('http://localhost/api/analyze', {
			method: 'POST',
			body: JSON.stringify({ documentText: 'test' }),
		});

		req.headers.set('x-forwarded-for', '127.0.0.1');

		const res = await POST(req);
		expect(res.status).toBe(429);
	});

	it('returns 400 for invalid request body', async () => {
		vi.mocked(checkRateLimit).mockReturnValue(true);

		const req = new NextRequest('http://localhost/api/analyze', {
			method: 'POST',
			body: JSON.stringify({}),
		});

		const res = await POST(req);
		expect(res.status).toBe(400);
	});

	it('returns 200 and data on successful analysis', async () => {
		vi.mocked(checkRateLimit).mockReturnValue(true);

		const mockResponse = { summary: 'Test summary' };
		vi.mocked(ai.models.generateContent).mockResolvedValue({
			text: JSON.stringify(mockResponse),
		} as never);

		const req = new NextRequest('http://localhost/api/analyze', {
			method: 'POST',
			body: JSON.stringify({
				documentText: 'Test contract content',
				mode: 'Simple Summary',
			}),
		});

		const res = await POST(req);
		expect(res.status).toBe(200);

		const json = await res.json();
		expect(json).toEqual(mockResponse);
	});

	it('handles Simple Summary mode', async () => {
		vi.mocked(checkRateLimit).mockReturnValue(true);

		const mockResponse = { summary: 'Test summary' };
		vi.mocked(ai.models.generateContent).mockResolvedValue({
			text: JSON.stringify(mockResponse),
		} as never);

		const req = new NextRequest('http://localhost/api/analyze', {
			method: 'POST',
			body: JSON.stringify({ documentText: 'Test', mode: 'Simple Summary' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(200);
	});

	it('handles Risk Review mode', async () => {
		vi.mocked(checkRateLimit).mockReturnValue(true);

		const mockResponse = { summary: 'Test summary' };
		vi.mocked(ai.models.generateContent).mockResolvedValue({
			text: JSON.stringify(mockResponse),
		} as never);

		const req = new NextRequest('http://localhost/api/analyze', {
			method: 'POST',
			body: JSON.stringify({ documentText: 'Test', mode: 'Risk Review' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(200);
	});

	it('handles Obligations Extract mode', async () => {
		vi.mocked(checkRateLimit).mockReturnValue(true);

		const mockResponse = { summary: 'Test summary' };
		vi.mocked(ai.models.generateContent).mockResolvedValue({
			text: JSON.stringify(mockResponse),
		} as never);

		const req = new NextRequest('http://localhost/api/analyze', {
			method: 'POST',
			body: JSON.stringify({
				documentText: 'Test',
				mode: 'Obligations Extract',
			}),
		});

		const res = await POST(req);
		expect(res.status).toBe(200);
	});

	it('returns 500 when AI generation fails', async () => {
		vi.mocked(checkRateLimit).mockReturnValue(true);
		vi.mocked(ai.models.generateContent).mockRejectedValue(
			new Error('AI failed'),
		);

		const req = new NextRequest('http://localhost/api/analyze', {
			method: 'POST',
			body: JSON.stringify({ documentText: 'Test contract content' }),
		});

		const res = await POST(req);
		expect(res.status).toBe(500);
	});
});
