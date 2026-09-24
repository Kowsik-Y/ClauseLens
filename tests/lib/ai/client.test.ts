import { DEFAULT_MODEL, ai } from '@/lib/ai/client';
import { describe, expect, it } from 'vitest';

describe('AI Client', () => {
	it('initializes the client', () => {
		expect(ai).toBeDefined();
	});

	it('exports DEFAULT_MODEL', () => {
		expect(DEFAULT_MODEL).toBeDefined();
	});
});
