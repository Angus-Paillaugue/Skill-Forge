import { createConnection } from '$lib/server/db';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { id } = params;
	const db = await createConnection();
	try {
		const [exercise] = await db.query(
			`
			SELECT
					e.id AS exercise_id,
					e.title,
					e.description,
					e.content,
					e.difficulty,
					e.created_at,
					-- Subquery to get tests without duplication
					(
						SELECT
							JSON_ARRAYAGG(
								JSON_OBJECT('input', et.input, 'expected_output', et.expected_output)
							)
						FROM exercise_tests et
						WHERE et.exercise_id = e.id
					) AS tests
			FROM
					exercises e
			WHERE
					e.id = ?
			GROUP BY
					e.id, e.title, e.description, e.content, e.difficulty, e.created_at, cat.name;
		`,
			[id]
		);
		if (!exercise.length) throw new error(404, { message: 'Exercise not found' });
		return { exercise: exercise[0] };
	} catch (err) {
		console.error(err);
		throw new error(500, { message: 'Failed to load exercise' });
	} finally {
		db.end();
	}
}
