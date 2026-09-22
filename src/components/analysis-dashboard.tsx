import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { AnalysisResult } from '@/lib/types';
import {
	AlertCircle,
	AlertTriangle,
	CheckCircle2,
	FileText,
	Info,
} from 'lucide-react';
import { AskPanel } from './ask-panel';
import { ChecklistPanel } from './checklist-panel';

function getSeverityColor(severity: string) {
	switch (severity.toLowerCase()) {
		case 'high':
			return 'destructive';
		case 'medium':
			return 'warning';
		case 'low':
			return 'secondary';
		default:
			return 'default';
	}
}

function getSeverityIcon(severity: string) {
	switch (severity.toLowerCase()) {
		case 'high':
			return <AlertCircle className='w-4 h-4 text-destructive' />;
		case 'medium':
			return <AlertTriangle className='w-4 h-4 text-amber-500' />;
		case 'low':
			return <Info className='w-4 h-4 text-blue-500' />;
		default:
			return <Info className='w-4 h-4' />;
	}
}

export function AnalysisDashboard({
	result,
	documentText,
}: { result: AnalysisResult; documentText: string }) {
	return (
		<div className='space-y-6'>
			{/* Executive Summary */}
			<Card className='border-border/60 shadow-sm'>
				<CardHeader className='pb-3'>
					<CardTitle className='text-2xl flex items-center gap-2'>
						<FileText className='w-5 h-5 text-primary' />
						Executive Summary
					</CardTitle>
					<CardDescription>High-level overview of the document</CardDescription>
				</CardHeader>
				<CardContent>
					<p className='text-sm  text-foreground/90 mb-6'>{result.summary}</p>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div className='space-y-1 bg-muted/30 p-3 rounded-md'>
							<span className='text-xs font-semibold text-muted-foreground uppercase '>
								Document Type
							</span>
							<p className='font-medium text-sm'>
								{result.documentType || 'Not identified'}
							</p>
						</div>
						<div className='space-y-1 bg-muted/30 p-3 rounded-md'>
							<span className='text-xs font-semibold text-muted-foreground uppercase '>
								Parties
							</span>
							<p className='font-medium text-sm'>
								{result.parties?.join(' vs ') || 'Not identified'}
							</p>
						</div>
						<div className='space-y-1 bg-muted/30 p-3 rounded-md'>
							<span className='text-xs font-semibold text-muted-foreground uppercase '>
								Effective Date
							</span>
							<p className='font-medium text-sm'>
								{result.effectiveDate || 'Not identified'}
							</p>
						</div>
						<div className='space-y-1 bg-muted/30 p-3 rounded-md'>
							<span className='text-xs font-semibold text-muted-foreground uppercase '>
								Term / Duration
							</span>
							<p className='font-medium text-sm'>
								{result.termDuration || 'Not identified'}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Risks Center */}
			{result.risks && result.risks.length > 0 && (
				<div className='space-y-3'>
					<h3 className='text-lg font-semibold flex items-center gap-2'>
						<ShieldAlertIcon className='w-5 h-5 text-rose-500' />
						Risk Center
					</h3>
					<div className='grid gap-3'>
						{result.risks.map((risk) => (
							<Card
								key={risk.title}
								className={`border-l-4 shadow-sm ${
									risk.severity === 'high'
										? 'border-l-destructive bg-destructive/5'
										: risk.severity === 'medium'
											? 'border-l-amber-500 bg-amber-500/5'
											: 'border-l-blue-500 bg-blue-500/5'
								}`}
							>
								<CardContent className='p-4 flex gap-4'>
									<div className='mt-0.5'>{getSeverityIcon(risk.severity)}</div>
									<div className='space-y-1 flex-1'>
										<div className='flex items-start justify-between gap-4'>
											<h4 className='font-semibold text-sm'>{risk.title}</h4>
											<Badge
												variant='outline'
												className='text-xs shrink-0 capitalize'
											>
												{risk.severity} Risk
											</Badge>
										</div>
										<p className='text-sm text-muted-foreground'>
											{risk.detail}
										</p>
										<div className='pt-2 mt-2 border-t border-border/50 flex items-start gap-2'>
											<CheckCircle2 className='w-3.5 h-3.5 text-emerald-500 mt-0.5' />
											<p className='text-xs font-medium text-foreground/80'>
												{risk.action}
											</p>
										</div>
										{risk.page && (
											<p className='text-xs text-muted-foreground/70 text-right mt-1 font-mono'>
												Source: {risk.page}
											</p>
										)}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}

			{/* Key Clauses */}
			{result.keyClauses && result.keyClauses.length > 0 && (
				<div className='space-y-3'>
					<h3 className='text-lg font-semibold'>Key Clauses</h3>
					<Accordion className='w-full space-y-2'>
						{result.keyClauses.map((clause, i) => (
							<AccordionItem
								key={clause.title}
								value={`clause-${i}`}
								className='border rounded-lg bg-card px-4 shadow-sm'
							>
								<AccordionTrigger className='hover:no-underline py-3'>
									<div className='flex justify-between w-full pr-4 text-left'>
										<span className='font-semibold text-sm'>
											{clause.title}
										</span>
										<span className='text-xs text-muted-foreground font-mono'>
											{clause.section || clause.page}
										</span>
									</div>
								</AccordionTrigger>
								<AccordionContent className='text-sm space-y-4 pt-1 pb-4'>
									<p className='text-foreground/90 '>{clause.explanation}</p>
									<div className='bg-muted/50 p-3 rounded-md border border-border/50'>
										<p className='text-xs font-mono text-muted-foreground italic'>
											&ldquo;{clause.excerpt}&rdquo;
										</p>
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			)}

			{/* Obligations */}
			{result.obligations && result.obligations.length > 0 && (
				<div className='space-y-3'>
					<h3 className='text-lg font-semibold'>Obligations</h3>
					<div className='rounded-md border bg-card overflow-hidden'>
						<div className='grid grid-cols-12 gap-2 p-3 font-semibold text-xs text-muted-foreground uppercase  bg-muted/40 border-b'>
							<div className='col-span-3'>Party</div>
							<div className='col-span-5'>Obligation</div>
							<div className='col-span-3'>Trigger / Deadline</div>
							<div className='col-span-1 text-right'>Ref</div>
						</div>
						<div className='divide-y text-sm'>
							{result.obligations.map((obs) => (
								<div
									key={obs.obligation}
									className='grid grid-cols-12 gap-2 p-3 hover:bg-muted/20 transition-colors'
								>
									<div className='col-span-3 font-medium text-foreground/90'>
										{obs.party}
									</div>
									<div className='col-span-5 text-muted-foreground'>
										{obs.obligation}
									</div>
									<div className='col-span-3 text-muted-foreground'>
										{obs.trigger}
									</div>
									<div className='col-span-1 text-right text-xs text-muted-foreground font-mono'>
										{obs.page}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}

			<Separator />

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				<AskPanel documentText={documentText} />
				<ChecklistPanel
					checklist={result.checklist}
					questions={result.questionsForCounsel}
				/>
			</div>
		</div>
	);
}

function ShieldAlertIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label='Shield alert icon'
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<title>Shield icon</title>
			<path d='M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-3 6-3s4 2 6 3a1 1 0 0 1 1 1v7z' />
			<path d='M12 8v4' />
			<path d='M12 16h.01' />
		</svg>
	);
}
