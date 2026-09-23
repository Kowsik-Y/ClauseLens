import { checkRateLimit } from '@/lib/rateLimit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('checkRateLimit', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('allows requests under the limit', () => {
		expect(checkRateLimit('192.168.1.1', 3, 60000)).toBe(true);
		expect(checkRateLimit('192.168.1.1', 3, 60000)).toBe(true);
		expect(checkRateLimit('192.168.1.1', 3, 60000)).toBe(true);
	});

	it('blocks requests over the limit', () => {
		checkRateLimit('10.0.0.1', 2, 60000);
		checkRateLimit('10.0.0.1', 2, 60000);
		expect(checkRateLimit('10.0.0.1', 2, 60000)).toBe(false);
	});

	it('resets after window expires', () => {
		checkRateLimit('10.0.0.2', 1, 1000);
		expect(checkRateLimit('10.0.0.2', 1, 1000)).toBe(false);

		vi.advanceTimersByTime(1100);

		expect(checkRateLimit('10.0.0.2', 1, 1000)).toBe(true);
	});

	it('tracks different IPs independently', () => {
		checkRateLimit('ip-a', 1, 60000);
		expect(checkRateLimit('ip-a', 1, 60000)).toBe(false);
		expect(checkRateLimit('ip-b', 1, 60000)).toBe(true);
	});

	it('uses default parameters when not specified', () => {
		for (let i = 0; i < 10; i++) {
			expect(checkRateLimit('default-ip')).toBe(true);
		}
		expect(checkRateLimit('default-ip')).toBe(false);
	});
});
