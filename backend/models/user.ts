import db from "../db";
import { RowDataPacket } from 'mysql2';

export async function getUserDemographics(): Promise<{
    ageGroups: { name: string; value: number }[];
    states: { name: string; value: number }[];
  }> {
    const [rows]: [RowDataPacket[], any] = await db.query(`
      SELECT 
        TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
        city
      FROM users
      WHERE birthdate IS NOT NULL AND city IS NOT NULL
    `);

    const ageGroups: Record<string, number> = {
      'Até 18': 0,
      '19-25': 0,
      '26-35': 0,
      '36-50': 0,
      '50+': 0,
    };

    const stateCounts: Record<string, number> = {};

    for (const { age, city } of rows) {
      // 🎂 Faixa etária
      if (age <= 18) ageGroups['Até 18']++;
      else if (age <= 25) ageGroups['19-25']++;
      else if (age <= 35) ageGroups['26-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else ageGroups['50+']++;

      // 🗺️ Estado (extraído do final do campo "cidade - UF")
      const stateMatch = typeof city === 'string' ? city.match(/-\s*(\w{2})$/) : null;
      const uf = stateMatch?.[1] || 'Desconhecido';
      stateCounts[uf] = (stateCounts[uf] || 0) + 1;
    }

    return {
      ageGroups: Object.entries(ageGroups).map(([name, value]) => ({ name, value })),
      states: Object.entries(stateCounts).map(([name, value]) => ({ name, value })),
    };
}

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
