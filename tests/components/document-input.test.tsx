import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DocumentInput } from '../../src/components/document-input';

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

	it('enables analyze button when text is pasted', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		const pasteTab = screen.getByText('Paste Text');
		fireEvent.click(pasteTab);

		const textarea = screen.getByPlaceholderText(
			'Paste your legal document text here...',
		);
		fireEvent.change(textarea, { target: { value: 'Sample legal document' } });

		const analyzeButton = screen.getByText('Analyze Document');
		expect(analyzeButton).not.toBeDisabled();
	});

	it('shows character count when text is entered', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		const pasteTab = screen.getByText('Paste Text');
		fireEvent.click(pasteTab);

		const textarea = screen.getByPlaceholderText(
			'Paste your legal document text here...',
		);
		fireEvent.change(textarea, {
			target: { value: 'Hello' },
		});

		expect(screen.getByText('5 characters')).toBeInTheDocument();
	});

	it('renders analysis mode selector', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		expect(screen.getByText('Analysis Mode')).toBeInTheDocument();
	});

	it('renders file drop zone with aria-label', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		expect(screen.getByLabelText('File upload drop zone')).toBeInTheDocument();
	});

	it('shows description text', () => {
		render(<DocumentInput onAnalyze={vi.fn()} />);
		expect(
			screen.getByText('Upload a PDF/DOCX or paste text for analysis.'),
		).toBeInTheDocument();
	});

	it('calls onAnalyze when button is clicked with text', () => {
		const onAnalyze = vi.fn();
		render(<DocumentInput onAnalyze={onAnalyze} />);

		const pasteTab = screen.getByText('Paste Text');
		fireEvent.click(pasteTab);

		const textarea = screen.getByPlaceholderText(
			'Paste your legal document text here...',
		);
		fireEvent.change(textarea, { target: { value: 'Legal doc text' } });

		const analyzeButton = screen.getByText('Analyze Document');
		fireEvent.click(analyzeButton);

		expect(onAnalyze).toHaveBeenCalledWith({
			text: 'Legal doc text',
			file: undefined,
			mode: 'Full Analysis',
		});
	});
});
