import { json } from '@sveltejs/kit';
import { updateExercise } from '$lib/server/db/exercises';

export async function POST({ request, locals }) {
	const { id, title, description, difficulty, tests, content } = await request.json();
	const { user } = locals;
	if (!user.admin) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	if (!title || !description || !difficulty || !tests || !content || tests.length === 0 || !id) {
		return json({ message: 'Missing required fields' }, { status: 400 });
	}

	try {
		// Update exercise
		await updateExercise({ id, title, description, content, difficulty, tests });

		return json({ message: 'Exercise updated successfully' });
	} catch (_error) {
		return json({ message: 'Error creating exercise' }, { status: 500 });
	}
}
