import { extractTextPreview, truncateText } from '@/lib/parsers';
import { describe, expect, it } from 'vitest';

describe('truncateText', () => {
	it('truncates text longer than limit', () => {
		const long = 'a'.repeat(200);
		expect(truncateText(long, 100).length).toBeLessThanOrEqual(103);
	});
	it('does not truncate short text', () => {
		expect(truncateText('short', 100)).toBe('short');
	});
});

describe('extractTextPreview', () => {
	it('returns a preview', () => {
		expect(extractTextPreview('a'.repeat(100)).length).toBeLessThanOrEqual(53);
	});
});
