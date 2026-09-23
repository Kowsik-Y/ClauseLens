import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	experimental: {
		optimizePackageImports: ['lucide-react', '@base-ui/react'],
	},
	serverExternalPackages: ['pdf-parse', 'mammoth'],
	compress: true,
	poweredByHeader: false,
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'Cache-Control', value: 'no-store' },
				],
			},
		];
	},
};

export default nextConfig;
