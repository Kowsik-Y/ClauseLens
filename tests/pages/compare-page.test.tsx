import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ComparePage from '@/app/compare/page';

vi.mock('@/components/compare-panel', () => ({
	ComparePanel: () => <div data-testid='compare-panel'>ComparePanel Mock</div>,
}));

describe('Compare Page', () => {
	it('renders the heading and compare panel', async () => {
		render(<ComparePage />);
		expect(screen.getByText('Compare')).toBeInTheDocument();
		expect(screen.getByText('Documents')).toBeInTheDocument();
		expect(await screen.findByTestId('compare-panel')).toBeInTheDocument();
	});
});
