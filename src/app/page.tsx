import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/Hero').then((m) => m.Hero), {
	loading: () => (
		<div className='flex justify-center items-center min-h-screen'>
			<Loader2 className='w-8 h-8 animate-spin text-primary' />
		</div>
	),
});

export default function Home() {
	return <Hero />;
}
