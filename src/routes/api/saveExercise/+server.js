import { json } from '@sveltejs/kit';
import { updateExercise } from '$lib/server/db/exercises';
import * as m from '$msgs';

export async function POST({ request, locals }) {
	const { id, title, description, difficulty, tests, content } = await request.json();
	const { user } = locals;
	if (!user.admin) {
		return json({ message: m.error_messages_unauthorized() }, { status: 401 });
	}

	if (!title || !description || !difficulty || !tests || !content || tests.length === 0 || !id) {
		return json({ message: m.error_messages_missing_fields() }, { status: 400 });
	}

	try {
		// Update exercise
		await updateExercise({ id, title, description, content, difficulty, tests });

		return json({ message: m.error_messages_api_save_exercise_success() });
	} catch (_error) {
		return json({ message: m.error_messages_api_save_exercise_unknown_error() }, { status: 500 });
	}
}
