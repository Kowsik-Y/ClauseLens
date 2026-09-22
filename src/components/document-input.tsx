'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { FileText, UploadCloud, X } from 'lucide-react';
import { useState } from 'react';

export function DocumentInput({
	onAnalyze,
}: { onAnalyze: (data: { text: string; file?: File; mode: string }) => void }) {
	const [file, setFile] = useState<File | null>(null);
	const [text, setText] = useState('');
	const [mode, setMode] = useState('Full Analysis');
	const [isDragging, setIsDragging] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setFile(e.target.files[0]);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files?.[0]) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	return (
		<Card className='w-full shadow-sm border-border/60'>
			<CardHeader>
				<CardTitle className='text-xl'>Document Input</CardTitle>
				<CardDescription>
					Upload a PDF/DOCX or paste text for analysis.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue='upload' className='w-full'>
					<TabsList className='grid w-full grid-cols-2 mb-4'>
						<TabsTrigger value='upload'>Upload File</TabsTrigger>
						<TabsTrigger value='paste'>Paste Text</TabsTrigger>
					</TabsList>

					<TabsContent value='upload'>
						<div
							className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-border/60 hover:bg-muted/30'}`}
							onDragOver={(e) => {
								e.preventDefault();
								setIsDragging(true);
							}}
							onDragLeave={() => setIsDragging(false)}
							onDrop={handleDrop}
						>
							{file ? (
								<div className='flex flex-col items-center gap-2'>
									<div className='p-3 bg-primary/10 text-primary rounded-full'>
										<FileText className='w-8 h-8' />
									</div>
									<div className='text-center'>
										<p className='font-medium truncate max-w-50'>{file.name}</p>
										<p className='text-sm text-muted-foreground'>
											{(file.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
									<Button
										variant='ghost'
										size='sm'
										onClick={() => setFile(null)}
										className='mt-2 text-destructive hover:text-destructive/90'
									>
										<X className='w-4 h-4 mr-1' /> Remove
									</Button>
								</div>
							) : (
								<div className='flex flex-col items-center gap-2 text-center'>
									<div className='p-3 bg-muted text-muted-foreground rounded-full'>
										<UploadCloud className='w-8 h-8' />
									</div>
									<div>
										<p className='font-medium'>Drag & drop your file here</p>
										<p className='text-sm text-muted-foreground'>
											Supports PDF and DOCX
										</p>
									</div>
									<div className='mt-4 relative'>
										<Button variant='secondary' size='sm'>
											Select File
										</Button>
										<input
											type='file'
											className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
											accept='.pdf,.docx,.txt'
											onChange={handleFileChange}
										/>
									</div>
								</div>
							)}
						</div>
					</TabsContent>

					<TabsContent value='paste'>
						<div className='space-y-2'>
							<Label htmlFor='document-text' className='sr-only'>
								Document Text
							</Label>
							<Textarea
								id='document-text'
								placeholder='Paste your legal document text here...'
								className='min-h-62.5 resize-y font-mono text-sm'
								value={text}
								onChange={(e) => setText(e.target.value)}
							/>
							<p className='text-xs text-muted-foreground text-right'>
								{text.length} characters
							</p>
						</div>
					</TabsContent>
				</Tabs>

				<div className='mt-6 space-y-3'>
					<Label htmlFor='analysis-mode'>Analysis Mode</Label>
					<Select value={mode} onValueChange={(val) => val && setMode(val)}>
						<SelectTrigger id='analysis-mode'>
							<SelectValue placeholder='Select analysis mode' />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='Full Analysis'>Full Analysis</SelectItem>
							<SelectItem value='Risk Review'>Risk Review</SelectItem>
							<SelectItem value='Obligations'>Obligations Extract</SelectItem>
							<SelectItem value='Simple Summary'>Simple Summary</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className='w-full font-medium'
					size='lg'
					disabled={!file && !text.trim()}
					onClick={() => onAnalyze({ text, file: file || undefined, mode })}
				>
					Analyze Document
				</Button>
			</CardFooter>
		</Card>
	);
}
