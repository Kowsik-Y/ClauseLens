'use client';

import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

export function SettingsDialog() {
	const [theme, setTheme] = useState<'light' | 'dark'>('light');

	useEffect(() => {
		// Initialize theme from document
		if (document.documentElement.classList.contains('dark')) {
			setTheme('dark');
		} else {
			setTheme('light');
		}
	}, []);

	const toggleTheme = (newTheme: string | null) => {
		if (!newTheme) return;

		const themeValue = newTheme as 'light' | 'dark';
		setTheme(themeValue);
		if (themeValue === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	return (
		<Dialog>
			<DialogTrigger
				render={<Button variant='ghost' size='icon' title='Settings' />}
			>
				<Settings className='h-5 w-5 text-muted-foreground' />
				<span className='sr-only'>Settings</span>
			</DialogTrigger>
			<DialogContent className='sm:max-w-106.25'>
				<DialogHeader>
					<DialogTitle>Preferences</DialogTitle>
					<DialogDescription>
						Configure your AI legal copilot experience.
					</DialogDescription>
				</DialogHeader>
				<div className='grid gap-6 py-4'>
					<div className='grid gap-2'>
						<Label htmlFor='theme'>Appearance</Label>
						<Select value={theme} onValueChange={toggleTheme}>
							<SelectTrigger id='theme'>
								<SelectValue placeholder='Select theme' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='light'>Light Mode</SelectItem>
								<SelectItem value='dark'>Dark Mode</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='model'>AI Model</Label>
						<Select defaultValue='gemini-2.5-flash'>
							<SelectTrigger id='model'>
								<SelectValue placeholder='Select AI model' />
							</SelectTrigger>
							<SelectContent className='w-fit'>
								<SelectItem value='gemini-2.5-pro'>
									Google Gemini 2.5 Pro
								</SelectItem>
								<SelectItem value='gemini-2.5-flash'>
									Google Gemini 2.5 Flash
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='api-key'>Custom API Key (Optional)</Label>
						<Input
							id='api-key'
							type='password'
							placeholder='Enter your Gemini API key...'
						/>
						<p className='text-xs text-muted-foreground'>
							Leave blank to use the default platform quota.
						</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
