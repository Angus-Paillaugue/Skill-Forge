import { getExerciseTests } from '$lib/server/db/exercises.js';
import ivm from 'isolated-vm';
import { exec } from 'child_process';
import fs from 'fs/promises';
import { randomBytes } from 'crypto';
import * as m from '$msgs';
import path from 'path';

/**
 * Compares two values for equality. If both values are objects, they are
 * compared by their JSON string representations. Otherwise, they are
 * compared using strict equality.
 *
 * @param {*} result - The first value to compare.
 * @param {*} expected - The second value to compare.
 * @returns {boolean} - Returns `true` if the values are equal, otherwise `false`.
 */
function isEquals(result, expected) {
	if (typeof result === 'object' && typeof expected === 'object') {
		return JSON.stringify(result) === JSON.stringify(expected);
	}
	return result === expected;
}

/**
 * Runs a series of JavaScript tests in an isolated environment with a memory limit.
 *
 * @param {Array} tests - An array of test objects, each containing `input` and `expected_output`.
 * @param {string} user_input - The user-defined JavaScript code to be tested.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the test results, average RAM usage, and console output.
 */
async function runJavaScriptTests(tests, user_input) {
	const isolate = new ivm.Isolate({ memoryLimit: 20 }); // 20MB memory limit
	const context = await isolate.createContext();
	const jail = context.global;
	await jail.setSync('global', jail.derefInto());
	let consoleOutput = [];
	context.evalClosureSync(
		`
			globalThis.console = {
				log: $0
			}
		`,
		[
			(...args) => {
				if (args.length > 1) {
					consoleOutput.push(JSON.stringify(args));
				} else {
					if (typeof args[0] === 'object') {
						consoleOutput.push(JSON.stringify(args[0]));
					} else {
						consoleOutput.push(args[0].toString());
					}
				}
			}
		]
	);

	try {
		// Define the user function in the isolated environment
		await context.eval(user_input);

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
					memUsage // Memory usage for this test
				});
			} catch (error) {
				results.push({
					input,
					expected_output,
					actual_output: null,
					error: error.message,
					passed: false,
					memUsage: null
				});
			}
		}
		const averageRamUsage =
			results.map((r) => r.memUsage).reduce((a, b) => a + b, 0) / results.length;

		return {
			results,
			averageRamUsage,
			ok: true,
			consoleOutput
		};
	} catch (error) {
		return { message: error, ok: false };
	} finally {
		// Clean up
		isolate.dispose();
	}
}

/**
 * Runs Python tests in an isolated Docker environment.
 *
 * @param {Array} tests - Array of test cases with input and expected output.
 * @param {string} userInput - The user-provided code to be tested.
 * @returns {Promise<Object>} - Results for each test, and any console output.
 */
