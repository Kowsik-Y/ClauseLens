'use client';

import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const ComparePanel = dynamic(
	() => import('@/components/compare-panel').then((m) => m.ComparePanel),
	{
		ssr: false,
		loading: () => (
			<div className='flex justify-center p-8'>
				<Loader2 className='w-8 h-8 animate-spin text-primary' />
			</div>
		),
	},
);

export default function ComparePage() {
	return (
		<div className='container mx-auto px-4 py-8 md:px-8 space-y-8'>
			<div className='max-w-3xl mx-auto text-center space-y-4'>
				<h1 className='text-4xl font-bold sm:text-5xl text-foreground'>
					Compare <span className='text-primary'>Documents</span>
				</h1>
				<p className='text-lg text-muted-foreground md:text-xl'>
					Upload two versions of a legal document to instantly see what changed,
					why it matters, and who it impacts.
				</p>
			</div>

			<ComparePanel />
		</div>
	);
}
