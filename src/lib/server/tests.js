import { createConnection } from '$lib/server/db';
import ivm from 'isolated-vm';

export async function runTests(exercise_id, user_input) {
	const db = await createConnection();
	const [tests] = await db.query(
		'SELECT input, expected_output FROM exercise_tests WHERE exercise_id = ?',
		[exercise_id]
	);
	db.end();

	const isolate = new ivm.Isolate({ memoryLimit: 128 }); // 128MB memory limit
	const context = await isolate.createContext();
	const jail = context.global;
	await jail.setSync('global', jail.derefInto());

	try {
		// Define the user function in the isolated environment
		await context.eval(user_input);

		const results = [];

		for (const test of tests) {
			const { input, expected_output } = test;

			try {
				// Ensure input is passed as a JSON-safe string
				const result = await context.eval(
					input,
					{ timeout: 1000 } // 1-second timeout
				);

				results.push({
					input,
					expected_output,
					actual_output: result,
					passed: result == expected_output
				});
			} catch (error) {
				results.push({
					input,
					expected_output,
					actual_output: null,
					error: error.message,
					passed: false
				});
			}
		}

		return results;
	} catch (error) {
		console.error(error);
		return [];
	} finally {
		// Clean up
		isolate.dispose();
	}
}
