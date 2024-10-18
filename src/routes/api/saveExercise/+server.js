import { json } from '@sveltejs/kit';
import { createConnection } from '$lib/server/db';

export async function POST({ request, locals }) {
	const { id, title, description, difficulty, tests, content, category_id } = await request.json();
	const { user } = locals;
	if (!user.admin) {
		return json({ message: 'Unauthorized' }, { status: 401 });
	}

	if (
		!title ||
		!description ||
		!difficulty ||
		!tests ||
		!content ||
		!category_id ||
		tests.length === 0 ||
		!id
	) {
		return json({ message: 'Missing required fields' }, { status: 400 });
	}

	const db = await createConnection();
	try {
		// Update exercise
		await db.query(
			`
			UPDATE exercises
			SET title = ?, description = ?, difficulty = ?, content = ?, category_id = ?
			WHERE id = ?
		`,
			[title, description, difficulty, content, category_id, id]
		);

		// Delete existing tests
		await db.query('DELETE FROM exercise_tests WHERE exercise_id = ?', [id]);

		// Insert new tests
		const testsValues = tests.map(({ input, expected_output }) => [id, input, expected_output]);
		await db.query(
			`
			INSERT INTO exercise_tests (exercise_id, input, expected_output)
			VALUES ?
		`,
			[testsValues]
		);

		return json({ message: 'Exercise updated successfully' });
	} catch (error) {
		console.error(error);
		return json({ message: 'Error creating exercise' }, { status: 500 });
	} finally {
		await db.end();
	}
}
