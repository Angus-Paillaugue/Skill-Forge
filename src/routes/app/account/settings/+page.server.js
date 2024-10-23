import { fail } from '@sveltejs/kit';
import { createConnection } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '$lib/server/auth';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;
	return { user };
}

export const actions = {
	async changePassword({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { oldPassword, newPassword, confirmPassword } = formData;
		if (newPassword !== confirmPassword) return fail(400, { error: 'Passwords do not match!' });
		if (newPassword.length < 6)
			return fail(400, { error: 'Password must be at least 6 characters long!' });
		// Check if old password is correct
		const db = await createConnection();
		try {
			const [dbUser] = await db.query('SELECT * FROM users WHERE id = ?', [user.id]);
			if (dbUser.length === 0) return fail(400, { error: 'User not found!' });

			const compare = await bcrypt.compare(oldPassword, dbUser[0].password_hash);
			if (!compare) return fail(400, { error: 'Incorrect password!' });
			// Update password
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(newPassword, salt);
			await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [hash, user.id]);
			return { success: 'Password updated successfully' };
		} catch (error) {
			console.error(error);
			return fail(400, { error });
		} finally {
			db.end();
		}
	},
	async saveInfos({ request, locals, cookies }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { username } = formData;
		const db = await createConnection();
		try {
			const [usernameIsTaken] = await db.query('SELECT * FROM users WHERE username = ?', [
				username
			]);
			if (usernameIsTaken.length > 0) return fail(400, { error: 'Username is already taken!' });
			await db.query('UPDATE users SET username = ? WHERE id = ?', [username, user.id]);
			// Update user in locals
			locals.user.username = username;
			// Update JWT
			cookies.set('token', generateAccessToken(username), {
				path: '/',
				maxAge: 60 * 60 * 24,
				secure: false
			});
			return { success: 'Username updated successfully' };
		} catch (error) {
			console.error(error);
			return fail(400, { error });
		} finally {
			db.end();
		}
	}
};
