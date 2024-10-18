import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

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
			throw redirect(307, '/log-in');
		}
	}
	// User is not logged in and trying to access a protected route
	if ((url.pathname.startsWith('/app') || url.pathname.startsWith('/api')) && !locals.user) {
		cookies.delete('token', { path: '/' });
		throw redirect(307, '/log-in');
	}
	// User is logged in and trying to access a public route
	if (!url.pathname.startsWith('/app') && !url.pathname.startsWith('/api') && locals.user) {
		throw redirect(307, '/app');
	}
	// User is logged in and trying to access an admin route without admin privileges
	if (url.pathname.startsWith('/app/account/admin') && !locals.user.admin) {
		throw redirect(307, '/app/account');
	}

	return resolve(event);
};
