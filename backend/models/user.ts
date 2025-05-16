import db from "../db";
import { RowDataPacket } from "mysql2";

/**
 * Retorna a distribuição demográfica dos usuários.
 *
 * - Calcula a faixa etária com base na data de nascimento (`birthdate`)
 * - Extrai a sigla do estado (`UF`) do campo `city` no formato "Cidade - UF"
 *
 * @returns Um objeto com duas listas:
 * - `ageGroups`: quantidade de usuários por faixa etária
 * - `states`: contagem de usuários por estado
 */
// ---------------- METRICS: USER DEMOGRAPHICS ----------------
export async function getUserDemographics(): Promise<{
	ageGroups: { name: string; value: number }[];
	states: { name: string; value: number }[];
}> {
	// Busca todos os usuários que possuem data de nascimento e cidade preenchidas
	// Retorna a idade (em anos) e o campo 'city'
	const [rows]: [RowDataPacket[], any] = await db.query(`
      SELECT 
        TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) AS age,
        city
      FROM users
      WHERE birthdate IS NOT NULL AND city IS NOT NULL
    `);

	// Inicia os contadores de faixas etárias
	const ageGroups: Record<string, number> = {
		"Até 18": 0,
		"19-25": 0,
		"26-35": 0,
		"36-50": 0,
		"50+": 0,
	};

	// Inicia os contadores de estados (UFs)
	const stateCounts: Record<string, number> = {};

	for (const { age, city } of rows) {
		// 🎂 Incrementa o grupo de idade correspondente
		if (age <= 18) ageGroups["Até 18"]++;
		else if (age <= 25) ageGroups["19-25"]++;
		else if (age <= 35) ageGroups["26-35"]++;
		else if (age <= 50) ageGroups["36-50"]++;
		else ageGroups["50+"]++;

		// 🗺️ Extrai a sigla do estado (UF) do final do campo 'city'
		const stateMatch =
			typeof city === "string" ? city.match(/-\s*(\w{2})$/) : null;
		const uf = stateMatch?.[1] || "Desconhecido";
		stateCounts[uf] = (stateCounts[uf] || 0) + 1;
	}

	// Transforma os resultados em arrays com formato { name, value }
	return {
		ageGroups: Object.entries(ageGroups).map(([name, value]) => ({
			name,
			value,
		})),
		states: Object.entries(stateCounts).map(([name, value]) => ({
			name,
			value,
		})),
	};
}

/**
 * Busca um usuário pelo ID fornecido.
 *
 * @param id - ID do usuário a ser buscado
 * @returns Objeto do usuário correspondente ou null se não encontrado
 */
// ---------------- METRICS: USER LOOKUP ----------------
export async function getUserById(id: string) {
	// Executa a query buscando todos os dados da tabela `users` com o ID informado
	const [rows] = await db.query<any[]>("SELECT * FROM users WHERE id = ?", [id]);

	// Retorna o primeiro resultado (usuário encontrado), ou null se não houver
	return Array.isArray(rows) ? rows[0] : null;
}

/**
 * Atualiza os dados do perfil de um usuário.
 *
 * @param id - ID do usuário a ser atualizado
 * @param nickname - Novo apelido do usuário
 * @param profile_image - URL da nova imagem de perfil
 * @param bio - Biografia do usuário
 * @param city - Cidade de residência
 * @param birthdate - Data de nascimento (formato: YYYY-MM-DD)
 * @param cpf - CPF do usuário
 * @param cep - CEP do usuário
 * @param profile_completed - Flag indicando se o perfil está completo
 * @param verified - Flag indicando se o perfil foi verificado
 */
// ---------------- METRICS: USER PROFILE UPDATE ----------------
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
	// Executa uma query de atualização na tabela `users`, substituindo os campos fornecidos
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


/**
 * Retorna métricas completas de um usuário específico.
 *
 * - Total de posts
 * - Total de likes recebidos
 * - Post mais curtido
 * - Data de criação da conta
 * - Dias ativos
 * - Prêmios recebidos
 * - Streaks (dias consecutivos ativos)
 * - Percentual de perfil preenchido
 *
 * @param id - ID do usuário a ser buscado
 * @returns Objeto com as métricas detalhadas do usuário
 */
