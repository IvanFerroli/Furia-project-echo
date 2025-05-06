import db from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
	DashboardMetrics,
	DashboardPost,
	DashboardHashtag,
	DashboardUserRanking,
} from "../types/dashboardTypes";

export async function getAllMessages() {
	const [rows]: [RowDataPacket[], any] = await db.query(`
            SELECT 
                m.*, 
                u.profile_image,
                (SELECT COUNT(*) FROM messages AS replies WHERE replies.parent_id = m.id) AS replyCount
            FROM messages m
            LEFT JOIN users u ON u.id = m.user_id
            ORDER BY m.timestamp DESC
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

export async function reactToMessage(
	messageId: string,
	userId: string,
	type: "like" | "dislike"
) {
	// 1. Verifica se já existe uma reação
	const [existing]: [RowDataPacket[], any] = await db.query(
		`SELECT * FROM message_reactions WHERE user_id = ? AND message_id = ?`,
		[userId, messageId]
	);

	if (existing.length > 0) {
		const current = existing[0];

		if (current.type === type) {
			// Remover reação se clicar de novo no mesmo tipo
			await db.query(`DELETE FROM message_reactions WHERE id = ?`, [
				current.id,
			]);
		} else {
			// Troca tipo de reação
			await db.query(
				`UPDATE message_reactions SET type = ? WHERE id = ?`,
				[type, current.id]
			);
		}
	} else {
		// Cria nova reação
		await db.query(
			`INSERT INTO message_reactions (user_id, message_id, type) VALUES (?, ?, ?)`,
			[userId, messageId, type]
		);
	}

	// 2. Atualiza contadores na tabela messages
	const [[{ total: likes }]] = await db.query(
		`SELECT COUNT(*) AS total FROM message_reactions WHERE message_id = ? AND type = 'like'`,
		[messageId]
	);
	const [[{ total: dislikes }]] = await db.query(
		`SELECT COUNT(*) AS total FROM message_reactions WHERE message_id = ? AND type = 'dislike'`,
		[messageId]
	);

	await db.query(`UPDATE messages SET likes = ?, dislikes = ? WHERE id = ?`, [
		likes,
		dislikes,
		messageId,
	]);
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
	const [posts]: [RowDataPacket[], any] = await db.query(`
        SELECT * FROM messages
    `);

	const [userStats]: [RowDataPacket[], any] = await db.query(`
        SELECT 
          u.id AS user_id,
          u.nickname,
          COUNT(m.id) AS messages,
      
          -- Subquery: soma dos likes em mensagens do usuário
          (
            SELECT COUNT(*) FROM message_reactions r
            JOIN messages m2 ON r.message_id = m2.id
            WHERE m2.user_id = u.id AND r.type = 'like'
          ) AS total_likes,
      
          -- Subquery: soma dos dislikes em mensagens do usuário
          (
            SELECT COUNT(*) FROM message_reactions r
            JOIN messages m2 ON r.message_id = m2.id
            WHERE m2.user_id = u.id AND r.type = 'dislike'
          ) AS total_dislikes
      
        FROM users u
        LEFT JOIN messages m ON m.user_id = u.id
        GROUP BY u.id, u.nickname
        ORDER BY total_likes DESC
      `);

	let mostLiked: DashboardPost | null = null;
	let mostDisliked: DashboardPost | null = null;
	const hashtagsMap: Record<string, number> = {};
	const streakMap: Record<string, number> = {};

	for (const post of posts) {
		const likes = post.likes ?? 0;
		const dislikes = post.dislikes ?? 0;

		if (!mostLiked || likes > (mostLiked.likes ?? 0)) mostLiked = post;
		if (!mostDisliked || dislikes > (mostDisliked.dislikes ?? 0))
			mostDisliked = post;

		const foundTags = post.text?.match(/#[\wÀ-ú]+/g);
		if (foundTags) {
			for (const tag of foundTags) {
				hashtagsMap[tag] = (hashtagsMap[tag] || 0) + 1;
			}
		}

		const timestamp = post.timestamp ? new Date(post.timestamp) : null;
		if (timestamp) {
			const date = timestamp.toISOString().split("T")[0];
			streakMap[date] = (streakMap[date] || 0) + 1;
		}
	}

	const topHashtags: DashboardHashtag[] = Object.entries(hashtagsMap)
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10);

	const userRanking = userStats.map((u) => ({
		user_id: u.user_id,
		nickname: u.nickname,
		messages: u.messages,
		total_likes: u.total_likes,
		total_dislikes: u.total_dislikes,
	})) satisfies DashboardUserRanking[];

	return {
		mostLiked,
		mostDisliked,
		topHashtags,
		userRanking,
	};
}

export async function getActivityStreak(): Promise<
	{ date: string; streak: number }[]
> {
	const [rows]: [RowDataPacket[], any] = await db.query(`
            SELECT DATE(timestamp) as active_day, COUNT(*) as count
            FROM messages
            GROUP BY active_day
            ORDER BY active_day
        `);

	return rows.map((row: any) => ({
		date: row.active_day,
		streak: row.count,
	}));
}