export async function runPythonTests(tests, userInput) {
	const scriptId = randomBytes(16).toString('hex');
	const scriptPath = `/tmp/test_script_${scriptId}.py`;

	// Generate the Python code dynamically based on the user's code and tests
	const pythonScript = `
${userInput}

# Define a list to store test results
test_results = []

# Test function
def run_test(input_val, expected_output):
	try:
		result = input_val  # Adapt this line to match the function name in userInput
		test_results.append({
			"input": input_val,
			"expected_output": expected_output,
			"actual_output": result,
			"passed": result == expected_output
		})
	except Exception as e:
		test_results.append({
			"input": input_val,
			"expected_output": expected_output,
			"actual_output": str(e),
			"passed": False,
		})

# Execute each test
${tests.map((test) => `run_test(${test.input}, ${test.expected_output})`).join('\n')}

print(test_results)
`;

	// Write the script to a temp file
	await fs.writeFile(scriptPath, pythonScript);

	// Run the Docker container with CPU and memory limits
	try {
		const output = await new Promise((resolve, reject) => {
			exec(
				`sudo docker run --rm --memory=50m --cpus="0.5" -v ${scriptPath}:/app/test_script.py python-runner`,
				(error, stdout, stderr) => {
					if (error) {
						reject({ error: stderr || stdout });
					} else {
						resolve(stdout);
					}
				}
			);
		});

		const consoleOutput = output
			.split('\n')
			.filter((e) => e)
			.slice(0, -1);
		const parsedOutput = JSON.parse(
			output
				.split('\n')
				.filter((e) => e)
				.at(-1)
				.trim()
				.replace(/'/g, '"')
				.replace(/True/g, 'true')
				.replace(/False/g, 'false')
		);
		return {
			results: parsedOutput,
			consoleOutput,
			averageRamUsage: null,
			ok: true
		};
	} catch (parseError) {
		return {
			message:
				parseError?.error
					?.split('\n')
					?.filter((e) => e)
					?.at(-1) ?? m.run_tests_filed_to_run_tests(),
			consoleOutput: null,
			ok: false
		};
	} finally {
		await fs.unlink(scriptPath);
	}
}

/**
 * Runs Java tests in an isolated Docker environment.
 *
 * @param {Array} tests - Array of test cases with input and expected output.
 * @param {string} userInput - The user-provided code to be tested.
 * @returns {Promise<Object>} - Results for each test, and any console output.
 */
async function runJavaTests(tests, user_input) {
	// Extract the class name from the user input
	const classNameMatch = user_input.match(/public class (\w+)/);
	if (!classNameMatch) {
		throw new Error('User input does not contain a public class declaration.');
	}
	const className = classNameMatch[1];

	// Create temporary file paths
	const testFilePath = path.join('/tmp', `Test${Date.now()}.java`);
	const testScriptName = path.basename(testFilePath, '.java');
	const userInputScriptPath = path.join('/tmp', `${className}.java`);

	const testScript = `
import java.util.*;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class ${testScriptName} {

    public List<Map<String, Object>> runTests() {
        List<Map<String, Object>> testResults = new ArrayList<>();
        ${tests
					.map(
						(test) => `
        try {
            Object result = ${test.input};
            Map<String, Object> testResult = new HashMap<>();
            testResult.put("expected_output", ${test.expected_output});
            testResult.put("actual_output", result);
            testResults.add(testResult);
        } catch (Exception e) {
            Map<String, Object> testResult = new HashMap<>();
            testResult.put("expected_output", ${test.expected_output});
            testResult.put("actual_output", e.getMessage());
            testResults.add(testResult);
        }
        `
					)
					.join('\n')}
        return testResults;
    }

    public static void main(String[] args) {
        ${testScriptName} tester = new ${testScriptName}();
        List<Map<String, Object>> results = tester.runTests();
        Gson gson = new GsonBuilder().create();
        String jsonResults = gson.toJson(results);
        System.out.println(jsonResults);
    }
}`;

	// Write the Java code to a temporary file
	await fs.writeFile(testFilePath, testScript);
	await fs.writeFile(userInputScriptPath, user_input);

	try {
		const output = await new Promise((resolve, reject) => {
			exec(
				`sudo docker run --rm --memory=50m --cpus="0.5" -v ${testFilePath}:/app/${testScriptName}.java -v ${userInputScriptPath}:/app/${className}.java java-runner /bin/sh -c "cd /app && javac -cp /usr/local/lib/gson-2.8.8.jar ${testScriptName}.java ${className}.java && java -cp .:/usr/local/lib/gson-2.8.8.jar ${testScriptName}"`,
				(error, stdout, stderr) => {
					if (error) {
						reject({ error: stderr || stdout });
					} else {
						resolve(stdout);
					}
				}
			);
		});

		const consoleOutput = output
			.split('\n')
			.filter((e) => e)
			.slice(0, -1);
		const jsonString = output
			.split('\n')
			.filter((e) => e)
			.at(-1)
			.trim();

		// Ensure the JSON string is properly formatted
		let results = JSON.parse(jsonString);
		results = results.map((result) => {
			return {
				...result,
				passed: isEquals(result.actual_output, result.expected_output)
			};
		});

		return {
			results,
			consoleOutput,
			averageRamUsage: null,
			ok: true
		};
	} catch (error) {
		return {
			message: error?.error.split('\n')[0] ?? 'Failed to run tests',
			consoleOutput: null,
			ok: false
		};
	} finally {
		await fs.unlink(testFilePath);
		await fs.unlink(userInputScriptPath);
	}
}

/**
 * Runs tests for a given exercise by evaluating user input in an isolated environment.
 *
 * @param {number} exercise_id - The ID of the exercise to run tests for.
 * @param {string} user_input - The user-provided code to be tested.
 * @returns {Promise<Object>} - An object containing the results of the tests, average RAM usage, and console output.
 */
export async function runTests(exercise_id, user_input) {
	const tests = await getExerciseTests(exercise_id);

	switch (tests[0].language) {
		case 'JavaScript':
			return runJavaScriptTests(tests, user_input);
		case 'Python':
			return await runPythonTests(tests, user_input);
		case 'Java':
			return await runJavaTests(tests, user_input);
		default:
			return { message: m.run_tests_unsupported_language(), ok: false };
	}
}
