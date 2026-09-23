import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChecklistPanel } from '../../src/components/checklist-panel';

describe('ChecklistPanel Component', () => {
	it('renders checklist items', () => {
		render(
			<ChecklistPanel
				checklist={['Review termination clause', 'Check payment terms']}
				questions={[]}
			/>,
		);
		expect(screen.getByText('Review termination clause')).toBeInTheDocument();
		expect(screen.getByText('Check payment terms')).toBeInTheDocument();
	});

	it('renders the title', () => {
		render(<ChecklistPanel checklist={['item 1']} questions={[]} />);
		expect(screen.getByText('Action Checklist')).toBeInTheDocument();
	});

	it('shows empty state when no items', () => {
		render(<ChecklistPanel checklist={[]} questions={[]} />);
		expect(screen.getByText('No actions identified.')).toBeInTheDocument();
	});

	it('renders prepare for legal review button when questions exist', () => {
		render(
			<ChecklistPanel
				checklist={['item']}
				questions={['What is the dispute resolution process?']}
			/>,
		);
		expect(screen.getByText('Prepare for legal review')).toBeInTheDocument();
	});

	it('does not show prepare button when no questions', () => {
		render(<ChecklistPanel checklist={['item']} questions={[]} />);
		expect(
			screen.queryByText('Prepare for legal review'),
		).not.toBeInTheDocument();
	});

	it('renders checkboxes for each item', () => {
		render(<ChecklistPanel checklist={['task 1', 'task 2']} questions={[]} />);
		const checkboxes = screen.getAllByRole('checkbox');
		expect(checkboxes).toHaveLength(2);
	});
});
