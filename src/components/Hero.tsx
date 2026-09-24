import {
	ArrowRight,
	BookOpen,
	FileSearch,
	GitCompare,
	ShieldCheck,
	Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function Hero() {
	return (
		<section className='w-full py-12 md:py-24 lg:py-32 bg-linear-to-b from-background to-muted/20'>
			<div className='container mx-auto px-4 md:px-6 flex flex-col items-center text-center space-y-8'>
				<div className='space-y-4 max-w-3xl'>
					<h1 className='text-4xl font-bold  sm:text-5xl md:text-6xl text-foreground'>
						Understand the fine print <br className='hidden sm:block' />
						<span className='text-primary'>before you sign.</span>
					</h1>
					<p className='mx-auto max-w-175 text-lg text-muted-foreground md:text-xl'>
						Upload a legal document and get plain-English explanations,
						obligations, risks, questions, and actionable next steps.
					</p>
				</div>

				<div className='flex flex-col sm:flex-row items-center gap-4 py-4'>
					<Link href='/analyze'>
						<Button size='lg' className='gap-2 rounded-full px-8'>
							<BookOpen className='w-4 h-4' />
							Analyze a Document
							<ArrowRight className='w-4 h-4 ml-1' />
						</Button>
					</Link>
					<Link href='/compare'>
						<Button
							size='lg'
							variant='outline'
							className='gap-2 rounded-full px-8'
						>
							<GitCompare className='w-4 h-4 text-primary' />
							Compare Documents
						</Button>
					</Link>
				</div>

				<div className='flex flex-wrap items-center justify-center gap-3'>
					<Badge variant='outline'>
						<BookOpen className='mr-1.5 h-3.5 w-3.5 text-blue-500' />
						Document Grounded
					</Badge>
					<Badge variant='outline'>
						<FileSearch className='mr-1.5 h-3.5 w-3.5 text-emerald-500' />
						Source Citations
					</Badge>
					<Badge variant='outline'>
						<ShieldCheck className='mr-1.5 h-3.5 w-3.5 text-rose-500' />
						Risk Detection
					</Badge>
					<Badge variant='outline'>
						<Zap className='mr-1.5 h-3.5 w-3.5 text-amber-500' />
						AI Assisted
					</Badge>
				</div>

				<Badge
					variant='outline'
					className='text-muted-foreground max-w-md mx-auto italic bg-muted/30'
				>
					This tool provides legal information, not legal advice.
				</Badge>
			</div>
		</section>
	);
}
