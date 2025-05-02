import db from "../db";

export async function getUserById(id: string) {
	const [rows] = await db.query<any[]>("SELECT * FROM users WHERE id = ?", [
		id,
	]);

	return Array.isArray(rows) ? rows[0] : null;
}

export async function updateUserProfile(
	id: string,
	{
		nickname,
		profile_image,
		bio,
		city,
		birthdate,
		cpf,
		profile_completed,
		verified,
	}: {
		nickname?: string;
		profile_image?: string;
		bio?: string;
		city?: string;
		birthdate?: string;
		cpf?: string;
		profile_completed?: boolean;
		verified?: boolean;
	}
) {
	await db.query<any>(
		`UPDATE users SET 
      nickname = ?,
      profile_image = ?,
      bio = ?,
      city = ?,
      birthdate = ?,
      cpf = ?,
      profile_completed = ?,
      verified = ?
    WHERE id = ?`,
		[
			nickname,
			profile_image,
			bio,
			city,
			birthdate,
			cpf,
			profile_completed,
			verified,
			id,
		]
	);
}

export async function getUserMetrics(id: string) {
	// Você pode adaptar essa consulta para refletir sua estrutura de mensagens real
	const [[stats]] = await db.query<any[]>(
		`SELECT
      (SELECT COUNT(*) FROM messages WHERE user_id = ?) AS total_posts,
      (SELECT MAX(likes) FROM messages WHERE user_id = ?) AS most_liked,
      (SELECT COUNT(*) FROM messages WHERE user_id = ? AND parent_id IS NOT NULL) AS total_replies,
      (SELECT created_at FROM users WHERE id = ?) AS created_at
    `,
		[id, id, id, id]
	);

	return stats;
}
