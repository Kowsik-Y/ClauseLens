import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from '../../src/components/Header';

// Mock next/navigation
vi.mock('next/navigation', () => ({
	usePathname: () => '/analyze',
}));

describe('Header Component', () => {
	it('renders the logo and title', () => {
		render(<Header />);
		expect(screen.getByText('ClauseLens')).toBeInTheDocument();
	});

	it('renders navigation links', () => {
		render(<Header />);
		expect(screen.getByText('Analyze')).toBeInTheDocument();
		expect(screen.getByText('Compare')).toBeInTheDocument();
	});

	it('renders AI Powered badge', () => {
		render(<Header />);
		expect(screen.getByText('AI Powered')).toBeInTheDocument();
	});

	it('renders as a header element', () => {
		const { container } = render(<Header />);
		expect(container.querySelector('header')).toBeInTheDocument();
	});

	it('renders nav element', () => {
		const { container } = render(<Header />);
		expect(container.querySelector('nav')).toBeInTheDocument();
	});

	it('has correct link hrefs', () => {
		render(<Header />);
		const analyzeLink = screen.getByText('Analyze').closest('a');
		const compareLink = screen.getByText('Compare').closest('a');
		expect(analyzeLink).toHaveAttribute('href', '/analyze');
		expect(compareLink).toHaveAttribute('href', '/compare');
	});
});
