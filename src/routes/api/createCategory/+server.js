import { json } from '@sveltejs/kit';
import { createConnection } from '$lib/server/db';

export async function POST({ request, locals }) {
	const { name } = await request.json();
	const { user } = locals;

	// Check if user is admin
	if (!user.admin) return json({ message: 'Unauthorized' }, { status: 401 });

	// Check if name is provided
	if (!name) return json({ message: 'Missing name field' }, { status: 400 });

	const db = await createConnection();
	try {
		// Check if learning path already exists
		const [learningPathExists] = await db.query(
			`
			SELECT id FROM categories WHERE name = ?`,
			[name]
		);
		if (learningPathExists.length)
			return json({ message: 'Learning path already exists' }, { status: 400 });

		// Create category
		const [newPath] = await db.query('INSERT INTO categories (name) VALUES (?)', [name]);
		return json({ id: newPath.insertId, name });
	} catch (error) {
		return json({ message: 'Error creating exercise : ' + error }, { status: 500 });
	} finally {
		await db.end();
	}
}
