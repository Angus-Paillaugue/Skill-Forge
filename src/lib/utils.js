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
	node.style.border = isOpen ? '' : 'none';
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
				node.style.border = isOpen ? '' : 'none';
				animation.reverse();
			}
			// Used for nested accordions
			animation.onfinish = () => {
				animation.cancel();
				node.style.height = isOpen ? 'auto' : '0';
				node.style.border = isOpen ? '' : 'none';
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

/**
 * Convert'All tests passed's a number of bytes into a human-readable string with the appropriate unit.
 *
 * @param {number} bytes - The number of bytes to be converted.
 * @param {number} [decimals=2] - The number of decimal places to include in the formatted string.
 * @returns {string} The formatted string representing the bytes in a human-readable format.
 */
export function formatBytes(bytes, decimals = 2) {
	if (bytes == 0) return '0 Bytes';
	const k = 1024,
		sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
		i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * A collection of utility functions for working with URLs.
 */
export const urlHealer = {
	/**
	 * Separates the identifier and slug from a given URL.
	 * @param {string} url - The URL to separate.
	 * @returns {Object} An object containing the separated identifier and slug.
	 * - id: The identifier extracted from the URL.
	 * - slug: The slug extracted from the URL.
	 */
	identifier: {
		separate: (url) => {
			const regex = /(\d+)$/;
			const [, id] = url.match(regex) || [];
			const rest = url
				.replace(regex, '')
				.split('-')
				.filter((e) => e);

			return {
				id: Number(id),
				slug: rest.join('-')
			};
		},
		/**
		 * Joins the slug and identifier to form a URL.
		 * @param {string} slug - The slug part of the URL.
		 * @param {string} id - The identifier part of the URL.
		 * @returns {string} The joined URL.
		 */
		join: (slug, id) => `${slug}-${id}`
	},
	/**
	 * Sanitizes a given URL by removing special characters and converting it to lowercase.
	 * @param {string} url - The URL to sanitize.
	 * @returns {string} The sanitized URL.
	 */
	sanitize: (url) =>
		url
			.trim()
			.replace(/([a-z])([A-Z])/g, '$1-$2')
			.replace(/\W/g, (m) => (/[À-ž]/.test(m) ? m : '-'))
			.replace(/^-+|-+$/g, '')
			.replace(/-{2,}/g, '-')
			.toLowerCase()
};
