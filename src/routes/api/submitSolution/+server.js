import { json } from '@sveltejs/kit';
import { runTests } from '$lib/server/tests';
import { createConnection } from '$lib/server/db';

export async function POST({ request, locals }) {
	const { user } = locals;
	const { exercise_id, user_input } = await request.json();

	try {
		const results = await runTests(exercise_id, user_input);

		// Some tests failed
		if (results.results.some((result) => !result.passed))
			return json({ error: 'Some tests failed', results }, { status: 400 });

		const db = await createConnection();
		const [solutionExists] = await db.query(
			`
			SELECT id FROM submissions
			WHERE user_id = ? AND exercise_id = ? AND submission = ?
		`,
			[user.id, exercise_id, user_input]
		);

		if (solutionExists.length > 0)
			return json({ error: 'You already submitted this solution!', results }, { status: 400 });

		const [insertedRow] = await db.query(
			`
			INSERT INTO submissions (user_id, exercise_id, submission, ram_usage)
			VALUES (?, ?, ?, ?)
		`,
			[user.id, exercise_id, user_input, results.averageRamUsage]
		);
		db.end();
		return json({
			message: 'All tests passed',
			passed: true,
			results,
			submission: {
				submission: user_input,
				completed_at: new Date(),
				submission_id: insertedRow.insertId,
				ram_usage: results.averageRamUsage
			}
		});
	} catch (error) {
		console.error(error);
		return json({ error: error.message }, { status: 500 });
	}
}
