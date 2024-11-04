import { learningPaths, exercises, submissions } from './schema';
import { eq, sql } from 'drizzle-orm';
import db from './index';

export async function getLearningPaths(userId) {
	const learningPathsValue = await db
		.select({
			id: learningPaths.id,
			name: learningPaths.name,
			description: learningPaths.description,
			solved_exercises: sql`COUNT(DISTINCT ${submissions.exercise_id})`,
			total_exercises: sql`COUNT(DISTINCT ${exercises.id})`,
			last_update: sql`MAX(${submissions.completed_at})`
		})
		.from(learningPaths)
		.leftJoin(exercises, eq(learningPaths.id, exercises.learning_path_id))
		.leftJoin(
			submissions,
			sql`${exercises.id} = ${submissions.exercise_id} AND ${submissions.user_id} = ${userId}`
		)
		.groupBy(learningPaths.id, learningPaths.name, learningPaths.description)
		.orderBy(sql`MAX(${submissions.completed_at})`, 'desc');

	return learningPathsValue;
}

export async function getLearningPath(userId, learningPathId) {
	const latestSub = await db
		.select({
			latest_id: sql`MAX(${submissions.id})`.as('latest_id'),
			exercise_id: submissions.exercise_id
		})
		.from(submissions)
		.where(eq(submissions.user_id, userId))
		.groupBy(submissions.exercise_id)
		.as('latest_sub');

	const s = await db
		.select({
			latest_submission_id: submissions.id,
			exercise_id: submissions.exercise_id,
			completed_at: submissions.completed_at
		})
		.from(submissions)
		.innerJoin(latestSub, eq(submissions.id, latestSub.latest_id))
		.as('s');

	const learningPath = await db
		.select({
			id: learningPaths.id,
			name: learningPaths.name,
			description: learningPaths.description,
			exercises: sql`JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', ${exercises.id},
          'slug', ${exercises.slug},
          'title', ${exercises.title},
          'difficulty', ${exercises.difficulty},
          'is_completed', IF(${s.latest_submission_id} IS NOT NULL, TRUE, FALSE)
        )
      )`
		})
		.from(learningPaths)
		.leftJoin(exercises, eq(learningPaths.id, exercises.learning_path_id))
		.leftJoin(s, eq(exercises.id, s.exercise_id))
		.where(eq(learningPaths.id, learningPathId))
		.groupBy(learningPaths.id, learningPaths.name, learningPaths.description);

	return learningPath[0];
}
