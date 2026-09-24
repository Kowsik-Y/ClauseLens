'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { QaResult } from '@/lib/types';
import { AlertCircle, Loader2, MessageSquare, Send } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const SUGGESTIONS = [
	'Can I terminate this agreement early?',
	'What payments am I responsible for?',
	'What happens if I breach the contract?',
	'Does this renew automatically?',
];

export function AskPanel({ documentText }: { documentText: string }) {
	const [question, setQuestion] = useState('');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<QaResult | null>(null);
	const [error, setError] = useState<string | null>(null);

	const abortControllerRef = useRef<AbortController | null>(null);

	const handleAsk = useCallback(
		async (q: string = question) => {
			if (!q.trim() || !documentText) return;

			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
			const abortController = new AbortController();
			abortControllerRef.current = abortController;

			setLoading(true);
			setError(null);
			setQuestion(q);

			try {
				const res = await fetch('/api/qa', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ documentText, question: q }),
					signal: abortController.signal,
				});

				if (!res.ok) throw new Error('Failed to get an answer.');
				const data = await res.json();
				setResult(data);
			} catch (err: unknown) {
				if (err instanceof Error && err.name === 'AbortError') return;
				setError((err as Error).message || 'An error occurred');
			} finally {
				if (abortControllerRef.current === abortController) {
					setLoading(false);
				}
			}
		},
		[question, documentText],
	);

	return (
		<Card className='h-full border-border/60  flex flex-col'>
			<CardHeader className='pb-3 shrink-0'>
				<CardTitle className='text-xl flex items-center gap-2'>
					<MessageSquare className='w-5 h-5 text-primary' />
					Ask ClauseLens
				</CardTitle>
				<CardDescription>
					Ask questions based exclusively on this document.
				</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 flex flex-col min-h-0'>
				<div className='flex gap-2 mb-4 shrink-0'>
					<Input
						aria-label='Ask a question about this document'
						placeholder='Ask a question about this document...'
						value={question}
						onChange={(e) => setQuestion(e.target.value)}
						onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
						className='flex-1'
					/>
					<Button
						aria-label='Send question'
						onClick={() => handleAsk()}
						disabled={loading || !question.trim()}
					>
						{loading ? (
							<Loader2 className='w-4 h-4 animate-spin' />
						) : (
							<Send className='w-4 h-4' />
						)}
					</Button>
				</div>

				{!result && !loading && (
					<div className='flex flex-wrap gap-2 mb-4 shrink-0'>
						{SUGGESTIONS.map((sug) => (
							<Button
								key={sug}
								variant='secondary'
								size='sm'
								className='text-xs h-8'
								onClick={() => handleAsk(sug)}
							>
								{sug}
							</Button>
						))}
					</div>
				)}

				<ScrollArea className='flex-1 min-h-0 pr-4'>
					{error && (
						<div
							role='alert'
							className='p-3 bg-destructive/10 text-destructive rounded-md text-sm mb-4'
						>
							{error}
						</div>
					)}

					{result && (
						<div className='space-y-4 pb-4'>
							<div className='p-4 bg-muted/30 rounded-lg border border-border/50'>
								<h4 className='font-medium text-sm mb-2 text-foreground/80'>
									Answer
								</h4>
								<p className='text-sm whitespace-pre-wrap wrap-break-word leading-relaxed'>
									{result.answer}
								</p>

								{result.citations && result.citations.length > 0 && (
									<div className='mt-4 pt-3 border-t border-border/50'>
										<h5 className='text-xs font-semibold uppercase  text-muted-foreground mb-1'>
											Sources
										</h5>
										<ul className='space-y-1'>
											{result.citations.map((cite) => (
												<li
													key={cite}
													className='text-xs font-mono text-muted-foreground bg-background px-2 py-1 inline-block rounded border  mr-2 mb-1'
												>
													{cite}
												</li>
											))}
										</ul>
									</div>
								)}

								{result.notFound && (
									<div className='mt-4 flex items-start gap-2 text-amber-600 bg-amber-500/10 p-2 rounded text-xs'>
										<AlertCircle className='w-4 h-4 shrink-0' />
										<p>
											I couldn't find support for that answer in the supplied
											document.
										</p>
									</div>
								)}

								<div className='mt-4 text-[10px] text-muted-foreground italic text-right'>
									The answer is based only on the supplied document.
								</div>
							</div>

							{result.followUps && result.followUps.length > 0 && (
								<div className='space-y-2'>
									<p className='text-xs text-muted-foreground font-medium'>
										Follow-up questions
									</p>
									<div className='flex flex-col gap-2'>
										{result.followUps.map((fu) => (
											<Button
												key={fu}
												variant='outline'
												size='sm'
												className='justify-start text-left h-auto py-2 px-3 text-xs whitespace-normal wrap-break-word'
												onClick={() => handleAsk(fu)}
											>
												{fu}
											</Button>
										))}
									</div>
								</div>
							)}
						</div>
					)}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
