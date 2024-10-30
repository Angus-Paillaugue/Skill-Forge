import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { Difficulty } from '$lib/components';

test('Simple Difficulty component', () => {
	const component = mount(Difficulty, {
		target: document.body,
		props: { difficulty: 'easy' }
	});

	expect(document.body.querySelector('span')).not.toBeNull();
	expect(document.body.querySelector('span').textContent).toBe('easy');

	unmount(component);
});

test('Difficulty component with custom class', () => {
	const component = mount(Difficulty, {
		target: document.body,
		props: { difficulty: 'easy', class: 'custom-class' }
	});

	expect(document.body.querySelector('span')).not.toBeNull();
	expect(document.body.querySelector('span').classList.contains('custom-class')).toBe(true);

	unmount(component);
});

test('Difficulty component with custom style', () => {
	const component = mount(Difficulty, {
		target: document.body,
		props: { difficulty: 'easy', style: 'color: red;' }
	});

	expect(document.body.querySelector('span')).not.toBeNull();
	expect(document.body.querySelector('span').style.color).toBe('red');

	unmount(component);
});

test('Difficulty component with unknown text', () => {
	const component = mount(Difficulty, {
		target: document.body,
		props: { difficulty: 'ultra-hard' }
	});

	expect(document.body.querySelector('span')).not.toBeNull();
	expect(document.body.querySelector('span').textContent).toBe('Unknown difficulty ultra-hard');

	unmount(component);
});
