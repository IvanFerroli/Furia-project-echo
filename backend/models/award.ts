import db from "../db";

export async function getAwardsByUser(userId: string) {
	const [rows] = await db.query<any[]>(
		"SELECT * FROM awards WHERE user_id = ?",
		[userId]
	);
	return rows;
}

export async function assignAward(user_id: number, award_type: string) {
	await db.query(
		"INSERT INTO awards (user_id, award_type, awarded_at) VALUES (?, ?, NOW())",
		[user_id, award_type]
	);
}
