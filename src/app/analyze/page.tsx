'use client';

import { AnalysisDashboard } from '@/components/analysis-dashboard';
import { DocumentInput } from '@/components/document-input';
import type { AnalysisResult } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AnalyzePage() {
	const [analyzing, setAnalyzing] = useState(false);
	const [result, setResult] = useState<AnalysisResult | null>(null);
	const [documentText, setDocumentText] = useState('');

	const handleAnalyze = async ({
		text,
		file,
		mode,
	}: { text: string; file?: File; mode: string }) => {
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
		<div className='container mx-auto px-4 py-8 md:px-8 space-y-8'>
			<div className='grid grid-cols-1 xl:grid-cols-12 gap-8'>
				<div className='xl:col-span-4'>
					<DocumentInput onAnalyze={handleAnalyze} />
				</div>

				<div className='xl:col-span-8'>
					{analyzing ? (
						<div className='flex flex-col items-center justify-center h-125 border rounded-lg bg-card text-muted-foreground'>
							<Loader2 className='w-12 h-12 animate-spin mb-4 text-primary' />
							<p className='text-lg font-medium'>
								Analyzing document with AI...
							</p>
							<p className='text-sm mt-2 max-w-100 text-center'>
								This usually takes 10-20 seconds depending on the document
								length and complexity.
							</p>
						</div>
					) : result ? (
						<AnalysisDashboard result={result} documentText={documentText} />
					) : (
						<div className='flex flex-col items-center justify-center h-125 border rounded-lg border-dashed bg-muted/20 text-muted-foreground'>
							<p className='text-xl font-medium mb-2 text-foreground/70'>
								Your document intelligence will appear here
							</p>
							<p className='text-sm'>
								Upload or paste a document to begin analysis.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
