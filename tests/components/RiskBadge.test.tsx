import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RiskBadge } from '@/components/RiskBadge';

describe('RiskBadge', () => {
	it('renders HIGH severity correctly', () => {
		render(<RiskBadge severity='HIGH' />);
		expect(screen.getByText(/high/i)).toBeInTheDocument();
	});
	it('renders LOW severity correctly', () => {
		render(<RiskBadge severity='LOW' />);
		expect(screen.getByText(/low/i)).toBeInTheDocument();
	});
});
