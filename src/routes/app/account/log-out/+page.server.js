import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ cookies, locals }) {
	locals.user = undefined;
	cookies.delete('token', { path: '/' });

	throw redirect(303, '/log-in');
}
