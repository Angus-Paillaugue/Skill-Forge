import { getRandomExercise } from '$lib/server/db/exercises';
import { redirect } from '@sveltejs/kit';
import { urlHealer } from '$lib/utils';

/** @type {import('./$types').RequestHandler} */
export async function load() {
	const exercise = await getRandomExercise();
	throw redirect(303, `../exercises/${urlHealer.identifier.join(exercise.slug, exercise.id)}`);
}
