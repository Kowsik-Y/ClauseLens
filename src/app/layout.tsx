import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const fontSans = Inter({
	variable: '--font-sans',
	subsets: ['latin'],
});

const fontMono = JetBrains_Mono({
	variable: '--font-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'ClauseLens - AI Legal Document Copilot',
	description:
		'Understand the fine print before you sign with AI-powered legal document analysis and comparison.',
	keywords: [
		'AI',
		'Legal',
		'Document Analysis',
		'Contract',
		'Copilot',
		'Gemini',
	],
	authors: [{ name: 'ClauseLens Team' }],
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://clauselens.vercel.app',
		siteName: 'ClauseLens',
		title: 'ClauseLens - AI Legal Document Copilot',
		description: 'Understand the fine print before you sign.',
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html
			lang='en'
			className={`${fontSans.variable} ${fontMono.variable} h-full antialiased`}
		>
			<body className='min-h-full flex flex-col'>
				<TooltipProvider>
					<div className='flex flex-col min-h-screen'>
						<a
							href='#main-content'
							className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-background p-2 z-50 rounded-md border'
						>
							Skip to main content
						</a>
						<Header />
						<main id='main-content' className='flex-1 w-full bg-muted/10'>
							{children}
						</main>
						<footer className='w-full border-t bg-background/95 py-6'>
							<div className='container mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground'>
								<p>
									&copy; {new Date().getFullYear()} ClauseLens. For
									informational purposes only &mdash; not legal advice.
								</p>
								<p className='text-xs'>Powered by Google Gemini AI</p>
							</div>
						</footer>
					</div>
				</TooltipProvider>
				<Toaster />
			</body>
		</html>
	);
}
