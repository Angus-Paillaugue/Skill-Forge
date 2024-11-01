import path from 'node:path';
import fs from 'node:fs/promises';
import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET = async ({ params }) => {
	const pathName = path.resolve(`${env.PWD}/uploads/profile_pictures`, params.path);

	try {
		const file = await fs.readFile(pathName);
		return new Response(file);
	} catch {
		throw new error(404);
	}
};
