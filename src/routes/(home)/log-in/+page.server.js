import { createConnection } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { fail } from '@sveltejs/kit';
import { AUTH_TOKEN_SECRET } from '$env/static/private';

export const actions = {
	default: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { username, password } = formData;
		const db = await createConnection();

		// Check if username is provided
		if (!username) return fail(400, { error: 'Please provide a username!' });

		// Check if password is provided and is at least 6 characters long
		if (!password || password.length < 6) return fail(400, { error: 'Incorrect password!' });

		// Check if user exists
		const [userExistsUsername] = await db.query('SELECT * FROM users WHERE BINARY username = ?', [
			username
		]);

		// If user does not exist, return error
		if (userExistsUsername.length === 0)
			return fail(400, { error: 'No account with this username!' });

		const user = userExistsUsername[0];
		const compare = await bcrypt.compare(password, user.password_hash);
		if (compare) {
			cookies.set('token', generateAccessToken(username), {
				path: '/',
				maxAge: 60 * 60 * 24,
				secure: false
			});
			throw redirect(307, '/app');
		}
		return fail(400, { error: 'Incorrect password!' });
	}
};

function generateAccessToken(username) {
	return jwt.sign(username, AUTH_TOKEN_SECRET);
}
