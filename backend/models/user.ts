import db from "../db";

export async function getUserById(id: string) {
	const [rows] = await db.query<any[]>("SELECT * FROM users WHERE id = ?", [id]);
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
		cep,
		profile_completed,
		verified,
	}: {
		nickname?: string;
		profile_image?: string;
		bio?: string;
		city?: string;
		birthdate?: string;
		cpf?: string;
		cep?: string;
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
			cep = ?,
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
			cep,
			profile_completed,
			verified,
			id,
		]
	);
}

export async function getUserMetrics(id: string) {
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

export async function createUserIfMissing({
	id,
	email,
	nickname = null,
	profile_image = null,
}: {
	id: string;
	email: string;
	nickname?: string | null;
	profile_image?: string | null;
}) {
	const [rows] = await db.query<any[]>("SELECT id FROM users WHERE id = ?", [id]);

	if (rows.length === 0) {
		await db.query(
			`INSERT INTO users (id, firebase_uid, email, nickname, profile_image) VALUES (?, ?, ?, ?, ?)`,
			[id, id, email, nickname, profile_image]
		);
	}
}
