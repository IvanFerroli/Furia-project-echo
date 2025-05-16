import db from "../db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import {
	DashboardMetrics,
	DashboardPost,
	DashboardHashtag,
	DashboardUserRanking,
} from "../types/dashboardTypes";

/**
 * Recupera todas as mensagens da base de dados.
 *
 * Inclui:
 * - Dados completos da mensagem (`m.*`)
 * - Imagem de perfil do autor (`u.profile_image`)
 * - Contagem de respostas para cada mensagem (`replyCount`)
 *
 * As mensagens são ordenadas da mais recente para a mais antiga.
 *
 * @returns Um array de mensagens com dados adicionais de usuário e replies.
 */

// ---------------- MESSAGES: FETCH ALL ----------------
export async function getAllMessages() {
	// Executa query que busca todas as mensagens (m.*), junto com:
	// - imagem de perfil do autor (u.profile_image)
	// - total de respostas (replyCount) para cada mensagem
	const [rows]: [RowDataPacket[], any] = await db.query(`
            SELECT 
                m.*, 
                u.profile_image,
                (SELECT COUNT(*) FROM messages AS replies WHERE replies.parent_id = m.id) AS replyCount
            FROM messages m
            LEFT JOIN users u ON u.id = m.user_id
            ORDER BY m.timestamp DESC
        `);

	// Retorna as mensagens com avatar e contagem de respostas
	return rows;
}

/**
 * Cria uma nova mensagem no banco de dados.
 *
 * Aceita mensagens anônimas (sem `user_id`) e respostas (`parent_id`).
 * O timestamp é gerado automaticamente no momento da criação.
 *
 * @param user_id - ID do usuário autor da mensagem (ou null para anônimo)
 * @param nickname - Nome público visível do autor
 * @param text - Conteúdo textual da mensagem
 * @param parent_id - ID da mensagem original, se for uma resposta (opcional)
 * @returns Objeto contendo o ID da nova mensagem e dados básicos (nickname, text)
 */

// ---------------- MESSAGES: CREATE ----------------
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
	// Insere uma nova mensagem na tabela `messages`, com:
	// - usuário (se existir, senão null)
	// - nickname (pra mensagens anônimas ou externas)
	// - texto da mensagem
	// - ID da mensagem pai (se for uma resposta)
	// - timestamp gerado automaticamente (NOW())
	const [result]: [ResultSetHeader, any] = await db.query(
		"INSERT INTO messages (user_id, nickname, text, parent_id, timestamp) VALUES (?, ?, ?, ?, NOW())",
		[user_id || null, nickname, text, parent_id || null]
	);

	// Retorna os dados mínimos pra exibir a mensagem recém-criada no frontend
	return { id: result.insertId, nickname, text };
}

/**
 * Adiciona, troca ou remove uma reação de like/dislike em uma mensagem.
 *
 * A lógica é mutuamente exclusiva:
 * - Se o usuário já reagiu com o mesmo tipo → a reação é removida.
 * - Se o usuário reagiu com o tipo oposto → a reação é atualizada.
 * - Se ainda não reagiu → é criada uma nova reação.
 *
 * Após isso, os totais de likes e dislikes da mensagem são recalculados.
 *
 * @param messageId - ID da mensagem a ser reagida
 * @param userId - ID do usuário que está reagindo
 * @param type - Tipo da reação ("like" ou "dislike")
 */

