/**
 * Truncates text to a specified maximum length and appends an ellipsis if truncated.
 * @param text - The text to truncate
 * @param maxLength - The maximum length of the string
 * @returns The truncated text
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
}

/**
 * Extracts a short preview of the text document.
 * @param text - The full document text
 * @returns A brief preview string
 */
export function extractTextPreview(text: string): string {
	return truncateText(text, 50);
}
