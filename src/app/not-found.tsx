import { Button, buttonVariants } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='flex h-[80vh] flex-col items-center justify-center gap-4 px-4 text-center'>
			<FileQuestion className='h-12 w-12 text-muted-foreground' />
			<div className='space-y-2'>
				<h1 className='text-3xl font-bold tracking-tight'>
					404 - Page Not Found
				</h1>
				<p className='text-muted-foreground'>
					The page you are looking for does not exist or has been moved.
				</p>
			</div>
			<Link href='/' className={buttonVariants({ variant: 'default' })}>
				Return Home
			</Link>
		</div>
	);
}
