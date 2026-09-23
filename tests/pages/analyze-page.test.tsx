import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import AnalyzePage from '../../src/app/analyze/page';

vi.mock('next/dynamic', () => ({
	default: (dynamicImport: unknown) => {
		if (String(dynamicImport).includes('analysis-dashboard')) {
			return function MockDashboard() {
				return <div data-testid='mock-dashboard'>Dashboard</div>;
			};
		}
		if (String(dynamicImport).includes('document-input')) {
			return function MockDocumentInput({
				onAnalyze,
			}: { onAnalyze: (data: unknown) => void }) {
				return (
					<button
						type='button'
						data-testid='mock-analyze-btn'
						onClick={() =>
							onAnalyze({ text: 'test document', mode: 'Full Analysis' })
						}
					>
						Mock Analyze
					</button>
				);
			};
		}
		return function MockComponent() {
			return <div />;
		};
	},
}));

vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe('AnalyzePage Component', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		global.fetch = vi.fn();
	});

	it('renders the page title', () => {
		render(<AnalyzePage />);
		expect(screen.getByText('Document Analysis')).toBeInTheDocument();
	});

	it('renders the description text', () => {
		render(<AnalyzePage />);
		expect(
			screen.getByText(/Upload or paste a legal document/i),
		).toBeInTheDocument();
	});

	it('renders empty state initially', () => {
		render(<AnalyzePage />);
		expect(screen.getByText('No Document Analyzed Yet')).toBeInTheDocument();
	});

	it('renders start new analysis button', () => {
		render(<AnalyzePage />);
		expect(screen.getByText('Start New Analysis')).toBeInTheDocument();
	});

	it('shows error toast when API fails', async () => {
		(global.fetch as Mock).mockResolvedValueOnce({
			ok: false,
			status: 500,
		});

		render(<AnalyzePage />);

		const startBtn = screen.getByText('Start New Analysis');
		fireEvent.click(startBtn);

		const mockAnalyzeBtn = await screen.findByTestId('mock-analyze-btn');
		fireEvent.click(mockAnalyzeBtn);

		expect(
			screen.getByText('Analyzing document with AI...'),
		).toBeInTheDocument();

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith('Failed to analyze document.');
		});

		expect(
			screen.queryByText('Analyzing document with AI...'),
		).not.toBeInTheDocument();
	});

	it('shows success toast on successful analysis', async () => {
		(global.fetch as Mock).mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve({
					summary: 'Test',
					documentType: 'NDA',
					parties: [],
					risks: [],
					keyClauses: [],
					obligations: [],
					checklist: [],
					questionsForCounsel: [],
				}),
		});

		render(<AnalyzePage />);

		const startBtn = screen.getByText('Start New Analysis');
		fireEvent.click(startBtn);

		const mockAnalyzeBtn = await screen.findByTestId('mock-analyze-btn');
		fireEvent.click(mockAnalyzeBtn);

		await waitFor(() => {
			expect(toast.success).toHaveBeenCalledWith('Analysis complete!');
		});
	});

	it('shows aria-busy during analysis', async () => {
		let resolvePromise: (value: unknown) => void = () => {};
		(global.fetch as Mock).mockReturnValueOnce(
			new Promise((resolve) => {
				resolvePromise = resolve;
			}),
		);

		render(<AnalyzePage />);

		const startBtn = screen.getByText('Start New Analysis');
		fireEvent.click(startBtn);

		const mockAnalyzeBtn = await screen.findByTestId('mock-analyze-btn');
		fireEvent.click(mockAnalyzeBtn);

		const loadingDiv = screen
			.getByText('Analyzing document with AI...')
			.closest('[aria-busy]');
		expect(loadingDiv).toHaveAttribute('aria-busy', 'true');

		// Clean up
		resolvePromise?.({ ok: false, status: 500 });
	});
});
