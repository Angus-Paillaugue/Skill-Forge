import db from './index';
import { eq, sql, and, desc } from 'drizzle-orm';
import { exercises, exerciseTests, languages, submissions } from './schema';
import { compileMarkdown } from '$lib/server/markdown';
import * as m from '$msgs';

export async function getExerciseTests(exerciseId) {
	return await db
		.select({
			input: exerciseTests.input,
			expected_output: exerciseTests.expected_output,
			language: languages.name
		})
		.from(exerciseTests)
		.leftJoin(exercises, eq(exerciseTests.exercise_id, exercises.id))
		.leftJoin(languages, eq(exercises.language_id, languages.id))
		.where(eq(exerciseTests.exercise_id, exerciseId));
}

export async function createExercise({
	title,
	description,
	content,
	difficulty,
	tests,
	languageId
}) {
	const newExercise = await db
		.insert(exercises)
		.values({ title, description, content, difficulty, language_id: languageId })
		.$returningId();
	const newExerciseId = newExercise.id;
	for (const test of tests) {
		await db.insert(exerciseTests).values({
			exercise_id: newExerciseId,
			input: test.input,
			expected_output: test.expected_output
		});
	}
	return newExerciseId;
}

export async function updateExercise({ id, title, description, content, difficulty, tests }) {
	await db
		.update(exercises)
		.set({ title, description, content, difficulty })
		.where(eq(exercises.id, id));
	await db.delete(exerciseTests).where(eq(exerciseTests.exercise_id, id));
	for (const test of tests) {
		await db
			.insert(exerciseTests)
			.values({ exercise_id: id, input: test.input, expected_output: test.expected_output });
	}
}

// Used for tests
export async function getExerciseData(exerciseId) {
	const exerciseData = await db
		.select({
			exercise_id: exercises.id,
			title: exercises.title,
			slug: exercises.slug,
			description: exercises.description,
			content: exercises.content,
			difficulty: exercises.difficulty,
			created_at: exercises.created_at,
			tests: sql`JSON_ARRAYAGG(
      JSON_OBJECT('input', ${exerciseTests.input}, 'expected_output', ${exerciseTests.expected_output})
    )`
		})
		.from(exercises)
		.leftJoin(exerciseTests, eq(exercises.id, exerciseTests.exercise_id))
		.where(eq(exercises.id, exerciseId))
		.groupBy(
			exercises.id,
			exercises.title,
			exercises.slug,
			exercises.description,
			exercises.content,
			exercises.difficulty,
			exercises.created_at
		);

	if (exerciseData.length === 0) {
		throw new Error(m.error_messages_db_exercises_get_exercise_data_no_exercise());
	}

	return exerciseData[0];
}

export async function getLatestExercises(userId) {
	const latestExercises = await db
		.selectDistinct({
			exercise_id: exercises.id,
			title: exercises.title,
			slug: exercises.slug,
			description: exercises.description,
			difficulty: exercises.difficulty,
			created_at: exercises.created_at,
			language: languages.name,
			solved: sql`CASE WHEN ${submissions.completed_at} IS NOT NULL THEN TRUE ELSE FALSE END`
		})
		.from(exercises)
		.leftJoin(
			submissions,
			sql`${exercises.id} = ${submissions.exercise_id} AND ${submissions.user_id} = ${userId}`
		)
		.leftJoin(languages, eq(exercises.language_id, languages.id))
		.orderBy(desc(exercises.created_at));

	return latestExercises;
}

export async function getRandomExercise() {
	const exercise = await db
		.select()
		.from(exercises)
		.orderBy(sql`RAND()`)
		.limit(1);
	return exercise[0];
}

export async function getExerciseDetails(userId, exerciseId) {
	// Fetch exercise details
	const exerciseDetails = await db
		.select({
			exercise_id: exercises.id,
			title: exercises.title,
			description: exercises.description,
			slug: exercises.slug,
			content: exercises.content,
			difficulty: exercises.difficulty,
			created_at: exercises.created_at,
			language: languages.name
		})
		.from(exercises)
		.leftJoin(languages, eq(exercises.language_id, languages.id))
		.where(eq(exercises.id, exerciseId));

	if (exerciseDetails.length === 0) {
		throw new Error('Exercise not found');
	}

	const exercise = exerciseDetails[0];

	// Fetch exercise tests
	const exerciseTestsData = await db
		.select({
			input: exerciseTests.input,
			expected_output: exerciseTests.expected_output,
			display_value: exerciseTests.display_value
		})
		.from(exerciseTests)
		.where(eq(exerciseTests.exercise_id, exerciseId));

	exercise.tests = exerciseTestsData;

	// Fetch exercise submissions
	const exerciseSubmissions = await db
		.select({
			submission_id: submissions.id,
			submission: submissions.submission,
			completed_at: submissions.completed_at,
			ram_usage: submissions.ram_usage
		})
		.from(submissions)
		.where(and(eq(submissions.exercise_id, exerciseId), eq(submissions.user_id, userId)));

	exercise.submissions = exerciseSubmissions;

	// Sort submissions by completed_at DESC
	exercise.submissions.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));

	// Parse the exercise description from MD into html
	exercise.description = await compileMarkdown(exercise.description);

	return exercise;
}
