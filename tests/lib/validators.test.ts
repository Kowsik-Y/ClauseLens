import { describe, expect, it } from 'vitest';
import {
	sanitizeText,
	validateFileSize,
	validateFileType,
} from '@/lib/validators';

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
	it('rejects image files', () => {
		expect(validateFileType('image/png')).toBe(false);
	});
	it('rejects plain text', () => {
		expect(validateFileType('text/plain')).toBe(false);
	});
	it('rejects empty string', () => {
		expect(validateFileType('')).toBe(false);
	});
});

describe('validateFileSize', () => {
	it('rejects files over 10MB', () => {
		expect(validateFileSize(11 * 1024 * 1024)).toBe(false);
	});
	it('accepts files under 10MB', () => {
		expect(validateFileSize(5 * 1024 * 1024)).toBe(true);
	});
	it('accepts files exactly at 10MB', () => {
		expect(validateFileSize(10 * 1024 * 1024)).toBe(true);
	});
	it('accepts custom max size', () => {
		expect(validateFileSize(500, 1000)).toBe(true);
	});
	it('rejects custom max size when exceeded', () => {
		expect(validateFileSize(1500, 1000)).toBe(false);
	});
	it('accepts zero byte file', () => {
		expect(validateFileSize(0)).toBe(true);
	});
});

describe('sanitizeText', () => {
	it('removes html tags', () => {
		expect(sanitizeText('<script>alert("hi")</script>')).not.toContain(
			'<script>',
		);
	});
	it('removes null bytes', () => {
		expect(sanitizeText('hello\0world')).toBe('helloworld');
	});
	it('removes javascript: protocol', () => {
		expect(sanitizeText('javascript:alert(1)')).not.toContain('javascript:');
	});
	it('removes inline event handlers', () => {
		expect(sanitizeText('onclick= alert(1)')).not.toContain('onclick=');
	});
	it('trims whitespace', () => {
		expect(sanitizeText('  hello  ')).toBe('hello');
	});
	it('preserves normal text', () => {
		expect(sanitizeText('This is a legal document.')).toBe(
			'This is a legal document.',
		);
	});
	it('handles empty string', () => {
		expect(sanitizeText('')).toBe('');
	});
	it('strips nested HTML tags', () => {
		expect(sanitizeText('<div><p>text</p></div>')).toBe('text');
	});
});
