import { render, screen } from '@testing-library/react';
import {
	type MockInstance,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest';
import { SettingsDialog } from '../../src/components/settings-dialog';

describe('SettingsDialog Component', () => {
	let classListContainsSpy: MockInstance;

	beforeEach(() => {
		classListContainsSpy = vi
			.spyOn(document.documentElement.classList, 'contains')
			.mockReturnValue(false);
	});

	afterEach(() => {
		classListContainsSpy.mockRestore();
	});

	it('renders the settings button', () => {
		render(<SettingsDialog />);
		expect(screen.getByTitle('Settings')).toBeInTheDocument();
	});

	it('renders screen reader text for settings', () => {
		render(<SettingsDialog />);
		expect(screen.getByText('Settings')).toBeInTheDocument();
	});
});
