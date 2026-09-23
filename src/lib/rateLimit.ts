const requestCounts = new Map<string, { count: number; resetAt: number }>();

/**
 * Checks if the given IP has exceeded the rate limit.
 * @param ip - The IP address of the requester.
 * @param max - Maximum allowed requests in the window.
 * @param windowMs - Time window in milliseconds.
 * @returns True if allowed, false if rate limited.
 */
export function checkRateLimit(
	ip: string,
	max = 10,
	windowMs = 60_000,
): boolean {
	const now = Date.now();
	const entry = requestCounts.get(ip);
	if (!entry || now > entry.resetAt) {
		requestCounts.set(ip, { count: 1, resetAt: now + windowMs });
		return true;
	}
	if (entry.count >= max) return false;
	entry.count++;
	return true;
}
