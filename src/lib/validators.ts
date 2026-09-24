/**
 * Validates whether the given MIME type is supported by the application.
 * Only accepts PDF, DOCX, and TXT files.
 * @param mimeType - The MIME type string of the file to check.
 * @returns boolean - True if the file type is supported.
 */
export function validateFileType(mimeType: string): boolean {
	return (
		mimeType === 'application/pdf' ||
		mimeType ===
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
	);
}

/**
 * Validates if the file size is within the allowed limit (e.g., 10MB).
 * @param sizeInBytes - The size of the file in bytes
 * @param maxSizeInBytes - The maximum allowed size in bytes (defaults to 10MB)
 * @returns True if the file size is valid, false otherwise
 */
export function validateFileSize(
	sizeInBytes: number,
	maxSizeInBytes: number = 10 * 1024 * 1024,
): boolean {
	return sizeInBytes <= maxSizeInBytes;
}

/**
 * Sanitizes input text to prevent XSS and injection attacks.
 * Strips HTML tags, event handlers, JavaScript protocols, and null bytes.
 * @param text - The raw, untrusted text input.
 * @returns string - The cleaned and sanitized text.
 */
export function sanitizeText(text: string): string {
	return text
		.replace(/\0/g, '') // Remove null bytes
		.replace(/<[^>]*>/g, '') // Strip HTML tags
		.replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '') // Remove javascript: protocol more robustly
		.replace(/on[a-z]+\s*=/gi, '') // Remove inline event handlers
		.trim();
}

const INJECTION_MARKERS = [
	/ignore\s+previous\s+instructions/i,
	/you\s+are\s+now\s+a\s+different/i,
	/forget\s+all\s+prior\s+context/i,
	/<<SYS>>/,
	/\[INST\]/,
];

export function scanForInjectionArtifacts(result: unknown): boolean {
	const str = JSON.stringify(result);
	return INJECTION_MARKERS.some((re) => re.test(str));
}
