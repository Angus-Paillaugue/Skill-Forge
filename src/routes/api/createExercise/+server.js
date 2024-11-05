import { json } from '@sveltejs/kit';
import { createExercise } from '$lib/server/db/exercises';
import { urlHealer } from '$lib/utils';
import * as m from '$msgs';

export async function POST({ request, locals }) {
	const { title, description, difficulty, tests, content } = await request.json();
	const { user } = locals;
	if (!user.admin) {
		return json({ message: m.error_messages_unauthorized() }, { status: 401 });
	}

	if (!title || !description || !difficulty || !tests || !content) {
		return json({ message: m.error_messages_missing_fields() }, { status: 400 });
	}
	const slug = urlHealer.sanitize(title);
	try {
		const newExerciseId = await createExercise({
			title,
			description,
			content,
			difficulty,
			tests,
			languageId: 1
		});
		return json({
			message: m.error_messages_api_create_exercise_success(),
			id: newExerciseId,
			slug
		});
	} catch (error) {
		return json({ message: m.error_messages_api_create_exercise_unknown_error() }, { status: 500 });
	}
}
