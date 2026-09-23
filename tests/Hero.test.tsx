import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from '../src/components/Hero';

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
});
