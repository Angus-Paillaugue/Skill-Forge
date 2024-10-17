/**
 * Formats a given date using the specified date style and locale.
 * @param {Date} date - The date to format.
 * @param {string} [dateStyle='medium'] - The style of the date. Defaults to 'medium'.
 * @param {string} [locales='en'] - The locale to use for formatting. Defaults to 'en'.
 * @returns {string} The formatted date.
 */
export function formatDate(date, dateStyle = 'medium', locales = 'en') {
	if (!(date instanceof Date)) {
		date = new Date(date);
	}
	// Safari is mad about dashes in the date
	const dateFormatter = new Intl.DateTimeFormat(locales, {
		dateStyle,
		timezone: 'UTC'
	});
	return dateFormatter.format(date);
}
/**
 * Creates an accordion effect on the specified node.
 * @param {HTMLElement} node - The HTML element to apply the accordion effect to.
 * @param {boolean} isOpen - Specifies whether the accordion is initially open or closed.
 * @returns {Object} - An object with an `update` method to control the accordion state.
 */
export function accordion(node, isOpen) {
	node.style.overflow = 'hidden';
	node.style.height = isOpen ? 'auto' : '0';
	node.classList.add('accordion');
	return {
		update(isOpen) {
			let animation = node.animate(
				[
					{
						height: node.scrollHeight + 'px'
					},
					{
						height: 0
					}
				],
				{ duration: Math.max(node.scrollHeight, 150), fill: 'both' }
			);
			animation.pause();
			if (!isOpen) {
				animation.play();
			} else {
				animation.reverse();
			}
			// Used for nested accordions
			animation.onfinish = () => {
				animation.cancel();
				node.style.height = isOpen ? 'auto' : '0';
			};
		}
	};
}

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Appends strings of classes. If non-truthy values are passed, they are ignored.
 * Uses tailwind-merge to merge tailwind classes.
 */
export function cn(...inputs) {
	return twMerge(clsx(inputs));
}
