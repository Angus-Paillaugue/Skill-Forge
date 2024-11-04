import { json } from '@sveltejs/kit';
import { createExercise } from '$lib/server/db/exercises';
import { urlHealer } from '$lib/utils';

export async function POST({ request, locals }) {
	const { title, description, difficulty, tests, content } = await request.json();
	const { user } = locals;
	if (!user.admin) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	if (!title || !description || !difficulty || !tests || !content) {
		return json({ message: 'Missing required fields' }, { status: 400 });
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
		return json({ message: 'Exercise created successfully', id: newExerciseId, slug });
	} catch (error) {
		return json({ message: 'Error creating exercise' }, { status: 500 });
	}
}
