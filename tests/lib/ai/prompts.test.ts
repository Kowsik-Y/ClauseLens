import { describe, expect, it } from 'vitest';
import { buildAnalysisPrompt } from '@/lib/ai/prompts';

describe('buildAnalysisPrompt', () => {
	it('includes document text in prompt', () => {
		const prompt = buildAnalysisPrompt('This is a contract.');
		expect(prompt.documentText).toContain('This is a contract.');
	});

	it('requests JSON output', () => {
		const prompt = buildAnalysisPrompt('text');
		expect(prompt.systemInstruction.toLowerCase()).toContain('json');
	});

	it('uses default Full Analysis mode', () => {
		const prompt = buildAnalysisPrompt('text');
		expect(prompt.systemInstruction).toContain('Full Analysis');
	});

	it('accepts custom analysis mode', () => {
		const prompt = buildAnalysisPrompt('text', 'Risk Review');
		expect(prompt.systemInstruction).toContain('Risk Review');
	});

	it('includes grounding rules in prompt', () => {
		const prompt = buildAnalysisPrompt('text');
		expect(prompt.systemInstruction).toContain('ONLY use information');
		expect(prompt.systemInstruction).toContain('NEVER fabricate');
	});

	it('handles empty string document', () => {
		const prompt = buildAnalysisPrompt('');
		expect(prompt.documentText).toBe('');
	});

	it('truncates document text exceeding 80,000 characters', () => {
		const longText = 'a'.repeat(80005);
		const prompt = buildAnalysisPrompt(longText);
		expect(prompt.documentText).toContain('a'.repeat(80000));
		expect(prompt.documentText).not.toContain('a'.repeat(80001));
		expect(prompt.documentText).toContain('[DOCUMENT TRUNCATED DUE TO LENGTH]');
	});
});
