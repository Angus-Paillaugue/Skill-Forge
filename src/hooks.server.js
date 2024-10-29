import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

/**
 * Checks if a URL starts with a given path.
 *
 * @param {string} url - The URL to check.
 * @param {string|string[]} path - The path or an array of paths to compare with the URL.
 * @returns {boolean} Returns true if the URL starts with the path(s), otherwise returns false.
 */
function urlStartsWith(url, path) {
	if (!url || !path) return false;
	if (path instanceof Array) return path.some((p) => urlStartsWith(url, p));
	// For the `/` path
	if (path.length === 1) return url.at(-1) === path;

	return url.startsWith(path) || url.startsWith(path + '/');
}

const PROTECTED_ROUTES = ['/app', '/api'];

export const handle = async ({ event, resolve }) => {
	const { url, cookies, locals } = event;

	const token = cookies.get('token') || false;

	if (token) {
		const user = await auth(token);
		if (!user.error) {
			locals.user = user;
		} else {
			cookies.delete('token', { path: '/' });
			locals.user = undefined;
			throw redirect(307, '/');
		}
	}
	// User is not logged in and trying to access a protected route
	if ((url.pathname.startsWith('/app') || url.pathname.startsWith('/api')) && !locals.user) {
		cookies.delete('token', { path: '/' });
		throw redirect(307, '/');
	}
	// User is logged in and trying to access a public route
	if (!url.pathname.startsWith('/app') && !url.pathname.startsWith('/api') && locals.user) {
		throw redirect(307, '/app');
	}
	// User is logged in and trying to access an admin route without admin privileges
	if (url.pathname.startsWith('/app/account/admin') && !locals.user.admin) {
		throw redirect(307, '/app/account');
	}

	const response = await resolve(event);
	response.headers.set(
		'X-Robots-Tag',
		urlStartsWith(url.pathname, PROTECTED_ROUTES) ? 'noindex, nofollow' : 'index, follow'
	);

	return response;
};
