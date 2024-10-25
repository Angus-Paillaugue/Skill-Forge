import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;
	const db = await createConnection();
	try {
		const [rank] = await db.query(
			`
      WITH user_rankings AS (
      SELECT
        u.id AS user_id,
        u.username,
        COUNT(DISTINCT s.exercise_id) AS distinct_exercise_count,
        RANK() OVER (ORDER BY COUNT(DISTINCT s.exercise_id) DESC) AS user_rank
      FROM
        users u
      LEFT JOIN
        submissions s ON u.id = s.user_id
      GROUP BY
        u.id, u.username
    )
    SELECT
      user_rankings.user_id,
      user_rankings.username,
      user_rankings.user_rank,
      user_rankings.distinct_exercise_count,
       (SELECT COUNT(*) FROM exercises) AS no_exercises
    FROM
      user_rankings
    WHERE
      user_id = ?;
    `,
			[user.id]
		);
		const [recentActivity] = await db.query(
			`
      SELECT
        s.completed_at,
        e.id AS exercise_id,
        e.difficulty AS exercise_difficulty,
        e.title,
        e.slug
      FROM
        submissions s
      JOIN
        exercises e ON s.exercise_id = e.id
      WHERE
        s.user_id = ?
      ORDER BY
        s.completed_at DESC
      LIMIT 50;
    `,
			[user.id]
		);
		const [contributions] = await db.query(
			`
      SELECT
          DATE(s.completed_at) AS submission_date,
          COUNT(s.id) AS submission_count
      FROM
          submissions s
      WHERE
          s.user_id = ?
          AND s.completed_at >= CURDATE() - INTERVAL 1 YEAR
      GROUP BY
          DATE(s.completed_at)
      ORDER BY
          submission_date ASC;
    `,
			[user.id]
		);
		return { rank: rank[0], user, recentActivity, contributions };
	} finally {
		db.end();
	}
}
