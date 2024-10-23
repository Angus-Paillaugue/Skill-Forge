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

/**
 * Converts a number of bytes into a human-readable string with the appropriate unit.
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
 * Strips various Markdown elements from a given string.
 *
 * @param {string} markdown - The Markdown string to be stripped.
 * @returns {string} - The cleaned text with Markdown elements removed.
 *
 * The function performs the following operations:
 * - Strips headers
 * - Strips emphasis (bold, italic, etc.)
 * - Strips strikethrough
 * - Strips inline code
 * - Strips blockquotes
 * - Strips links (keeps the link text)
 * - Strips images (keeps the alt text)
 * - Strips unordered lists
 * - Strips ordered lists
 * - Strips horizontal rules
 * - Strips code blocks
 */
export function stripMD(markdown) {
    // Strip headers
    let text = markdown.replace(/^#{1,6}\s+/gm, '');

    // Strip emphasis (bold, italic, etc.)
    text = text.replace(/(\*\*|__)(.*?)\1/g, '$2')   // bold
               .replace(/(\*|_)(.*?)\1/g, '$2');     // italic

    // Strip strikethrough
    text = text.replace(/~~(.*?)~~/g, '$1');

    // Strip inline code
    text = text.replace(/`([^`]+)`/g, '$1');

    // Strip blockquotes
    text = text.replace(/^\s*>+/gm, '');

    // Strip links (keep the link text)
    text = text.replace(/\[([^\]]+)]\([^)]+\)/g, '$1');

    // Strip images (keep the alt text)
    text = text.replace(/!\[([^\]]*)]\([^)]+\)/g, '$1');

    // Strip unordered lists
    text = text.replace(/^\s*[*+-]\s+/gm, '');

    // Strip ordered lists
    text = text.replace(/^\d+\.\s+/gm, '');

    // Strip horizontal rules
    text = text.replace(/^-{3,}$/gm, '');

    // Strip code blocks
    text = text.replace(/```[\s\S]*?```/g, '');

    // Return the cleaned text
    return text.trim();
}
