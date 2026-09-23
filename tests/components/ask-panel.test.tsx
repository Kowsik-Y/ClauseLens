import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AskPanel } from '../../src/components/ask-panel';

// Mock fetch globally
beforeEach(() => {
	global.fetch = vi.fn();
});

describe('AskPanel Component', () => {
	it('renders the title and input', () => {
		render(<AskPanel documentText='test document' />);
		expect(screen.getByText('Ask ClauseLens')).toBeInTheDocument();
		expect(
			screen.getByLabelText('Ask a question about this document'),
		).toBeInTheDocument();
	});

	it('renders suggestion buttons when no result', () => {
		render(<AskPanel documentText='test document' />);
		expect(
			screen.getByText('Can I terminate this agreement early?'),
		).toBeInTheDocument();
		expect(
			screen.getByText('What payments am I responsible for?'),
		).toBeInTheDocument();
	});

	it('renders the send button with aria-label', () => {
		render(<AskPanel documentText='test document' />);
		expect(screen.getByLabelText('Send question')).toBeInTheDocument();
	});

	it('disables send button when input is empty', () => {
		render(<AskPanel documentText='test document' />);
		expect(screen.getByLabelText('Send question')).toBeDisabled();
	});

	it('renders description text', () => {
		render(<AskPanel documentText='test document' />);
		expect(
			screen.getByText('Ask questions based exclusively on this document.'),
		).toBeInTheDocument();
	});
});
