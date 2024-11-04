import { getExerciseData } from '$lib/server/db/exercises';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { id: exerciseId } = params;

	const exercise = await getExerciseData(exerciseId);
	return { exercise };
}
