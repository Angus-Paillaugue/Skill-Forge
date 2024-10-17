import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;
	const db = await createConnection();
	try {
		const [latestExercises] = await db.query(
			`
      SELECT DISTINCT
        e.id AS exercise_id,
        e.title,
        e.description,
        e.difficulty,
        e.created_at,
        cat.name AS category_name,
        CASE WHEN uep.completed_at IS NOT NULL THEN TRUE ELSE FALSE END AS solved
      FROM
        exercises e
      LEFT JOIN
        submissions uep ON e.id = uep.exercise_id AND uep.user_id = ?
      LEFT JOIN
        categories cat ON e.category_id = cat.id
      ORDER BY
        e.created_at DESC;
      `,
			[user.id]
		);
		return { latestExercises };
	} finally {
		db.end();
	}
}
