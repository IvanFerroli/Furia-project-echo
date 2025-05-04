import db from "../db";

export async function getAllMessages() {
	const [rows] = await db.query(`
      SELECT 
        m.*, 
        (SELECT COUNT(*) FROM messages AS replies WHERE replies.parent_id = m.id) AS replyCount
      FROM messages m
      ORDER BY timestamp DESC
    `);
	return rows;
}

export async function createMessage({
	user_id,
	nickname,
	text,
	parent_id,
}: {
	user_id?: number;
	nickname: string;
	text: string;
	parent_id?: number;
}) {
	const [result] = await db.query(
		"INSERT INTO messages (user_id, nickname, text, parent_id, timestamp) VALUES (?, ?, ?, ?, NOW())",
		[user_id || null, nickname, text, parent_id || null]
	);
	return { id: (result as any).insertId, nickname, text };
}

export async function reactToMessage(id: string, type: "like" | "dislike") {
	const column = type === "like" ? "likes" : "dislikes";
	await db.query(
		`UPDATE messages SET ${column} = ${column} + 1 WHERE id = ?`,
		[id]
	);
}
