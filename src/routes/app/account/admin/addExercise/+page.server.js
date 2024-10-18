import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const db = await createConnection();
	const [categories] = await db.query('SELECT * FROM categories');
	db.end();
	return { categories };
}
