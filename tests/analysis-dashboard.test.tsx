import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AnalysisDashboard } from '../src/components/analysis-dashboard';

const mockResult = {
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
		render(<AnalysisDashboard result={mockResult} documentText='test text' />);
		expect(screen.getByText('Executive Summary')).toBeInTheDocument();
		expect(screen.getByText('Test summary')).toBeInTheDocument();
		expect(screen.getByText('NDA')).toBeInTheDocument();
	});
});
