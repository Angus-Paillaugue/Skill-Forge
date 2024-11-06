import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { env } from '$env/dynamic/private';

export const GET = async ({ params }) => {
	const { id: userId } = params;
	const DEFAULT_PROFILE_PICTURE = `${env.PWD}/uploads/profile_pictures/default_avatar.jpg`;
	const pathName = path.resolve(`${env.PWD}/uploads/profile_pictures`, userId + '.webp');

	try {
		const file = await readFile(pathName);
		return new Response(file);
	} catch {
		const file = await readFile(DEFAULT_PROFILE_PICTURE);
		return new Response(file);
	}
};
