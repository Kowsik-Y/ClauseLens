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
				source: '/(.*)',
				headers: [
					{ key: 'X-Content-Type-Options', value: 'nosniff' },
					{ key: 'X-Frame-Options', value: 'DENY' },
					{ key: 'X-XSS-Protection', value: '1; mode=block' },
					{ key: 'X-DNS-Prefetch-Control', value: 'on' },
					{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload',
					},
					{
						key: 'Permissions-Policy',
						value:
							'camera=(), microphone=(), geolocation=(), browsing-topics=()',
					},
					{
						key: 'Content-Security-Policy',
						value:
							process.env.NODE_ENV === 'development'
								? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'"
								: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'",
					},
				],
			},
			{
				source: '/api/:path*',
				headers: [{ key: 'Cache-Control', value: 'no-store' }],
			},
		];
	},
};

export default nextConfig;