// ---------------- METRICS: USER FULL METRICS ----------------
export async function getUserFullMetrics(id: string) {
	// Consulta agregada: total de posts, likes, melhor post, data de criação etc.
	const [[basicStats]] = await db.query<any[]>(
		`SELECT
			(SELECT COUNT(*) FROM messages WHERE user_id = ?) AS totalPosts,
			(SELECT COUNT(*) FROM message_reactions r
				JOIN messages m ON m.id = r.message_id
				WHERE m.user_id = ? AND r.type = 'like') AS totalLikes,
			(SELECT MAX(likes) FROM messages WHERE user_id = ?) AS topPostLikes,
			(SELECT text FROM messages WHERE user_id = ? ORDER BY likes DESC LIMIT 1) AS topPost,
			(SELECT created_at FROM users WHERE id = ?) AS createdAt,
			(SELECT profile_completed FROM users WHERE id = ?) AS profileCompleted
		`,
		[id, id, id, id, id, id]
	);

	// Conta quantos prêmios o usuário já recebeu
	const [awards]: [RowDataPacket[], any] = await db.query(
		`SELECT COUNT(*) AS count FROM awards WHERE user_id = ?`,
		[id]
	);

	// Lista de dias em que o usuário postou algo
	const [activity]: [RowDataPacket[], any] = await db.query(
		`SELECT DATE(timestamp) as date FROM messages WHERE user_id = ? GROUP BY DATE(timestamp) ORDER BY DATE(timestamp)`,
		[id]
	);

	// Cálculo do maior streak de dias consecutivos ativos
	let longestStreak = 0;
	let currentStreak = 0;
	let previousDate: string | null = null;

	for (const row of activity) {
		const date = new Date(row.date);
		if (previousDate) {
			const prev = new Date(previousDate);
			const diff = (date.getTime() - prev.getTime()) / (1000 * 3600 * 24);
			currentStreak = diff === 1 ? currentStreak + 1 : 1;
		} else {
			currentStreak = 1;
		}
		if (currentStreak > longestStreak) longestStreak = currentStreak;
		previousDate = row.date;
	}

	const activeDays = activity.length;

	// Busca os campos de perfil relevantes para calcular percentual de preenchimento
	const [profileRows] = await db.query<any[]>(
		`SELECT bio, city, birthdate, cpf, cep, profile_image FROM users WHERE id = ?`,
		[id]
	);
	const profile = profileRows?.[0] || {};

	const filledFields = [
		"bio",
		"city",
		"birthdate",
		"cpf",
		"cep",
		"profile_image",
	].filter((f) => !!profile[f]).length;

	const profileCompletion = Math.round((filledFields / 6) * 100);

	// Retorna objeto unificado com todos os dados computados
	return {
		...basicStats,
		topPost: basicStats.topPost || "Nenhuma mensagem encontrada",
		topPostLikes: basicStats.topPostLikes || 0,
		createdAt: basicStats.createdAt,
		longestStreak,
		activeDays,
		awardsCount: awards[0].count,
		profileCompletion,
	};
}


/**
 * Garante que o usuário existe no banco de dados. Se não existir, cria. Se já existir, atualiza a imagem de perfil.
 *
 * - Usado após login via Firebase para garantir persistência local
 * - Se for um usuário novo: insere com base nos dados básicos do Firebase
 * - Se for um usuário antigo: apenas atualiza a imagem de perfil, caso esteja desatualizada
 *
 * @param id - ID único do usuário (normalmente o UID do Firebase)
 * @param email - E-mail do usuário
 * @param nickname - (Opcional) Apelido público
 * @param profile_image - (Opcional) URL da imagem de perfil
 */
// ---------------- AUTH: CREATE OR UPDATE USER ----------------
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
	// Busca o usuário pelo ID para verificar se ele já existe
	const [rows] = await db.query<any[]>("SELECT id FROM users WHERE id = ?", [
		id,
	]);

	if (rows.length === 0) {
		// Se não existir → insere novo registro com os dados fornecidos
		await db.query(
			`INSERT INTO users (id, firebase_uid, email, nickname, profile_image) VALUES (?, ?, ?, ?, ?)`,
			[id, id, email, nickname, profile_image]
		);
	} else {
		// Se já existir → atualiza apenas a imagem de perfil
		await db.query(`UPDATE users SET profile_image = ? WHERE id = ?`, [
			profile_image,
			id,
		]);
	}
}

