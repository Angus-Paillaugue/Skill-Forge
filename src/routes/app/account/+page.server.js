import { getProfile } from '$lib/server/db/users';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	const { user } = locals;

	const profile = await getProfile(user.id);

	return { ...profile };
}
