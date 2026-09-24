import { POST } from '@/app/api/parse/route';
import { checkRateLimit } from '@/lib/rateLimit';
import { NextRequest } from 'next/server';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/rateLimit', () => ({
	checkRateLimit: vi.fn(),
}));

describe('Parse API Route', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		(checkRateLimit as Mock).mockReturnValue(true);
	});

	const createFormData = (file: File | null) => {
		const formData = new FormData();
		if (file) formData.append('file', file);
		return formData;
	};

	const mockRequest = (formData: FormData, ip = '1.2.3.4') => {
		const req = new NextRequest('http://localhost/api/parse', {
			method: 'POST',
			headers: { 'x-forwarded-for': ip },
		});
		req.formData = async () => formData;
		return req;
	};

	it('returns 429 when rate limit exceeded', async () => {
		(checkRateLimit as Mock).mockReturnValue(false);
		const req = mockRequest(new FormData());
		const res = await POST(req);
		expect(res.status).toBe(429);
	});

	it('returns 400 when no file provided', async () => {
		const req = mockRequest(createFormData(null));
		const res = await POST(req);
		expect(res.status).toBe(400);
		const data = await res.json();
		expect(data.error).toBe('No file provided');
	});

	it('returns 400 for unsupported file type', async () => {
		const file = new File(['fake image data'], 'image.png', {
			type: 'image/png',
		});
		const req = mockRequest(createFormData(file));
		const res = await POST(req);
		expect(res.status).toBe(400);
		const data = await res.json();
		expect(data.error).toBe(
			'Unsupported file format. Please upload PDF, DOCX, or TXT.',
		);
	});

	it('returns 200 for valid txt file', async () => {
		const file = new File(['hello world'], 'test.txt', { type: 'text/plain' });
		const req = mockRequest(createFormData(file));
		const res = await POST(req);
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data.text).toBe('hello world');
	});

	it('returns 413 for file over 5MB', async () => {
		// Mock file size to be larger than 5MB
		const file = new File([''], 'large.txt', { type: 'text/plain' });
		Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

		const req = mockRequest(createFormData(file));
		const res = await POST(req);
		expect(res.status).toBe(413);
		const data = await res.json();
		expect(data.error).toBe('File size exceeds the 5MB limit.');
	});
});
