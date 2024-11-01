/** @type {import('./$types').LayoutLoad} */
export async function load({ locals }) {
	const { user } = locals;
	return { user };
}
