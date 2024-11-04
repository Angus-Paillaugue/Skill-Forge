import { getLatestExercises } from '$lib/server/db/exercises';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const {
		user: { id: userId }
	} = locals;

	const latestExercises = await getLatestExercises(userId);

	return { latestExercises };
}
