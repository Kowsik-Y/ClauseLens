import { Badge } from '@/components/ui/badge';

export function RiskBadge({
	severity,
}: {
	severity: 'high' | 'medium' | 'low' | 'HIGH' | 'MEDIUM' | 'LOW';
}) {
	const normSeverity = severity.toLowerCase() as 'high' | 'medium' | 'low';

	const colorClasses = {
		high: 'bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20',
		medium:
			'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20',
		low: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20',
	};

	return (
		<Badge
			variant='outline'
			className={`text-xs shrink-0 capitalize ${colorClasses[normSeverity] || colorClasses.low}`}
		>
			{normSeverity} Risk
		</Badge>
	);
}
