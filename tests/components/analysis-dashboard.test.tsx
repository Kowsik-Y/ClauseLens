import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnalysisDashboard } from '../../src/components/analysis-dashboard';

const baseResult = {
	summary: 'Test summary',
	documentType: 'NDA',
	parties: ['Company A', 'Company B'],
	effectiveDate: '2023-01-01',
	termDuration: '1 year',
	risks: [],
	keyClauses: [],
	obligations: [],
	checklist: [],
	questionsForCounsel: [],
};

describe('AnalysisDashboard Component', () => {
	it('renders the executive summary', () => {
		render(<AnalysisDashboard result={baseResult} documentText='test text' />);
		expect(screen.getByText('Executive Summary')).toBeInTheDocument();
		expect(screen.getByText('Test summary')).toBeInTheDocument();
		expect(screen.getByText('NDA')).toBeInTheDocument();
	});

	it('renders parties information', () => {
		render(<AnalysisDashboard result={baseResult} documentText='test text' />);
		expect(screen.getByText('Company A vs Company B')).toBeInTheDocument();
	});

	it('renders effective date', () => {
		render(<AnalysisDashboard result={baseResult} documentText='test text' />);
		expect(screen.getByText('2023-01-01')).toBeInTheDocument();
	});

	it('renders term duration', () => {
		render(<AnalysisDashboard result={baseResult} documentText='test text' />);
		expect(screen.getByText('1 year')).toBeInTheDocument();
	});

	it('renders risks when present', () => {
		const resultWithRisks = {
			...baseResult,
			risks: [
				{
					severity: 'high' as const,
					title: 'Auto-Renewal Risk',
					detail: 'Contract renews automatically',
					action: 'Negotiate an opt-out clause',
					page: 'Page 5',
				},
			],
		};
		render(
			<AnalysisDashboard result={resultWithRisks} documentText='test text' />,
		);
		expect(screen.getByText('Risk Center')).toBeInTheDocument();
		expect(screen.getByText('Auto-Renewal Risk')).toBeInTheDocument();
		expect(
			screen.getByText('Contract renews automatically'),
		).toBeInTheDocument();
	});

	it('hides risks section when empty', () => {
		render(<AnalysisDashboard result={baseResult} documentText='test text' />);
		expect(screen.queryByText('Risk Center')).not.toBeInTheDocument();
	});

	it('renders key clauses when present', () => {
		const resultWithClauses = {
			...baseResult,
			keyClauses: [
				{
					title: 'Termination Clause',
					section: 'Section 5',
					page: 'Page 3',
					excerpt: 'Either party may terminate...',
					explanation: 'Allows early termination by either party.',
				},
			],
		};
		render(
			<AnalysisDashboard result={resultWithClauses} documentText='test text' />,
		);
		expect(screen.getByText('Key Clauses')).toBeInTheDocument();
		expect(screen.getByText('Termination Clause')).toBeInTheDocument();
	});

	it('hides key clauses section when empty', () => {
		render(<AnalysisDashboard result={baseResult} documentText='test text' />);
		expect(screen.queryByText('Key Clauses')).not.toBeInTheDocument();
	});

	it('renders obligations table when present', () => {
		const resultWithObligations = {
			...baseResult,
			obligations: [
				{
					party: 'Client',
					obligation: 'Pay monthly fee',
					trigger: '1st of each month',
					page: 'Page 7',
				},
			],
		};
		render(
			<AnalysisDashboard
				result={resultWithObligations}
				documentText='test text'
			/>,
		);
		expect(screen.getByText('Obligations')).toBeInTheDocument();
		expect(screen.getByText('Client')).toBeInTheDocument();
		expect(screen.getByText('Pay monthly fee')).toBeInTheDocument();
	});

	it('uses semantic table for obligations', () => {
		const resultWithObligations = {
			...baseResult,
			obligations: [
				{
					party: 'Vendor',
					obligation: 'Deliver goods',
					trigger: 'Upon order',
					page: 'Page 2',
				},
			],
		};
		const { container } = render(
			<AnalysisDashboard
				result={resultWithObligations}
				documentText='test text'
			/>,
		);
		expect(container.querySelector('table')).toBeInTheDocument();
		expect(container.querySelector('thead')).toBeInTheDocument();
		expect(container.querySelector('tbody')).toBeInTheDocument();
	});

	it('renders chat toggle button with aria-label', () => {
		render(<AnalysisDashboard result={baseResult} documentText='test text' />);
		expect(screen.getByLabelText('Toggle Chat')).toBeInTheDocument();
	});

	it('shows "Not identified" for missing fields', () => {
		const minimal = {
			...baseResult,
			parties: [],
			effectiveDate: undefined,
			termDuration: undefined,
		};
		render(<AnalysisDashboard result={minimal} documentText='test text' />);
		const notIdentified = screen.getAllByText('Not identified');
		expect(notIdentified.length).toBeGreaterThanOrEqual(2);
	});
});
