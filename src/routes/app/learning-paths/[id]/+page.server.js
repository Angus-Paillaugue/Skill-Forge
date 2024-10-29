import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, locals }) {
	const { user } = locals;
	const { id } = params;
	const db = await createConnection();
	try {
		const [path] = await db.query(
			`
            SELECT
                lp.id,
                lp.name,
                lp.description,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', e.id,
                        'slug', e.slug,
                        'title', e.title,
                        'difficulty', e.difficulty,
                        'is_completed', IF(s.latest_submission_id IS NOT NULL, TRUE, FALSE)
                    )
                ) AS exercises
            FROM
                learning_paths lp
            LEFT JOIN
                exercises e ON lp.id = e.learning_path_id
            LEFT JOIN (
                SELECT
                    s1.id AS latest_submission_id,
                    s1.exercise_id,
                    s1.completed_at
                FROM
                    submissions s1
                INNER JOIN (
                    SELECT
                        MAX(s2.id) AS latest_id
                    FROM
                        submissions s2
                    WHERE
                        s2.user_id = ?
                    GROUP BY
                        s2.exercise_id
                ) AS latest_sub ON s1.id = latest_sub.latest_id
            ) s ON e.id = s.exercise_id
            WHERE
                lp.id = ?
            GROUP BY
                lp.id, lp.name, lp.description;
      `,
			[user.id, id]
		);
		return { path: path[0] };
	} finally {
		db.end();
	}
}
