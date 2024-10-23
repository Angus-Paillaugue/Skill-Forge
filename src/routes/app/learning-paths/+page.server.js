import { createConnection } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const db = await createConnection();
	try {
		const [paths] = await db.query(
			`
      SELECT
        lp.id,
        lp.name,
        lp.description,
        (
          SELECT COUNT(*)
          FROM exercises e
          WHERE e.learning_path_id = lp.id
        ) as no_exercises
      FROM
        learning_paths lp
      `
		);
		return { paths };
	} finally {
		db.end();
	}
}
