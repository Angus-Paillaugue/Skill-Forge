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
        e.slug,
        e.description,
        e.difficulty,
        e.created_at,
        l.name AS language,
        CASE WHEN uep.completed_at IS NOT NULL THEN TRUE ELSE FALSE END AS solved
      FROM
        exercises e
      LEFT JOIN
        submissions uep ON e.id = uep.exercise_id AND uep.user_id = ?
      LEFT JOIN
        languages l ON e.language_id = l.id
      ORDER BY
        e.created_at DESC;
      `,
			[user.id]
		);
		latestExercises.map((exercise) => {
			exercise.created_at = exercise.created_at.toISOString();
		});
		return { latestExercises };
	} finally {
		db.end();
	}
}
