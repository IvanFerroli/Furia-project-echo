import db from "../db";
import { RowDataPacket } from "mysql2";

// ---------------- USERS ----------------
export async function getAllUsers() {
	const [rows] = await db.query<RowDataPacket[]>(
		"SELECT id, nickname, email, verified, profile_completed, created_at FROM users ORDER BY created_at DESC"
	);
	return rows;
}

// ---------------- DASHBOARD ----------------
export async function getDashboardStats() {
	const [usersResult] = await db.query<RowDataPacket[]>(
		"SELECT COUNT(*) as total_users FROM users"
	);
	const users = usersResult[0];

	const [messagesResult] = await db.query<RowDataPacket[]>(
		"SELECT COUNT(*) as total_messages FROM messages"
	);
	const messages = messagesResult[0];

	const [likesResult] = await db.query<RowDataPacket[]>(
		"SELECT SUM(likes) as total_likes FROM messages"
	);
	const likes = likesResult[0];

	const [topPostResult] = await db.query<RowDataPacket[]>(
		`SELECT id, nickname, text, likes
		 FROM messages
		 ORDER BY likes DESC
		 LIMIT 1`
	);
	const topPost = topPostResult.length > 0 ? topPostResult[0] : null;


	return {
		total_users: users.total_users,
		total_messages: messages.total_messages,
		total_likes: likes.total_likes || 0,
		most_liked_post: topPost || null,
	};
}
