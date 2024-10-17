import { createConnection } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;
	const { id } = user;
	const db = await createConnection();
	await db.query('DELETE FROM submissions WHERE user_id = ?', [id]);
	await db.query('DELETE FROM users WHERE userId = ?', [id]);
	db.end();

	throw redirect(303, '/sign-in');
}
