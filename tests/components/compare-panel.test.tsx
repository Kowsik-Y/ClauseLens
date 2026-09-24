import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComparePanel } from '../../src/components/compare-panel';

// Mock sonner
vi.mock('sonner', () => ({
	toast: {
		success: vi.fn(),
		error: vi.fn(),
	},
}));

describe('ComparePanel Component', () => {
	it('renders the empty state correctly', () => {
		render(<ComparePanel />);
		expect(screen.getByText('No Documents Compared Yet')).toBeInTheDocument();
		expect(screen.getByText('Start New Comparison')).toBeInTheDocument();
	});

	it('renders the description text', () => {
		render(<ComparePanel />);
		expect(
			screen.getByText(/Paste two versions of a legal contract/i),
		).toBeInTheDocument();
	});

	it('renders the compare icon', () => {
		render(<ComparePanel />);
		const icon = document.querySelector('.text-primary');
		expect(icon).toBeTruthy();
	});

	it('has a start comparison button', () => {
		render(<ComparePanel />);
		const button = screen.getByText('Start New Comparison');
		expect(button).toBeInTheDocument();
		expect(button.closest('button')).not.toBeDisabled();
	});

	it('opens dialog when start comparison is clicked', async () => {
		const { fireEvent } = await import('@testing-library/react');
		render(<ComparePanel />);

		const button = screen.getByText('Start New Comparison');
		fireEvent.click(button);

		expect(await screen.findByText('Document Input')).toBeInTheDocument();
		expect(
			await screen.findByPlaceholderText(/Paste original text here/),
		).toBeInTheDocument();
		expect(
			await screen.findByPlaceholderText(/Paste new text here/),
		).toBeInTheDocument();
	});

	it('disables compare button when inputs are empty', async () => {
		const { fireEvent } = await import('@testing-library/react');
		render(<ComparePanel />);

		const button = screen.getByText('Start New Comparison');
		fireEvent.click(button);

		const compareBtn = await screen.findByRole('button', {
			name: 'Compare Documents',
		});
		expect(compareBtn).toBeDisabled();
	});

	it('enables compare button when both inputs have text', async () => {
		const { fireEvent } = await import('@testing-library/react');
		render(<ComparePanel />);

		const button = screen.getByText('Start New Comparison');
		fireEvent.click(button);

		const v1 = await screen.findByPlaceholderText(/Paste original text here/);
		const v2 = await screen.findByPlaceholderText(/Paste new text here/);

		fireEvent.change(v1, { target: { value: 'Version 1' } });
		fireEvent.change(v2, { target: { value: 'Version 2' } });

		const compareBtn = await screen.findByRole('button', {
			name: 'Compare Documents',
		});
		expect(compareBtn).not.toBeDisabled();
	});

	it('handles successful comparison', async () => {
		const { fireEvent, waitFor } = await import('@testing-library/react');
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				summary: 'Test summary',
				changes: [
					{
						category: 'addition',
						documentA: 'None',
						documentB: 'New text',
						sourceA: 'pg 1',
						sourceB: 'pg 2',
						impact: 'Test impact',
					},
				],
			}),
		});

		render(<ComparePanel />);

		const button = screen.getByText('Start New Comparison');
		fireEvent.click(button);

		const v1 = await screen.findByPlaceholderText(/Paste original text here/);
		const v2 = await screen.findByPlaceholderText(/Paste new text here/);

		fireEvent.change(v1, { target: { value: 'Version 1' } });
		fireEvent.change(v2, { target: { value: 'Version 2' } });

		const compareBtn = await screen.findByRole('button', {
			name: 'Compare Documents',
		});
		fireEvent.click(compareBtn);

		await waitFor(() => {
			expect(screen.getByText('Test summary')).toBeInTheDocument();
			expect(screen.getByText('addition')).toBeInTheDocument();
		});
	});

	it('handles comparison error', async () => {
		const { fireEvent, waitFor } = await import('@testing-library/react');
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		render(<ComparePanel />);

		const button = screen.getByText('Start New Comparison');
		fireEvent.click(button);

		const v1 = await screen.findByPlaceholderText(/Paste original text here/);
		const v2 = await screen.findByPlaceholderText(/Paste new text here/);

		fireEvent.change(v1, { target: { value: 'Version 1' } });
		fireEvent.change(v2, { target: { value: 'Version 2' } });

		const compareBtn = await screen.findByRole('button', {
			name: 'Compare Documents',
		});
		fireEvent.click(compareBtn);

		await waitFor(() => {
			expect(
				screen.getByText(/Failed to compare documents/i),
			).toBeInTheDocument();
		});
	});
});
