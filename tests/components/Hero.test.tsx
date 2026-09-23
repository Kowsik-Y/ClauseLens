import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '../../src/components/Hero';

describe('Hero Component', () => {
	it('renders the main heading', () => {
		render(<Hero />);
		expect(screen.getByText(/Understand the fine print/i)).toBeInTheDocument();
		expect(screen.getByText(/before you sign./i)).toBeInTheDocument();
	});

	it('renders call to action buttons', () => {
		render(<Hero />);
		expect(screen.getByText('Analyze a Document')).toBeInTheDocument();
		expect(screen.getByText('Compare Documents')).toBeInTheDocument();
	});

	it('renders badges', () => {
		render(<Hero />);
		expect(screen.getByText('Document Grounded')).toBeInTheDocument();
		expect(screen.getByText('Risk Detection')).toBeInTheDocument();
	});

	it('renders the legal disclaimer badge', () => {
		render(<Hero />);
		expect(
			screen.getByText(
				'This tool provides legal information, not legal advice.',
			),
		).toBeInTheDocument();
	});

	it('renders source citations badge', () => {
		render(<Hero />);
		expect(screen.getByText('Source Citations')).toBeInTheDocument();
	});

	it('renders AI Assisted badge', () => {
		render(<Hero />);
		expect(screen.getByText('AI Assisted')).toBeInTheDocument();
	});

	it('has correct link targets', () => {
		render(<Hero />);
		const analyzeLink = screen.getByText('Analyze a Document').closest('a');
		const compareLink = screen.getByText('Compare Documents').closest('a');
		expect(analyzeLink).toHaveAttribute('href', '/analyze');
		expect(compareLink).toHaveAttribute('href', '/compare');
	});

	it('renders as a section element', () => {
		const { container } = render(<Hero />);
		expect(container.querySelector('section')).toBeInTheDocument();
	});
});
