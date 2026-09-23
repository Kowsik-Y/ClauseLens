import { Badge } from '@/components/ui/badge';
import React from 'react';

export function RiskBadge({
	severity,
}: { severity: 'high' | 'medium' | 'low' | 'HIGH' | 'MEDIUM' | 'LOW' }) {
	const normSeverity = severity.toLowerCase();

	return (
		<Badge variant='outline' className='text-xs shrink-0 capitalize'>
			{normSeverity} Risk
		</Badge>
	);
}
