import { createConnection } from '$lib/server/db';
import { generateAccessToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';

export const actions = {
	logIn: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { logInUsername: username, logInPassword: password } = formData;

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
	},
	signUp: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { signUpUsername: username, signUpPassword: password } = formData;
		const db = await createConnection();

		// Check if username is already used
		const [usernameIsAlreadyUsed] = await db.query(
			'SELECT username FROM users WHERE username = ?',
			[username]
		);

		if (usernameIsAlreadyUsed.length > 0) return fail(400, { error: 'Username is taken!' });

		// Validate username (only letters and numbers)
		if (!/^[a-zA-Z0-9]+$/.test(username))
			return fail(400, {
				error: 'Usernames can only be composed of letters and numbers !'
			});

		// Validate username (at least 3 characters long)
		if (username.length < 3)
			return fail(400, {
				error: 'Usernames must be at least 3 characters long !'
			});

		// Validate password (at least 6 characters long)
		if (password.length < 6)
			return fail(400, {
				error: 'Password must be at least 6 characters long !'
			});

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		// Insert user
		await db.query('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);

		// Set token
		cookies.set('token', generateAccessToken(username), {
			path: '/',
			maxAge: 60 * 60 * 24,
			secure: false
		});

		throw redirect(303, '/app');
	}
};
