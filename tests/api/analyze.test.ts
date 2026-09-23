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
});

describe('parseAnalysisResponse', () => {
	it('parses valid json', () => {
		const res = parseAnalysisResponse('{"test": true}') as Record<string, unknown>;
		expect(res.test).toBe(true);
	});
	it('strips markdown code blocks', () => {
		const res = parseAnalysisResponse('```json\n{"test": true}\n```') as Record<string, unknown>;
		expect(res.test).toBe(true);
	});
});
