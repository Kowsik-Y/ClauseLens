export interface KeyClause {
	title: string;
	section: string;
	page: string;
	excerpt: string;
	explanation: string;
}

export interface Risk {
	severity: 'high' | 'medium' | 'low';
	title: string;
	detail: string;
	action: string;
	page: string;
}

export interface Obligation {
	party: string;
	obligation: string;
	trigger: string;
	page: string;
}

export interface AnalysisResult {
	summary: string;
	documentType: string;
	parties: string[];
	effectiveDate?: string;
	termDuration?: string;
	keyClauses: KeyClause[];
	risks: Risk[];
	obligations: Obligation[];
	questionsForCounsel: string[];
	checklist: string[];
}

export interface QaResult {
	answer: string;
	citations: string[];
	notFound: boolean;
	followUps: string[];
}

export interface ComparisonChange {
	category: string;
	documentA: string;
	documentB: string;
	impact: string;
	sourceA: string;
	sourceB: string;
}

export interface ComparisonResult {
	summary: string;
	changes: ComparisonChange[];
}
