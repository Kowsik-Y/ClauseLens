import { describe, expect, it } from 'vitest';
import { ai, DEFAULT_MODEL } from '@/lib/ai/client';

describe('AI Client', () => {
	it('initializes the client', () => {
		expect(ai).toBeDefined();
	});

	it('exports DEFAULT_MODEL', () => {
		expect(DEFAULT_MODEL).toBeDefined();
	});
});
