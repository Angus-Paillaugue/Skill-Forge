import { json } from '@sveltejs/kit';
import { createConnection } from '$lib/server/db';
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
	const db = await createConnection();
	try {
		const [newExercise] = await db.query(
			'INSERT INTO exercises (title, slug, description, content, difficulty) VALUES (?, ?, ?, ?, ?)',
			[title, slug, description, content, difficulty]
		);
		const newExerciseId = newExercise.insertId;
		for (const test of tests) {
			await db.query(
				'INSERT INTO exercise_tests (exercise_id, input, expected_output) VALUES (?, ?, ?)',
				[newExerciseId, test.input, test.expected_output]
			);
		}
		return json({ message: 'Exercise created successfully', id: newExerciseId, slug });
	} catch (error) {
		console.error(error);
		return json({ message: 'Error creating exercise' }, { status: 500 });
	} finally {
		await db.end();
	}
}
