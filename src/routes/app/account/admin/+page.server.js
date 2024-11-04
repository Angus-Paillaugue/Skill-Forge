import { getAdminDashboardStats } from '$lib/server/db/users';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const stats = await getAdminDashboardStats();

	return { stats };
}
