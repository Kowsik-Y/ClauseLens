import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { FileQuestion, HelpCircle, ListTodo } from 'lucide-react';
import { useState } from 'react';

export function ChecklistPanel({
	checklist,
	questions,
}: { checklist: string[]; questions: string[] }) {
	const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

	const toggleCheck = (index: number) => {
		setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
	};

	return (
		<Card className='h-full border-border/60  flex flex-col'>
			<CardHeader className='pb-3 shrink-0'>
				<CardTitle className='text-xl flex items-center gap-2'>
					<ListTodo className='w-5 h-5 text-primary' />
					Action Checklist
				</CardTitle>
				<CardDescription>
					Recommended next steps based on the analysis.
				</CardDescription>
			</CardHeader>
			<CardContent className='flex-1 overflow-auto'>
				{checklist && checklist.length > 0 ? (
					<div className='space-y-3'>
						{checklist.map((item, i) => (
							<div
								key={item}
								className='flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 transition-colors'
							>
								<Checkbox
									id={`check-${i}`}
									checked={!!checkedItems[i]}
									onCheckedChange={() => toggleCheck(i)}
									className='mt-1'
								/>
								<label
									htmlFor={`check-${i}`}
									className={`text-sm  cursor-pointer select-none ${checkedItems[i] ? 'text-muted-foreground line-through' : 'text-foreground'}`}
								>
									{item}
								</label>
							</div>
						))}
					</div>
				) : (
					<div className='flex flex-col items-center justify-center h-full text-muted-foreground py-8'>
						<CheckCircle2 className='w-8 h-8 mb-2 opacity-20' />
						<p className='text-sm'>No actions identified.</p>
					</div>
				)}
			</CardContent>
			{questions && questions.length > 0 && (
				<CardFooter className='pt-4 border-t shrink-0'>
					<Dialog>
						<DialogTrigger
							render={
								<Button variant='outline' className='w-full font-medium'>
									<FileQuestion className='w-4 h-4 mr-2' />
									Prepare for legal review
								</Button>
							}
						/>
						<DialogContent className='sm:max-w-[500px]'>
							<DialogHeader>
								<DialogTitle>Questions for Legal Counsel</DialogTitle>
								<DialogDescription>
									Based on the document analysis, consider asking a lawyer these
									questions.
								</DialogDescription>
							</DialogHeader>
							<div className='space-y-4 py-4'>
								{questions.map((q) => (
									<div
										key={q}
										className='flex gap-3 items-start bg-muted/40 p-3 rounded-lg border border-border/50'
									>
										<HelpCircle className='w-5 h-5 text-blue-500 shrink-0 mt-0.5' />
										<p className='text-sm text-foreground/90'>{q}</p>
									</div>
								))}
							</div>
						</DialogContent>
					</Dialog>
				</CardFooter>
			)}
		</Card>
	);
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label='Check circle icon'
			{...props}
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		>
			<circle cx='12' cy='12' r='10' />
			<title>Check icon</title>
			<path d='m9 12 2 2 4-4' />
		</svg>
	);
}
