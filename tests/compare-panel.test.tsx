import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ComparePanel } from '../src/components/compare-panel';

describe('ComparePanel Component', () => {
	it('renders the empty state correctly', () => {
		render(<ComparePanel />);
		expect(screen.getByText('No Documents Compared Yet')).toBeInTheDocument();
		expect(screen.getByText('Start New Comparison')).toBeInTheDocument();
	});
});
