import { writable } from 'svelte/store';
import Toaster from './Toaster.svelte';
import * as m from "$msgs";

export const toasts = writable([]);

/**
 * The `toast` class provides methods to create and manage toast notifications.
 * It supports different types of toasts such as success, error, warning, and info.
 * Each toast has a unique identifier, a title, a message, and an optional timeout duration after which it is automatically removed.
 *
 * @class
 */
export class toast {
	/**
	 * A static object containing default titles for different types of toast notifications.
	 * @type {Object}
	 * @property {string} success - The title for success notifications.
	 * @property {string} error - The title for error notifications.
	 * @property {string} warning - The title for warning notifications.
	 * @property {string} info - The title for informational notifications.
	 */
	static baseToastTitles = {
		success: m.components_toast_title_success(),
		error: m.components_toast_title_error(),
		warning: m.components_toast_title_warning(),
		info: m.components_toast_title_info()
	};

	/**
	 * Generates a unique identifier string based on the current timestamp and a random number.
	 * @returns {string} A unique identifier string.
	 */
	static #generateId = () => Date.now().toString() + Math.floor(Math.random() * 10000).toString();

	/**
	 * Creates a new toast notification and adds it to the toasts array.
	 * The toast will be removed after the specified timeout.
	 *
	 * @param {Object} options - The options for the new toast.
	 * @param {string} [options.type='info'] - The type of the toast (e.g., 'info', 'success', 'error').
	 * @param {string} [options.title=toast.baseToastTitles[type]] - The title of the toast.
	 * @param {string} [options.message=''] - The message of the toast.
	 * @param {number} [options.timeout=5000] - The duration in milliseconds before the toast is removed.
	 * @private
	 */
	static #newToast({
		type = 'info',
		title = toast.baseToastTitles[type],
		message = '',
		timeout = 5000
	}) {
		const newToast = {
			type,
			title,
			message,
			id: toast.#generateId(),
			timeout
		};

		// Add the new toast to the beginning of toasts the array.
		toasts.update((oldToast) => {
			oldToast.push(newToast);
			return oldToast;
		});

		// Remove the toast after the timeout.
		if (!newToast.timeout) return;
		setTimeout(() => {
			toast.removeToast(newToast.id);
		}, newToast.timeout);
	}

	/**
	 * Displays a success toast notification.
	 *
	 * @param {Object} options - The options for the error toast.
	 * @param {string} options.title - The title of the toast.
	 * @param {string} options.message - The message of the toast.
	 * @param {number} [options.timeout] - The duration before the toast disappears (in milliseconds).
	 */
	static success({ title, message, timeout }) {
		toast.#newToast({ type: 'success', title, message, timeout });
	}

	/**
	 * Displays an error toast notification.
	 *
	 * @param {Object} options - The options for the error toast.
	 * @param {string} options.title - The title of the toast.
	 * @param {string} options.message - The message of the toast.
	 * @param {number} [options.timeout] - The duration before the toast disappears (in milliseconds).
	 */
	static error({ title, message, timeout }) {
		toast.#newToast({ type: 'error', title, message, timeout });
	}

	/**
	 * Displays a warning toast notification.
	 *
	 * @param {Object} options - The options for the warning toast.
	 * @param {string} options.title - The title of the toast.
	 * @param {string} options.message - The message of the toast.
	 * @param {number} [options.timeout] - The duration (in milliseconds) the toast should be displayed.
	 */
	static warning({ title, message, timeout }) {
		toast.#newToast({ type: 'warning', title, message, timeout });
	}

	/**
	 * Displays an informational toast notification.
	 *
	 * @param {Object} options - The options for the toast notification.
	 * @param {string} options.title - The title of the toast notification.
	 * @param {string} options.message - The message of the toast notification.
	 * @param {number} options.timeout - The duration (in milliseconds) the toast should be displayed.
	 */
	static info({ title, message, timeout }) {
		toast.#newToast({ type: 'info', title, message, timeout });
	}

	/**
	 * Removes a toast from the toasts array based on its id.
	 * @param {number} id - The id of the toast to be removed.
	 */
	static removeToast(id) {
		toasts.update((all) => all.filter((t) => t.id !== id));
	}
}

export default Toaster;
