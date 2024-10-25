import { createConnection } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { compileMarkdown } from '$lib/server/markdown';
import { urlHealer } from '$lib/utils';

export const load = async ({ params, locals }) => {
	const urlSlug = urlHealer.sanitize(params.slug);
	const { user } = locals;

	// Isolate the identifier at the end of the URL
	const identifier = urlHealer.identifier.separate(urlSlug);
	if (!identifier) {
		error(404, 'Exercise not found');
	}
	const db = await createConnection();

	// Fetch the post by its identifier
	let exercise;
	if (identifier.id) {
		const [exercises] = await db.query(
			`
        SELECT
            e.id AS exercise_id,
            e.title,
            e.description,
            e.slug,
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
			[user.id, identifier.id]
		);
		if (exercises.length > 0) {
			exercise = exercises[0];
			// Sort submissions by completed_at DESC
			exercise.submissions.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

			// Parse the exercise description from MD into html
			exercise.description = await compileMarkdown(exercise.description);
		}
	}
	// If the identifier is a slug, fetch the post by its slug
	if (!exercise) {
		const [exercises] = await db.query(
			`
        SELECT
            e.id AS exercise_id,
            e.title,
            e.description,
            e.slug,
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
            e.slug = ?
        GROUP BY
            e.id, e.title, e.description, e.content, e.difficulty, e.created_at;
    `,
			[user.id, identifier.slug]
		);
		if (exercises.length > 0) {
			exercise = exercises[0];
			// Sort submissions by completed_at DESC
			exercise.submissions.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

			// Parse the exercise description from MD into html
			exercise.description = await compileMarkdown(exercise.description);
		} else {
			error(404, 'Exercise not found');
		}
	}

	db.end();

	// Redirect to the correct URL if the slug is incorrect or is missing the identifier
	const correctUrl = urlHealer.identifier.join(exercise.slug, exercise.exercise_id);
	if (urlSlug !== correctUrl) redirect(307, `/app/exercises/${correctUrl}`);

	return {
		exercise
	};  
};
