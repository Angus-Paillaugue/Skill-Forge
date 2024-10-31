import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import { Button } from '$lib/components';
import { expect, test } from 'vitest';

test('renders with default props', () => {
	const { getByRole } = render(Button);
	const button = getByRole('button');
	expect(button).toBeInTheDocument();
});

test('renders with different variants', () => {
	const { getByRole } = render(Button, { variant: 'secondary' });
	const button = getByRole('button');
	expect(button).toHaveClass('bg-neutral-700');
});

test('shows warning for invalid variant', () => {
	const { getByText } = render(Button, { variant: 'invalidVariant' });
	expect(getByText('Invalid variant: invalidVariant')).toBeInTheDocument();
});

test('renders with custom class', () => {
	const { getByRole } = render(Button, { class: 'bg-blue-600' });
	const button = getByRole('button');
	expect(button).toHaveClass('bg-blue-600');
});
