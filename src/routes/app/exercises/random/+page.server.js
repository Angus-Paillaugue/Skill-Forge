import { createConnection } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { urlHealer } from '$lib/utils';

/** @type {import('./$types').RequestHandler} */
export async function load() {
	const db = await createConnection();
	try {
		const [exercise] = await db.query('SELECT * FROM exercises ORDER BY RAND() LIMIT 1');
		const randomExercise = exercise[0];
		throw redirect(303, `/app/exercises/${urlHealer.identifier.join(randomExercise.slug, randomExercise.id)}`);
	} finally {
		db.end();
	}
}
