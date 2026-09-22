'use client';

import { ComparePanel } from '@/components/compare-panel';

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
