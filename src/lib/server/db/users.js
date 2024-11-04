import db from './index.js';
import { eq, sql, count } from 'drizzle-orm';
import { users, submissions, exercises } from './schema.js';

export async function createNewUser(username, hash) {
	await db.insert(users).values({ username, password_hash: hash });
}

export async function findUserByUsername(username) {
	const user = await db
		.select({
			id: users.id,
			username: users.username,
			profile_picture: users.profile_picture,
			admin: users.admin,
			created_at: users.created_at,
			password_hash: users.password_hash
		})
		.from(users)
		.where(eq(users.username, username))
		.limit(1);

	if (user.length === 0) {
		throw new Error('User not found');
	}

	return user[0];
}

export async function usernameIsTaken(username) {
	const user = await db
		.select({
			id: users.id
		})
		.from(users)
		.where(eq(users.username, username))
		.limit(1);

	return user.length > 0;
}

export async function getProfile(userId) {
	// Get user rank
	const userRank = await db
		.select({
			user_id: users.id,
			username: users.username,
			distinct_exercise_count: sql`COUNT(DISTINCT ${submissions.exercise_id})`,
			user_rank: sql`RANK() OVER (ORDER BY COUNT(DISTINCT ${submissions.exercise_id}) DESC)`
		})
		.from(users)
		.leftJoin(submissions, eq(users.id, submissions.user_id))
		.groupBy(users.id, users.username)
		.where(eq(users.id, userId));

	// Get total number of exercises
	const totalExercises = await db
		.select({
			no_exercises: count()
		})
		.from(exercises);

	// Get recent activity
	const recentActivity = await db
		.select({
			completed_at: submissions.completed_at,
			exercise_id: exercises.id,
			exercise_difficulty: exercises.difficulty,
			title: exercises.title,
			slug: exercises.slug
		})
		.from(submissions)
		.leftJoin(exercises, eq(submissions.exercise_id, exercises.id))
		.where(eq(submissions.user_id, userId))
		.orderBy(submissions.completed_at, 'desc')
		.limit(50);

	// Get contributions
	const contributions = await db
		.select({
			submission_date: sql`DATE(${submissions.completed_at})`,
			submission_count: sql`COUNT(${submissions.id})`
		})
		.from(submissions)
		.where(eq(submissions.user_id, userId))
		.groupBy(sql`DATE(${submissions.completed_at})`);

	const rank = userRank[0];
	rank.no_exercises = totalExercises[0].no_exercises;
	return {
		rank,
		recentActivity,
		contributions
	};
}

export async function getAdminDashboardStats() {
	const noUsers = await db.select({ count: count() }).from(users);
	// Count the number of exercises
	const noExercises = await db.select({ count: count() }).from(exercises);
	// Get all exercises
	const allExercises = await db.select().from(exercises);
	return { noUsers: noUsers[0].count, noExercises: noExercises[0].count, allExercises };
}

export async function deleteUser(userId) {
	await db.delete(submissions).where(eq(submissions.user_id, userId));
	await db.delete(users).where(eq(users.id, userId));
}

export async function updatePassword(userId, hash) {
	await db.update(users).set({ password_hash: hash }).where(eq(users.id, userId));
}

export async function updateUsername(userId, username) {
	await db.update(users).set({ username }).where(eq(users.id, userId));
}

export async function updateProfilePicture(userId, profilePicture) {
	await db.update(users).set({ profile_picture: profilePicture }).where(eq(users.id, userId));
}

export async function getDefaultProfilePicturePath() {
	const result = await db.execute(
		sql`SELECT Column_Default AS default_path FROM Information_Schema.Columns WHERE Table_Name = 'users' AND Column_Name = 'profile_picture'`
	);

	if (result.length === 0) {
		throw new Error('Default profile picture path not found');
	}

	return result[0].default_path;
}
