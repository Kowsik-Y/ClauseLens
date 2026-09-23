'use client';

import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
}

export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	state: ErrorBoundaryState = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback ?? (
					<p className='p-4 text-destructive text-sm font-medium'>
						Something went wrong. Please try again.
					</p>
				)
			);
		}
		return this.props.children;
	}
}
