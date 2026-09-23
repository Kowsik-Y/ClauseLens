import { buildAnalysisPrompt, parseAnalysisResponse } from '@/lib/ai/prompts';
import { describe, expect, it } from 'vitest';

describe('buildAnalysisPrompt', () => {
	it('includes document text in prompt', () => {
		const prompt = buildAnalysisPrompt('This is a contract.');
		expect(prompt).toContain('This is a contract.');
	});

	it('requests JSON output', () => {
		const prompt = buildAnalysisPrompt('text');
		expect(prompt.toLowerCase()).toContain('json');
	});

	it('uses default Full Analysis mode', () => {
		const prompt = buildAnalysisPrompt('text');
		expect(prompt).toContain('Full Analysis');
	});

	it('accepts custom analysis mode', () => {
		const prompt = buildAnalysisPrompt('text', 'Risk Review');
		expect(prompt).toContain('Risk Review');
	});

	it('includes grounding rules in prompt', () => {
		const prompt = buildAnalysisPrompt('text');
		expect(prompt).toContain('ONLY use information');
		expect(prompt).toContain('NEVER fabricate');
	});

	it('handles empty string document', () => {
		const prompt = buildAnalysisPrompt('');
		expect(prompt).toContain('Document text:');
	});
});

describe('parseAnalysisResponse', () => {
	it('parses valid json', () => {
		const res = parseAnalysisResponse('{"test": true}') as Record<
			string,
			unknown
		>;
		expect(res.test).toBe(true);
	});

	it('strips markdown code blocks', () => {
		const res = parseAnalysisResponse('```json\n{"test": true}\n```') as Record<
			string,
			unknown
		>;
		expect(res.test).toBe(true);
	});

	it('strips code blocks with uppercase JSON tag', () => {
		const res = parseAnalysisResponse(
			'```JSON\n{"key": "value"}\n```',
		) as Record<string, unknown>;
		expect(res.key).toBe('value');
	});

	it('handles nested JSON objects', () => {
		const res = parseAnalysisResponse('{"outer": {"inner": 42}}') as Record<
			string,
			unknown
		>;
		expect(res.outer).toEqual({ inner: 42 });
	});

	it('throws on invalid JSON', () => {
		expect(() => parseAnalysisResponse('not json')).toThrow();
	});

	it('throws on empty string', () => {
		expect(() => parseAnalysisResponse('')).toThrow();
	});
});
