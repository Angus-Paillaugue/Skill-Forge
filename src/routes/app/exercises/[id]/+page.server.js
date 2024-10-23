import { createConnection } from '$lib/server/db';
import { error } from '@sveltejs/kit';
import { compileMarkdown } from '$lib/server/markdown';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals, params }) {
	const { id: exerciseId } = params;
	const { user } = locals;
	const db = await createConnection();
	try {
		const [exercises] = await db.query(
			`
            SELECT
                e.id AS exercise_id,
                e.title,
                e.description,
                e.content,
                e.difficulty,
                e.created_at,
                -- Subquery to get tests without duplication
                (SELECT
                    JSON_ARRAYAGG(
                        JSON_OBJECT('input', et.input, 'expected_output', et.expected_output)
                    )
                FROM exercise_tests et
                WHERE et.exercise_id = e.id
                ) AS tests,
                -- Subquery to get submissions
                IF(
                    COUNT(uep.id) > 0,
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'submission_id', uep.id,
                            'submission', uep.submission,
                            'completed_at', uep.completed_at,
                            'ram_usage', uep.ram_usage
                        )
                    ),
                    JSON_ARRAY()
                ) AS submissions
            FROM
                exercises e
            LEFT JOIN
                submissions uep ON e.id = uep.exercise_id AND uep.user_id = ?
            WHERE
                e.id = ?
            GROUP BY
                e.id, e.title, e.description, e.content, e.difficulty, e.created_at;
        `,
			[user.id, exerciseId]
		);
		if (exercises.length === 0) throw new error(404, 'Exercise not found');

		const exercise = exercises[0];
		// Sort submissions by completed_at DESC
		exercise.submissions.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

		// Parse the exercise description from MD into html
		exercise.description = await compileMarkdown(exercise.description);

		return { exercise };
	} finally {
		db.end();
	}
}
