import { describe, expect, it } from 'vitest';
import { cn } from '../src/lib/utils';

describe('Utility Functions', () => {
	it('cn() safely merges class names', () => {
		const result = cn(
			'bg-red-500',
			'text-white',
			null,
			undefined,
			false,
			'p-4',
		);
		expect(result).toBe('bg-red-500 text-white p-4');
	});

	it('cn() correctly processes conditional classes', () => {
		const isActive = true;
		const result = cn('base-class', isActive && 'active-class');
		expect(result).toBe('base-class active-class');
	});
});
