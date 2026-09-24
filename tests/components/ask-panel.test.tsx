import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

	it('handles typing and submitting a question', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				answer: 'Test answer',
				citations: ['Sec 1'],
				followUps: ['Next question?'],
			}),
		});

		render(<AskPanel documentText='Test document text' />);

		const input = screen.getByLabelText('Ask a question about this document');
		fireEvent.change(input, { target: { value: 'What is this?' } });

		const button = screen.getByLabelText('Send question');
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText('Test answer')).toBeInTheDocument();
			expect(screen.getByText('Sec 1')).toBeInTheDocument();
			expect(screen.getByText('Next question?')).toBeInTheDocument();
		});
	});

	it('handles suggestion click', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({
				answer: 'Suggestion answer',
			}),
		});

		render(<AskPanel documentText='Test document text' />);

		const suggestion = screen.getByText(
			'Can I terminate this agreement early?',
		);
		fireEvent.click(suggestion);

		await waitFor(() => {
			expect(screen.getByText('Suggestion answer')).toBeInTheDocument();
		});
	});

	it('handles error response', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
		});

		render(<AskPanel documentText='Test document text' />);

		const input = screen.getByLabelText('Ask a question about this document');
		fireEvent.change(input, { target: { value: 'What is this?' } });

		const button = screen.getByLabelText('Send question');
		fireEvent.click(button);

		await waitFor(() => {
			expect(screen.getByText('Failed to get an answer.')).toBeInTheDocument();
		});
	});
});
