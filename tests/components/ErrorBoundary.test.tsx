import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

function ThrowingComponent(): never {
	throw new Error('Test error');
}

function GoodComponent() {
	return <div>All good</div>;
}

describe('ErrorBoundary Component', () => {
	// Suppress console.error for intentional error tests
	const originalError = console.error;
	beforeEach(() => {
		console.error = () => {};
	});
	afterEach(() => {
		console.error = originalError;
	});

	it('renders children when no error occurs', () => {
		render(
			<ErrorBoundary>
				<GoodComponent />
			</ErrorBoundary>,
		);
		expect(screen.getByText('All good')).toBeInTheDocument();
	});

	it('renders default fallback on error', () => {
		render(
			<ErrorBoundary>
				<ThrowingComponent />
			</ErrorBoundary>,
		);
		expect(
			screen.getByText('Something went wrong. Please try again.'),
		).toBeInTheDocument();
	});

	it('renders custom fallback on error', () => {
		render(
			<ErrorBoundary fallback={<div>Custom error message</div>}>
				<ThrowingComponent />
			</ErrorBoundary>,
		);
		expect(screen.getByText('Custom error message')).toBeInTheDocument();
	});
});
