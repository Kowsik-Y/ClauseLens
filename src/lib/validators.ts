/**
 * Validates if the given MIME type corresponds to an accepted file type (PDF or DOCX).
 * @param mimeType - The MIME type string of the file
 * @returns True if the file type is supported, false otherwise
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
 * Sanitizes input text to remove potentially harmful characters.
 * @param text - The raw input text
 * @returns The sanitized text
 */
export function sanitizeText(text: string): string {
	// Simple sanitation logic for demonstration
	return text.replace(/[<>]/g, '');
}
