'use client';

import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<div className='flex h-[80vh] flex-col items-center justify-center gap-4 px-4 text-center'>
			<AlertCircle className='h-12 w-12 text-destructive' />
			<div className='space-y-2'>
				<h1 className='text-3xl font-bold tracking-tight'>
					Something went wrong!
				</h1>
				<p className='text-muted-foreground'>
					An unexpected error occurred while processing your request.
				</p>
			</div>
			<div className='flex gap-4'>
				<Button onClick={() => reset()} variant='default'>
					Try again
				</Button>
				<Link href='/' className={buttonVariants({ variant: 'outline' })}>
					Return Home
				</Link>
			</div>
		</div>
	);
}
