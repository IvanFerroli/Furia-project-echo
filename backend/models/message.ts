import db from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function getAllMessages() {
	const [rows]: [RowDataPacket[], any] = await db.query(`
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
	const [result]: [ResultSetHeader, any] = await db.query(
		"INSERT INTO messages (user_id, nickname, text, parent_id, timestamp) VALUES (?, ?, ?, ?, NOW())",
		[user_id || null, nickname, text, parent_id || null]
	);
	return { id: result.insertId, nickname, text };
}

export async function reactToMessage(id: string, type: "like" | "dislike") {
	const column = type === "like" ? "likes" : "dislikes";
	await db.query(
		`UPDATE messages SET ${column} = ${column} + 1 WHERE id = ?`,
		[id]
	);
}

export async function getDashboardMetrics() {
	const [posts]: [RowDataPacket[], any] = await db.query("SELECT * FROM messages");
	const [users]: [RowDataPacket[], any] = await db.query("SELECT COUNT(*) as total FROM users");

	const hashtags: Record<string, number> = {};
	let totalLikes = 0;
	let topLikes = 0;
	const streakMap: Record<string, number> = {};

	for (const post of posts) {
		// Hashtags
		const matches = post.text.match(/#[\wÀ-ú]+/g);
		if (matches) {
			for (const tag of matches) {
				hashtags[tag] = (hashtags[tag] || 0) + 1;
			}
		}

		// Likes
		totalLikes += post.likes;
		if (post.likes > topLikes) topLikes = post.likes;

		// Streak
		const date = new Date(post.timestamp).toISOString().split("T")[0];
		streakMap[date] = (streakMap[date] || 0) + 1;
	}

	return {
		hashtags,
		streak: streakMap,
		totalUsers: users[0].total,
		totalPosts: posts.length,
		totalLikes,
		topLikes,
	};
}
