import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { toast } from 'sonner';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import AnalyzePage from '../src/app/analyze/page';

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
});
