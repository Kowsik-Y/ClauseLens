'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type { ComparisonResult } from '@/lib/types';
import { ArrowRight, FileDiff, GitCompare, Loader2 } from 'lucide-react';
import { useState } from 'react';

export function ComparePanel() {
	const [docA, setDocA] = useState('');
	const [docB, setDocB] = useState('');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<ComparisonResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleCompare = async () => {
		if (!docA.trim() || !docB.trim()) return;

		setLoading(true);
		setError(null);

		try {
			const res = await fetch('/api/compare', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ documentA: docA, documentB: docB }),
			});

			if (!res.ok) throw new Error('Failed to compare documents.');
			const data = await res.json();
			setResult(data);
		} catch (err: unknown) {
			setError(
				(err as Error).message || 'An error occurred during comparison.',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<Card className='border-border/60 shadow-sm'>
					<CardHeader className='pb-3'>
						<CardTitle className='text-lg'>Original Document (A)</CardTitle>
						<CardDescription>Paste the original contract text</CardDescription>
					</CardHeader>
					<CardContent>
						<Textarea
							placeholder='Paste original text here...'
							className='min-h-[250px] resize-y font-mono text-sm'
							value={docA}
							onChange={(e) => setDocA(e.target.value)}
						/>
					</CardContent>
				</Card>

				<Card className='border-border/60 shadow-sm'>
					<CardHeader className='pb-3'>
						<CardTitle className='text-lg'>New Document (B)</CardTitle>
						<CardDescription>Paste the modified contract text</CardDescription>
					</CardHeader>
					<CardContent>
						<Textarea
							placeholder='Paste new text here...'
							className='min-h-[250px] resize-y font-mono text-sm'
							value={docB}
							onChange={(e) => setDocB(e.target.value)}
						/>
					</CardContent>
				</Card>
			</div>

			<div className='flex justify-center'>
				<Button
					size='lg'
					onClick={handleCompare}
					disabled={loading || !docA.trim() || !docB.trim()}
					className='w-full max-w-md font-medium'
				>
					{loading ? (
						<>
							<Loader2 className='mr-2 w-5 h-5 animate-spin' /> Analyzing
							Differences...
						</>
					) : (
						<>
							<GitCompare className='mr-2 w-5 h-5' /> Compare Documents
						</>
					)}
				</Button>
			</div>

			{error && (
				<div className='p-4 bg-destructive/10 text-destructive rounded-lg text-center'>
					{error}
				</div>
			)}

			{result && (
				<Card className='border-border/60 shadow-sm mt-8'>
					<CardHeader className='bg-muted/30 border-b pb-4'>
						<CardTitle className='text-xl flex items-center gap-2'>
							<FileDiff className='w-5 h-5 text-primary' />
							Comparison Results
						</CardTitle>
						<CardDescription className='text-base text-foreground/90 mt-2'>
							{result.summary}
						</CardDescription>
					</CardHeader>
					<CardContent className='p-0'>
						{result.changes && result.changes.length > 0 ? (
							<ScrollArea className='max-h-[600px]'>
								<div className='divide-y'>
									{result.changes.map((change) => (
										<div
											key={change.impact}
											className='p-6 hover:bg-muted/10 transition-colors'
										>
											<div className='flex items-center justify-between mb-4'>
												<Badge
													variant='outline'
													className='font-semibold px-3 py-1'
												>
													{change.category}
												</Badge>
											</div>

											<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
												<div className='space-y-2 p-4 bg-rose-500/5 rounded-lg border border-rose-500/20'>
													<h4 className='text-xs font-semibold text-rose-600 uppercase '>
														Document A
													</h4>
													<p className='text-sm text-foreground/80 '>
														{change.documentA}
													</p>
													{change.sourceA && (
														<p className='text-xs text-muted-foreground font-mono mt-2 pt-2 border-t border-rose-500/10'>
															{change.sourceA}
														</p>
													)}
												</div>

												<div className='space-y-2 p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20'>
													<h4 className='text-xs font-semibold text-emerald-600 uppercase '>
														Document B
													</h4>
													<p className='text-sm text-foreground/80 '>
														{change.documentB}
													</p>
													{change.sourceB && (
														<p className='text-xs text-muted-foreground font-mono mt-2 pt-2 border-t border-emerald-500/10'>
															{change.sourceB}
														</p>
													)}
												</div>
											</div>

											<div className='flex items-start gap-3 bg-muted/40 p-4 rounded-lg border border-border/50'>
												<ArrowRight className='w-5 h-5 text-blue-500 shrink-0 mt-0.5' />
												<div>
													<h4 className='text-sm font-semibold mb-1'>Impact</h4>
													<p className='text-sm text-muted-foreground '>
														{change.impact}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							</ScrollArea>
						) : (
							<div className='p-12 text-center text-muted-foreground'>
								No meaningful differences found.
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
