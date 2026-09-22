'use client';

import { AnalysisDashboard } from '@/components/analysis-dashboard';
import { DocumentInput } from '@/components/document-input';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import type { AnalysisResult } from '@/lib/types';
import { FileUp, Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AnalyzePage() {
	const [analyzing, setAnalyzing] = useState(false);
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [documentText, setDocumentText] = useState('');
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleAnalyze = async ({
		text,
		file,
		mode,
	}: { text: string; file?: File; mode: string }) => {
		setIsDialogOpen(false); // Close dialog immediately when analysis starts
		setAnalyzing(true);
		setResult(null);
		setDocumentText('');

		try {
			let finalDocText = text;

			if (file) {
				const formData = new FormData();
				formData.append('file', file);
				const extractRes = await fetch('/api/parse', {
					method: 'POST',
					body: formData,
				});

				if (!extractRes.ok) {
					throw new Error('Failed to extract text from file.');
				}
				const { text: extractedText } = await extractRes.json();
				finalDocText = extractedText;
			}

			setDocumentText(finalDocText);

			const analyzeRes = await fetch('/api/analyze', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ documentText: finalDocText, mode }),
			});

			if (!analyzeRes.ok) {
				throw new Error('Failed to analyze document.');
			}

			const data = await analyzeRes.json();
			setResult(data);
			toast.success('Analysis complete!');
		} catch (error: unknown) {
			toast.error(
				(error as Error).message || 'An error occurred during analysis.',
			);
			console.error(error);
		} finally {
			setAnalyzing(false);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8 md:px-8 space-y-8 max-w-7xl'>
			<div className='flex justify-between items-center mb-6'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight'>
						Document Analysis
					</h1>
					<p className='text-muted-foreground mt-1'>
						Upload or paste a legal document to instantly extract clauses,
						risks, and obligations.
					</p>
				</div>
				{result && !analyzing && (
					<Button onClick={() => setIsDialogOpen(true)} className='gap-2'>
						<Plus className='w-4 h-4' />
						Analyze New Document
					</Button>
				)}
			</div>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-none bg-transparent shadow-none rounded-xl'>
					<DialogHeader className='sr-only'>
						<DialogTitle>Document Input</DialogTitle>
						<DialogDescription>
							Upload a document for analysis
						</DialogDescription>
					</DialogHeader>
					<div className='bg-card rounded-xl'>
						<DocumentInput onAnalyze={handleAnalyze} />
					</div>
				</DialogContent>
			</Dialog>

			<div className='w-full'>
				{analyzing ? (
					<div className='flex flex-col items-center justify-center min-h-[300px] md:h-125 border rounded-lg bg-card text-muted-foreground w-full p-6'>
						<Loader2 className='w-12 h-12 animate-spin mb-4 text-primary' />
						<p className='text-lg font-medium'>Analyzing document with AI...</p>
						<p className='text-sm mt-2 max-w-100 text-center'>
							This usually takes 10-20 seconds depending on the document length
							and complexity.
						</p>
					</div>
				) : result ? (
					<div className='w-full'>
						<AnalysisDashboard result={result} documentText={documentText} />
					</div>
				) : (
					<div className='flex flex-col items-center justify-center py-16 md:py-32 border rounded-xl border-dashed bg-muted/30 text-muted-foreground w-full text-center px-4'>
						<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6'>
							<FileUp className='w-8 h-8 text-primary' />
						</div>
						<h2 className='text-2xl font-semibold mb-3 text-foreground/90'>
							No Document Analyzed Yet
						</h2>
						<p className='text-base max-w-md mb-8'>
							Upload a PDF, DOCX, or paste raw text to instantly generate an
							executive summary, extract key clauses, and identify hidden risks.
						</p>
						<Button
							size='lg'
							onClick={() => setIsDialogOpen(true)}
							className='gap-2 text-base px-8 h-12'
						>
							<Plus className='w-5 h-5' />
							Start New Analysis
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
