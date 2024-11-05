import { fail } from '@sveltejs/kit';
import {
	findUserByUsername,
	updatePassword,
	updateUsername,
	usernameIsTaken,
	deleteUser
} from '$lib/server/db/users';
import bcrypt from 'bcrypt';
import { generateAccessToken } from '$lib/server/auth';
import { extname, basename } from 'path';
import { unlink, stat } from 'node:fs/promises';
import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import * as m from '$msgs';
import sharp from 'sharp';

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

async function fileExists(f) {
	try {
		await stat(f);
		return true;
	} catch {
		return false;
	}
}

export const actions = {
	async changePassword({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { oldPassword, newPassword, confirmPassword } = formData;
		if (newPassword !== confirmPassword)
			return fail(400, { error: m.app_account_settings_actions_errors_passwords_dont_match() });
		if (newPassword.length < 6)
			return fail(400, { error: m.app_account_settings_actions_errors_passwords_too_short() });
		// Check if old password is correct
		try {
			const dbUser = await findUserByUsername(user.username);
			if (!dbUser)
				return fail(400, { error: m.app_account_settings_actions_errors_user_not_found() });

			const compare = await bcrypt.compare(oldPassword, dbUser[0].password_hash);
			if (!compare)
				return fail(400, { error: m.app_account_settings_actions_errors_incorrect_password() });
			// Update password
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(newPassword, salt);
			await updatePassword(user.id, hash);
			return { success: m.app_account_settings_actions_password_updated_successfully() };
		} catch (error) {
			return fail(400, { error });
		}
	},
	async saveInfos({ request, locals, cookies }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { username } = formData;
		try {
			const usernameIsTakenValue = await usernameIsTaken(username);
			if (username.length < 3)
				return fail(400, { error: m.error_messages_log_in_username_too_short({ length: 3 }) });

			if (usernameIsTakenValue)
				return fail(400, { error: m.app_account_settings_actions_username_is_taken() });

			await updateUsername(user.id, username);
			// Update user in locals
			locals.user.username = username;
			// Update JWT
			cookies.set('token', generateAccessToken(username), {
				path: '/',
				maxAge: 60 * 60 * 24,
				secure: false
			});
			return { success: m.app_account_settings_actions_username_updated_successfully() };
		} catch (error) {
			return fail(400, { error });
		}
	},
	async saveProfilePicture({ request, locals }) {
		const { user } = locals;
		const formData = Object.fromEntries(await request.formData());
		const { uploadProfilePicture: picture } = formData;

		// Check if picture is uploaded
		if (!picture) return fail(400, { error: m.app_account_settings_actions_no_profile_picture() });

		const imageExtension = extname(picture.name);

		// Check if image extension is valid (user, changed it in the file picker)
		if (!validateImageExtension(imageExtension))
			return fail(400, { error: m.app_account_settings_actions_invalid_image_extension() });

		// Check if image is too large (1MB)
		if (picture.size > 1024 * 1024)
			return fail(400, { error: m.app_account_settings_actions_image_is_too_large() });

		const userHasChangedProfilePicture = await fileExists(
			`${env.PWD}/uploads/profile_pictures/${user.id}.webp`
		);
		// Delete old picture if it's not the default one
		if (userHasChangedProfilePicture) {
			try {
				const oldPicturePath = `${env.PWD}/uploads/profile_pictures/${basename(user.profile_picture)}`;
				await unlink(oldPicturePath);
			} catch (error) {
				console.error('Error deleting old profile picture:', error);
				return fail(400, { error: m.app_account_settings_actions_error_deleting_old_picture() });
			}
		}
		try {
			const buffer = await picture.arrayBuffer();
			const resizedImage = sharp(buffer)
				.resize({
					width: 80,
					height: 80,
					fit: 'cover'
				})
				.webp();
			const outputFileName = `${user.id}.webp`;
			const publicPicturePath = `/profile_picture/${outputFileName}`;

			// Save resized image
			await resizedImage.toFile(`${env.PWD}/uploads/profile_pictures/${outputFileName}`);

			// Update user in locals
			locals.user.profile_picture = publicPicturePath + `?${Date.now()}`;
			return {
				success: m.app_account_settings_actions_profile_picture_updated_successfully(),
				type: 'saveProfilePicture',
				profile_picture: publicPicturePath + `?${Date.now()}`
			};
		} catch (error) {
			return fail(400, { error: error.message });
		}
	},
	async deleteAccount({ locals }) {
		const {
			user: { id }
		} = locals;

		await deleteUser(id);

		throw redirect(303, '/');
	}
};
