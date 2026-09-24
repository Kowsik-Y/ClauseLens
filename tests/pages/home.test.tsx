import Home from '@/app/page';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/Hero', () => ({
	Hero: () => <div data-testid='hero-component'>Hero Mock</div>,
}));

describe('Home Page', () => {
	it('renders the Hero component', async () => {
		render(<Home />);
		expect(await screen.findByTestId('hero-component')).toBeInTheDocument();
	});
});
