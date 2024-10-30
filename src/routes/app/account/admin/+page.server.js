import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;
	const db = await createConnection();
	const [noUsers] = await db.query('SELECT COUNT(*) count FROM users');
	const [noExercises] = await db.query('SELECT COUNT(*) count FROM exercises');
	const [allExercises] = await db.query('SELECT * FROM exercises');
	db.end();

	return { noUsers: noUsers[0].count, noExercises: noExercises[0].count, allExercises, user };
}
