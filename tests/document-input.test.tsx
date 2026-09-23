import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DocumentInput } from '../src/components/document-input';

describe('DocumentInput Component', () => {
	it('renders upload and paste tabs', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		expect(screen.getByText('Document Input')).toBeInTheDocument();
		expect(screen.getByText('Upload File')).toBeInTheDocument();
		expect(screen.getByText('Paste Text')).toBeInTheDocument();
	});

	it('switches to paste tab', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		const pasteTab = screen.getByText('Paste Text');
		fireEvent.click(pasteTab);
		expect(
			screen.getByPlaceholderText('Paste your legal document text here...'),
		).toBeInTheDocument();
	});

	it('disables analyze button initially', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		const analyzeButton = screen.getByText('Analyze Document');
		expect(analyzeButton).toBeDisabled();
	});
});
