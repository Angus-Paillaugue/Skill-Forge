import { fail } from '@sveltejs/kit';
import { createConnection } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '$lib/server/auth';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import { writeFile, unlink } from 'node:fs/promises';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return { IMAGE_EXTENSIONS };
}

/**
 * Validates if the given file extension is an image extension.
 *
 * @param {string} extension - The file extension to validate.
 * @returns {boolean} - Returns true if the extension is a valid image extension, otherwise false.
 */
function validateImageExtension(extension) {
	extension = extension.replace('.', '');
	return IMAGE_EXTENSIONS.indexOf(extension) !== -1;
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
	},
	async saveProfilePicture({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { uploadProfilePicture: picture } = formData;

		// Check if picture is uploaded
		if (!picture) return fail(400, { error: 'No picture uploaded!' });

		const pictureId = randomBytes(16).toString('hex');
		const imageExtension = extname(picture.name);

		// Check if image extension is valid (user, changed it in the file picker)
		if (!validateImageExtension(imageExtension))
			return fail(400, { error: 'Invalid image extension!' });

		// Check if image is too large (1MB)
		if(picture.size > 1024 * 1024) return fail(400, { error: 'Image is too large!' });


		const db = await createConnection();
		try {
			// Get default profile picture path
			const [defaultProfilePicturePath] = await db.query(
				"SELECT Column_Default default_path FROM Information_Schema.Columns WHERE Table_Name = 'users' AND Column_Name = 'profile_picture'"
			);

			// Delete old picture if it's not the default one
			if (user.profile_picture !== defaultProfilePicturePath[0].default_path) {
				const oldPicturePath = `static${user.profile_picture}`;
				await unlink(oldPicturePath);
			}

			const publicPicturePath = `/profile_pictures/${pictureId}${imageExtension}`;
			// Save picture
			await writeFile(`static${publicPicturePath}`, Buffer.from(await picture?.arrayBuffer()));

			// Update user
			await db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [
				publicPicturePath,
				user.id
			]);

			// Update user in locals
			locals.user.picture = publicPicturePath;
			return {
				success: 'Profile picture updated successfully',
				type: 'saveProfilePicture',
				profile_picture: publicPicturePath
			};
		} catch (error) {
			console.error(error);
			return fail(400, { error });
		} finally {
			db.end();
		}
	}
};