// ---------------- MESSAGES: LIKE / DISLIKE ----------------
export async function reactToMessage(
	messageId: string,
	userId: string,
	type: "like" | "dislike"
) {
	// 1. Verifica se o usuário já reagiu a essa mensagem
	const [existing]: [RowDataPacket[], any] = await db.query(
		`SELECT * FROM message_reactions WHERE user_id = ? AND message_id = ?`,
		[userId, messageId]
	);

	if (existing.length > 0) {
		const current = existing[0];

		if (current.type === type) {
			// Caso já tenha clicado no mesmo tipo → remove a reação (toggle off)
			await db.query(`DELETE FROM message_reactions WHERE id = ?`, [
				current.id,
			]);
		} else {
			// Caso queira trocar (ex: like → dislike) → atualiza o tipo
			await db.query(
				`UPDATE message_reactions SET type = ? WHERE id = ?`,
				[type, current.id]
			);
		}
	} else {
		// Primeira reação desse usuário nessa mensagem → cria novo registro
		await db.query(
			`INSERT INTO message_reactions (user_id, message_id, type) VALUES (?, ?, ?)`,
			[userId, messageId, type]
		);
	}

	// 2. Recalcula total de likes e dislikes da mensagem
	const [[{ total: likes }]] = await db.query(
		`SELECT COUNT(*) AS total FROM message_reactions WHERE message_id = ? AND type = 'like'`,
		[messageId]
	);
	const [[{ total: dislikes }]] = await db.query(
		`SELECT COUNT(*) AS total FROM message_reactions WHERE message_id = ? AND type = 'dislike'`,
		[messageId]
	);

	// Atualiza os contadores na própria tabela `messages`
	await db.query(`UPDATE messages SET likes = ?, dislikes = ? WHERE id = ?`, [
		likes,
		dislikes,
		messageId,
	]);
}

/**
 * Calcula e retorna todas as métricas exibidas no dashboard do sistema.
 *
 * Inclui:
 * - Post mais curtido e mais odiado
 * - Top 10 hashtags extraídas de todas as mensagens
 * - Ranking de usuários por total de mensagens, likes e dislikes
 *
 * Também computa streaks diários (quantidade de posts por data),
 * que são usados em `getActivityStreak()`.
 *
 * @returns Um objeto com as principais métricas agregadas do sistema
 */

// ---------------- METRICS: DASHBOARD ----------------
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
	const [posts]: [RowDataPacket[], any] = await db.query(`
        SELECT * FROM messages
    `); // Busca todas as mensagens da base

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
    `); // Gera ranking dos usuários com base em total de mensagens e reações

	let mostLiked: DashboardPost | null = null;
	let mostDisliked: DashboardPost | null = null;
	const hashtagsMap: Record<string, number> = {};
	const streakMap: Record<string, number> = {};

	for (const post of posts) {
		const likes = post.likes ?? 0;
		const dislikes = post.dislikes ?? 0;

		// Salva o post com mais likes
		if (!mostLiked || likes > (mostLiked.likes ?? 0)) mostLiked = post;
		// Salva o post com mais dislikes
		if (!mostDisliked || dislikes > (mostDisliked.dislikes ?? 0)) mostDisliked = post;

		// Extrai hashtags do texto da mensagem
		const foundTags = post.text?.match(/#[\wÀ-ú]+/g);
		if (foundTags) {
			for (const tag of foundTags) {
				hashtagsMap[tag] = (hashtagsMap[tag] || 0) + 1;
			}
		}

		// Conta quantas mensagens foram feitas por dia (para cálculo de streaks)
		const timestamp = post.timestamp ? new Date(post.timestamp) : null;
		if (timestamp) {
			const date = timestamp.toISOString().split("T")[0];
			streakMap[date] = (streakMap[date] || 0) + 1;
		}
	}

	const topHashtags: DashboardHashtag[] = Object.entries(hashtagsMap)
		.map(([tag, count]) => ({ tag, count }))
		.sort((a, b) => b.count - a.count)
		.slice(0, 10); // Retorna só as 10 hashtags mais usadas

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

/**
 * Retorna a contagem de mensagens postadas por dia, usada para cálculo de streaks.
 *
 * Cada entrada representa um dia com pelo menos uma mensagem postada.
 * Útil para visualizações de frequência, heatmaps e streak charts no dashboard.
 *
 * @returns Um array com objetos no formato { date, streak }, ordenado por data
 */

// ---------------- METRICS: ACTIVITY STREAK ----------------
export async function getActivityStreak(): Promise<
	{ date: string; streak: number }[]
> {
	// Busca o número de mensagens postadas por dia
	const [rows]: [RowDataPacket[], any] = await db.query(`
            SELECT DATE(timestamp) as active_day, COUNT(*) as count
            FROM messages
            GROUP BY active_day
            ORDER BY active_day
        `);

	// Formata os resultados como { date, streak }
	return rows.map((row: any) => {
		console.log("🔥 RAW activity:", row.active_day, row.count); // debug
		return {
			date: row.active_day,
			streak: row.count,
		};
	});
}

