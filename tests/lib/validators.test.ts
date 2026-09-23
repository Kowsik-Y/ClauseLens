import {
	sanitizeText,
	validateFileSize,
	validateFileType,
} from '@/lib/validators';
import { describe, expect, it } from 'vitest';

describe('validateFileType', () => {
	it('accepts PDF files', () => {
		expect(validateFileType('application/pdf')).toBe(true);
	});
	it('accepts DOCX files', () => {
		expect(
			validateFileType(
				'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			),
		).toBe(true);
	});
	it('rejects other file types', () => {
		expect(validateFileType('image/png')).toBe(false);
	});
});

describe('validateFileSize', () => {
	it('rejects files over 10MB', () => {
		expect(validateFileSize(11 * 1024 * 1024)).toBe(false);
	});
	it('accepts files under 10MB', () => {
		expect(validateFileSize(5 * 1024 * 1024)).toBe(true);
	});
});

describe('sanitizeText', () => {
	it('removes html tags', () => {
		expect(sanitizeText('<script>alert("hi")</script>')).not.toContain('<');
	});
});
