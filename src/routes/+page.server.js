import { generateAccessToken } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { createNewUser, findUserByUsername, usernameIsTaken } from '$lib/server/db/users.js';
import * as m from '$msgs';

export const actions = {
	logIn: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { logInUsername: username, logInPassword: password } = formData;

		// Check if username is provided
		if (!username) return fail(400, { error: m.error_messages_log_in_no_username() });

		// Check if the username is at least 3 characters long
		if (username.length < 3)
			return fail(400, { error: m.error_messages_log_in_username_too_short({ length: 3 }) });

		// Check if password is provided and is at least 6 characters long
		if (!password || password.length < 6)
			return fail(400, { error: m.error_messages_log_in_incorrect_password() });

		try {
			const user = await findUserByUsername(username);

			// If user does not exist, return error
			if (!user)
				return fail(400, { error: m.error_messages_log_in_no_account_with_provided_username() });

			const compare = await bcrypt.compare(password, user.password_hash);

			// If password is incorrect, return error
			if (!compare)
				return fail(400, { error: m.error_messages_log_in_incorrect_password() });

			cookies.set('token', generateAccessToken(username), {
				path: '/',
				maxAge: 60 * 60 * 24,
				secure: false
			});
		} catch (error) {
			return fail(400, { error:error.message });
		}

		throw redirect(303, '/app');
	},
	signUp: async ({ cookies, request }) => {
		const formData = Object.fromEntries(await request.formData());
		const { signUpUsername: username, signUpPassword: password } = formData;

		// Check if username is already used
		const usernameIsAlreadyUsed = await usernameIsTaken(username);

		if (usernameIsAlreadyUsed)
			return fail(400, { error: m.error_messages_sign_up_username_already_exists() });

		// Validate username (only letters and numbers)
		if (!/^[a-zA-Z0-9]+$/.test(username))
			return fail(400, {
				error: m.error_messages_sign_up_incorrect_username_format()
			});

		// Validate username (at least 3 characters long)
		if (username.length < 3)
			return fail(400, {
				error: m.error_messages_sign_up_incorrect_username_length()
			});

		// Validate password (at least 6 characters long)
		if (password.length < 6)
			return fail(400, {
				error: m.error_messages_sign_up_incorrect_password_length()
			});

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);

		// Create user
		await createNewUser(username, hash);

		// Set token
		cookies.set('token', generateAccessToken(username), {
			path: '/',
			maxAge: 60 * 60 * 24,
			secure: false
		});

		throw redirect(303, '/app');
	}
};
