import db from "../db";

export async function getAwardsByUser(userId: string) {
	const [rows] = await db.query<any[]>(
		"SELECT * FROM awards WHERE user_id = ?",
		[userId]
	);
	return rows;
}

export async function assignAward(user_id: string, award_type: string) {
	await db.query(
		"INSERT INTO awards (user_id, award_type, awarded_at) VALUES (?, ?, NOW())",
		[user_id, award_type]
	);
}

export async function checkAwardExists(user_id: string, award_type: string): Promise<boolean> {
	const [rows] = await db.query<any[]>(
		"SELECT id FROM awards WHERE user_id = ? AND award_type = ?",
		[user_id, award_type]
	);
	return rows.length > 0;
}

export async function removeAward(user_id: string, award_type: string) {
	await db.query(
		"DELETE FROM awards WHERE user_id = ? AND award_type = ?",
		[user_id, award_type]
	);
}
