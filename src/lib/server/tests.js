import { createConnection } from '$lib/server/db';
import ivm from 'isolated-vm';

function isEquals(result, expected) {
	if (typeof result === 'object' && typeof expected === 'object') {
		return JSON.stringify(result) === JSON.stringify(expected);
	}
	return result === expected;
}

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
	let consoleOutput = [];
	jail.setSync('log_user_log', function (...args) {
		if(args.length > 1) {
			consoleOutput.push(JSON.stringify(args));
		}else {
			if(typeof args[0] === 'object') {
				consoleOutput.push(JSON.stringify(args[0]));
			}else {
				consoleOutput.push(args[0].toString());
			}
		}
	});

	try {
		// Define the user function in the isolated environment
		await context.eval(user_input.replaceAll('console.log(', 'log_user_log('));

		const results = [];

		for (const test of tests) {
			let { input, expected_output } = test;

			// Add support for all types
			if (expected_output == 'true' || expected_output == 'false') {
				expected_output = expected_output == 'true';
			} else if (expected_output == 'null') {
				expected_output = null;
			} else if (expected_output == 'undefined') {
				expected_output = undefined;
			} else if (!isNaN(expected_output)) {
				expected_output = Number(expected_output);
			} else if (expected_output.startsWith('"') && expected_output.endsWith('"')) {
				expected_output = expected_output.slice(1, -1);
			} else if (expected_output.startsWith('[') && expected_output.endsWith(']')) {
				expected_output = JSON.parse(expected_output);
			} else if (expected_output.startsWith('{') && expected_output.endsWith('}')) {
				expected_output = JSON.parse(expected_output);
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
					actual_output: JSON.stringify(result),
					passed: isEquals(result, expected_output),
					consoleOutput: consoleOutput.length > 0 ? consoleOutput : null,
					memUsage // Memory usage for this test
				});

				consoleOutput = [];
			} catch (error) {
				results.push({
					input,
					expected_output,
					actual_output: ' ',
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
