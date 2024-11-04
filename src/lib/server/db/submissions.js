import db from './index';
import { eq, and } from 'drizzle-orm';
import { submissions } from './schema';

export async function submitSolution(userId, exercise_id, user_input, results) {
	const solutionExists = await db
		.select({
			id: submissions.id
		})
		.from(submissions)
		.where(
			and(
				eq(submissions.user_id, userId),
				eq(submissions.exercise_id, exercise_id),
				eq(submissions.submission, user_input)
			)
		);

	if (solutionExists.length > 0) {
		throw new Error('You already submitted this solution!');
	}

	const insertedRow = await db
		.insert(submissions)
		.values({
			user_id: userId,
			exercise_id: exercise_id,
			submission: user_input,
			ram_usage: results.averageRamUsage,
			completed_at: new Date()
		})
		.returning({ id: submissions.id });

	return insertedRow[0].id;
}
