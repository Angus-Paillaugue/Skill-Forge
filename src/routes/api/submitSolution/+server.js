import { json } from '@sveltejs/kit';
import { runTests } from '$lib/server/tests';
import { submitSolution } from '$lib/server/db/submissions';
import * as m from '$msgs';

export async function POST({ request, locals }) {
	const { user } = locals;
	const { exercise_id, user_input } = await request.json();

	try {
		const results = await runTests(exercise_id, user_input);

		// Some tests failed
		if (results.results.some((result) => !result.passed))
			return json({ error: m.error_messages_api_submit_test_failed(), results }, { status: 400 });
		const solutionId = await submitSolution(user.id, exercise_id, user_input, results);
		return json({
			message: m.error_messages_api_submit_test_success(),
			passed: true,
			results,
			submission: {
				submission: user_input,
				completed_at: new Date(),
				submission_id: solutionId,
				ram_usage: results.averageRamUsage
			}
		});
	} catch (error) {
		return json({ error: error.message }, { status: 500 });
	}
}
