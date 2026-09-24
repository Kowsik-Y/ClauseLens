'use client';

import {
	ArrowRight,
	FileDiff,
	GitCompare,
	Loader2,
	Plus,
	UploadCloud,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type { ComparisonResult } from '@/lib/types';

export function ComparePanel() {
	const [docA, setDocA] = useState('');
	const [docB, setDocB] = useState('');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<ComparisonResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [uploadingA, setUploadingA] = useState(false);
	const [uploadingB, setUploadingB] = useState(false);

	const handleFileUpload = useCallback(async (file: File, isDocA: boolean) => {
		if (isDocA) setUploadingA(true);
		else setUploadingB(true);

		try {
			const formData = new FormData();
			formData.append('file', file);
			const res = await fetch('/api/parse', {
				method: 'POST',
				body: formData,
			});

			if (!res.ok) throw new Error('Failed to parse file.');
			const { text } = await res.json();

			if (isDocA) setDocA(text);
			else setDocB(text);
			toast.success(`${file.name} parsed successfully`);
		} catch (err) {
			console.error(err);
			toast.error('Failed to upload and parse the document.');
		} finally {
			if (isDocA) setUploadingA(false);
			else setUploadingB(false);
		}
	}, []);

	const abortControllerRef = useRef<AbortController | null>(null);

	const handleCompare = useCallback(async () => {
		if (!docA.trim() || !docB.trim()) return;

		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		setIsDialogOpen(false);
		setLoading(true);
		setError(null);
		setResult(null);

		try {
			const res = await fetch('/api/compare', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ documentA: docA, documentB: docB }),
				signal: abortController.signal,
			});

			if (!res.ok) throw new Error('Failed to compare documents.');
			const data = await res.json();
			setResult(data);
		} catch (err: unknown) {
			if (err instanceof Error && err.name === 'AbortError') return;
			setError(
				(err as Error).message || 'An error occurred during comparison.',
			);
		} finally {
			if (abortControllerRef.current === abortController) {
				setLoading(false);
			}
		}
	}, [docA, docB]);

	return (
		<div className='space-y-6 w-full'>
			{/* Top Action Bar (only visible when there are results) */}
			{result && !loading && (
				<div className='flex justify-end mb-4'>
					<Button onClick={() => setIsDialogOpen(true)} className='gap-2'>
						<Plus className='w-4 h-4' />
						Compare New Documents
					</Button>
				</div>
			)}

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='sm:max-w-4xl md:max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Document Input</DialogTitle>
						<DialogDescription>
							Paste the two versions of the document you want to compare.
						</DialogDescription>
					</DialogHeader>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-4 py-4'>
						<Card className='border-border/60 shadow-none'>
							<CardHeader className='pb-3 flex flex-row items-center justify-between space-y-0'>
								<div className='space-y-1'>
									<CardTitle className='text-lg'>
										Original Document (A)
									</CardTitle>
									<CardDescription>Paste text or upload a file</CardDescription>
								</div>
								<div className='relative shrink-0'>
									<Button
										variant='secondary'
										size='sm'
										className='h-8 gap-2 relative z-10'
										disabled={uploadingA}
									>
										{uploadingA ? (
											<Loader2 className='w-4 h-4 animate-spin' />
										) : (
											<UploadCloud className='w-4 h-4' />
										)}
										Upload File
									</Button>
									<input
										title='Upload Document A'
										type='file'
										className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20'
										accept='.pdf,.docx,.txt'
										onChange={(e) => {
											if (e.target.files?.[0])
												handleFileUpload(e.target.files[0], true);
											e.target.value = '';
										}}
									/>
								</div>
							</CardHeader>
							<CardContent>
								<Textarea
									aria-label='Original document text'
									placeholder='Paste original text here...'
									className='min-h-75 resize-y font-mono text-sm'
									value={docA}
									onChange={(e) => setDocA(e.target.value)}
								/>
							</CardContent>
						</Card>

						<Card className='border-border/60 shadow-none'>
							<CardHeader className='pb-3 flex flex-row items-center justify-between space-y-0'>
								<div className='space-y-1'>
									<CardTitle className='text-lg'>New Document (B)</CardTitle>
									<CardDescription>Paste text or upload a file</CardDescription>
								</div>
								<div className='relative shrink-0'>
									<Button
										variant='secondary'
										size='sm'
										className='h-8 gap-2 relative z-10'
										disabled={uploadingB}
									>
										{uploadingB ? (
											<Loader2 className='w-4 h-4 animate-spin' />
										) : (
											<UploadCloud className='w-4 h-4' />
										)}
										Upload File
									</Button>
									<input
										title='Upload Document B'
										type='file'
										className='absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20'
										accept='.pdf,.docx,.txt'
										onChange={(e) => {
											if (e.target.files?.[0])
												handleFileUpload(e.target.files[0], false);
											e.target.value = '';
										}}
									/>
								</div>
							</CardHeader>
							<CardContent>
								<Textarea
									aria-label='New document text'
									placeholder='Paste new text here...'
									className='min-h-75 resize-y font-mono text-sm'
									value={docB}
									onChange={(e) => setDocB(e.target.value)}
								/>
							</CardContent>
						</Card>
					</div>

					<div className='flex justify-end pt-2'>
						<Button
							size='lg'
							onClick={handleCompare}
							disabled={loading || !docA.trim() || !docB.trim()}
							className='w-full sm:w-auto font-medium gap-2'
						>
							<GitCompare className='w-5 h-5' /> Compare Documents
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			{error && (
				<div
					role='alert'
					className='p-4 bg-destructive/10 text-destructive rounded-lg text-center max-w-2xl mx-auto'
				>
					{error}
				</div>
			)}

			{loading ? (
				<div
					aria-busy='true'
					className='flex flex-col items-center justify-center min-h-75 md:h-125 border rounded-lg bg-card text-muted-foreground w-full p-6'
				>
					<Loader2 className='w-12 h-12 animate-spin mb-4 text-primary' />
					<p className='text-lg font-medium'>Analyzing differences...</p>
					<p className='text-sm mt-2 max-w-100 text-center'>
						Comparing the structural and legal changes between the two
						documents.
					</p>
				</div>
			) : result ? (
				<Card className='border-border/60 mt-8'>
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
							<ScrollArea className='max-h-150'>
								<div className='divide-y'>
									{result.changes.map((change, idx) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: result array is static and not reordered
										<div
											key={`${change.category}-${idx}`}
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
			) : (
				<div className='flex flex-col items-center justify-center py-16 md:py-32 border rounded-xl border-dashed bg-muted/30 text-muted-foreground w-full text-center px-4'>
					<div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6'>
						<GitCompare className='w-8 h-8 text-primary' />
					</div>
					<h2 className='text-2xl font-semibold mb-3 text-foreground/90'>
						No Documents Compared Yet
					</h2>
					<p className='text-base max-w-md mb-8'>
						Paste two versions of a legal contract to instantly detect
						meaningful additions, deletions, and their exact legal impact.
					</p>
					<Button
						size='lg'
						onClick={() => setIsDialogOpen(true)}
						className='gap-2 text-base px-8 h-12'
					>
						<Plus className='w-5 h-5' />
						Start New Comparison
					</Button>
				</div>
			)}
		</div>
	);
}
