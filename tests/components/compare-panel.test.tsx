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
});
