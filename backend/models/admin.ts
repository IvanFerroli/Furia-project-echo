import db from "../db";
import { RowDataPacket } from "mysql2";


// ---------------- USERS ----------------

/**
 * Retorna a lista de todos os usuários cadastrados no sistema.
 *
 * @returns Array com dados básicos de cada usuário (id, nickname, email, verificação, status de perfil, data de criação)
 */
export async function getAllUsers() {
	// Executa query SQL para buscar usuários ordenados por data de criação (mais recente primeiro)
	const [rows] = await db.query<RowDataPacket[]>(
		"SELECT id, nickname, email, verified, profile_completed, created_at FROM users ORDER BY created_at DESC"
	);
	return rows;
}


// ---------------- DASHBOARD ----------------

/**
 * Retorna métricas agregadas para o painel administrativo.
 *
 * @returns Objeto com total de usuários, mensagens, curtidas e o post mais curtido
 */
export async function getDashboardStats() {
	// Busca total de usuários
	const [usersResult] = await db.query<RowDataPacket[]>(
		"SELECT COUNT(*) as total_users FROM users"
	);
	const users = usersResult[0];

	// Busca total de mensagens
	const [messagesResult] = await db.query<RowDataPacket[]>(
		"SELECT COUNT(*) as total_messages FROM messages"
	);
	const messages = messagesResult[0];

	// Busca total de curtidas (likes) somadas em todas as mensagens
	const [likesResult] = await db.query<RowDataPacket[]>(
		"SELECT SUM(likes) as total_likes FROM messages"
	);
	const likes = likesResult[0];

	// Busca o post com maior número de likes
	const [topPostResult] = await db.query<RowDataPacket[]>(
		`SELECT id, nickname, text, likes
		 FROM messages
		 ORDER BY likes DESC
		 LIMIT 1`
	);
	const topPost = topPostResult.length > 0 ? topPostResult[0] : null; // fallback defensivo

	// Retorna todas as métricas agregadas para o dashboard
	return {
		total_users: users.total_users,
		total_messages: messages.total_messages,
		total_likes: likes.total_likes || 0,
		most_liked_post: topPost || null,
	};
}
