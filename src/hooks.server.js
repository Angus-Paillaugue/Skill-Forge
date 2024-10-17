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
	if (url.pathname.startsWith('/app') && !locals.user) {
		locals.user = undefined;
		throw redirect(307, '/log-in');
	}
	if (!url.pathname.startsWith('/app') && !url.pathname.startsWith('/api') && locals.user) {
		throw redirect(307, '/app');
	}
	if (url.pathname.startsWith('/app/account/admin') && !locals.user.admin) {
		throw redirect(307, '/app/account');
	}
	return resolve(event);
};
