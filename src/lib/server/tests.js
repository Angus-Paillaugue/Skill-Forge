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
			let { input, expected_output } = test;

			// Add support for boolean values
			if (expected_output == 'true' || expected_output == 'false') {
				expected_output = expected_output == 'true';
			}
			try {
				// Measure memory usage before the test
				const memStart = process.memoryUsage().heapUsed;

				// Run the test in the isolate
				const result = await context.eval(input, { timeout: 1000 });

				// Measure memory usage after the test
				const memEnd = process.memoryUsage().heapUsed;

				const memUsage = memEnd - memStart; // Memory usage in B

				results.push({
					input,
					expected_output,
					actual_output: result || " ",
					passed: result == expected_output,
					memUsage // Memory usage for this test
				});
			} catch (error) {
				results.push({
					input,
					expected_output,
					actual_output: " ",
					error: error.message,
					passed: false,
					memUsage: null
				});
			}
		}
		const averageRamUsage =
			results.map((r) => r.memUsage).reduce((a, b) => a + b, 0) / results.length;

		return { results, averageRamUsage };
	} catch (error) {
		console.error(error);
		return { message: 'Failed to run tests' };
	} finally {
		// Clean up
		isolate.dispose();
	}
}
