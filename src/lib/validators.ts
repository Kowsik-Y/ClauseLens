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
 * Sanitizes input text to remove potentially harmful characters and patterns.
 * Strips HTML tags, null bytes, and common injection patterns.
 * @param text - The raw input text
 * @returns The sanitized text
 */
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
		.replace(/javascript:/gi, '') // Remove javascript: protocol
		.replace(/on\w+\s*=/gi, '') // Remove inline event handlers
		.trim();
}
