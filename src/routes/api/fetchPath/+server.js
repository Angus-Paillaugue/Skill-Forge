import { json } from '@sveltejs/kit';
import { getLearningPath } from '$lib/server/db/learning_paths';
import * as m from '$msgs';

export async function POST({ request, locals }) {
	const { user } = locals;
	const { id: learningPathId } = await request.json();
	if (!learningPathId) {
		return json({ error: m.error_messages_api_fetch_path_invalid_path_id() }, { status: 400 });
	}

	try {
		const path = await getLearningPath(user.id, learningPathId);
		return json({ path });
	} catch (err) {
		return json({ error: err.message }, { status: 500 });
	}
}
