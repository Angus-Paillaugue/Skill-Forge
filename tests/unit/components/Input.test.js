import { mount, unmount } from 'svelte';
import { expect, test } from 'vitest';
import { Input } from '$lib/components';

test('Simple input', () => {
	const component = mount(Input, {
		target: document.body,
		props: { id: 'test' }
	});

	expect(document.body.querySelector('input[type=text]').id).toBe('test');

	unmount(component);
});

test('Input with label', () => {
	const component = mount(Input, {
		target: document.body,
		props: { id: 'inputWithLabel', label: 'Label' }
	});

	expect(document.body.querySelector('input[type=text]').id).toBe('inputWithLabel');
	const label = document.body.querySelector('label');
	expect(label.getAttribute('for')).toBe('inputWithLabel');
	expect(label.textContent).toBe('Label');

	unmount(component);
});

test('Input with placeholder', () => {
	const component = mount(Input, {
		target: document.body,
		props: { id: 'inputWithPlaceholder', placeholder: 'Placeholder' }
	});

	expect(document.body.querySelector('input[type=text]').getAttribute('placeholder')).toBe(
		'Placeholder'
	);

	unmount(component);
});

test('Input with value', () => {
	const component = mount(Input, {
		target: document.body,
		props: { id: 'inputWithValue', value: 'Value' }
	});

	expect(document.body.querySelector('input[type=text]').value).toBe('Value');

	unmount(component);
});

test('Input with type', () => {
	const component = mount(Input, {
		target: document.body,
		props: { id: 'inputWithType', type: 'password' }
	});

	expect(document.body.querySelector('input[type=password]').id).toBe('inputWithType');

	unmount(component);
});
