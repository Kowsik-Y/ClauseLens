'use client';

import { Badge } from '@/components/ui/badge';
import { Scale } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SettingsDialog } from './settings-dialog';

export function Header() {
	const pathname = usePathname();

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
			<div className='container mx-auto flex h-16 items-center px-4 md:px-8'>
				<Link
					href='/'
					className='mr-4 flex items-center space-x-2 transition-opacity hover:opacity-80'
				>
					<Scale className='h-6 w-6 text-primary' />
					<span className='font-bold  text-lg'>ClauseLens</span>
					<span className='hidden text-sm text-muted-foreground sm:inline-block ml-2 border-l border-border pl-2'>
						AI Legal Document
					</span>
				</Link>

				<nav className='flex items-center space-x-6 text-sm font-medium mr-auto ml-6'>
					<Link
						href='/analyze'
						className={`transition-colors hover:text-primary ${pathname === '/analyze' ? 'text-primary' : 'text-muted-foreground'}`}
					>
						Analyze
					</Link>
					<Link
						href='/compare'
						className={`transition-colors hover:text-primary ${pathname === '/compare' ? 'text-primary' : 'text-muted-foreground'}`}
					>
						Compare
					</Link>
				</nav>

				<div className='flex items-center justify-end space-x-4'>
					<Badge
						variant='secondary'
						className='hidden sm:inline-flex bg-primary/10 text-primary hover:bg-primary/20 transition-colors'
					>
						AI Powered
					</Badge>
					<SettingsDialog />
				</div>
			</div>
		</header>
	);
}
