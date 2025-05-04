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

    export async function getDashboardMetrics(): Promise<DashboardMetrics> {
        const [posts]: [RowDataPacket[], any] = await db.query(`
        SELECT * FROM messages
    `);

        const [userStats]: [RowDataPacket[], any] = await db.query(`
        SELECT 
        u.id AS user_id,
        u.nickname,
        COUNT(m.id) AS messages,
        SUM(m.likes) AS total_likes,
        SUM(m.dislikes) AS total_dislikes
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
            if (!mostLiked || post.likes > mostLiked.likes) mostLiked = post;
            if (!mostDisliked || post.dislikes > mostDisliked.dislikes) mostDisliked = post;

            const foundTags = post.text?.match(/#[\wÀ-ú]+/g);
            if (foundTags) {
                for (const tag of foundTags) {
                    hashtagsMap[tag] = (hashtagsMap[tag] || 0) + 1;
                }
            }

            const date = new Date(post.timestamp).toISOString().split("T")[0];
            streakMap[date] = (streakMap[date] || 0) + 1;
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

    export async function getActivityStreak(): Promise<{ date: string; streak: number }[]> {
        const [rows]: [RowDataPacket[], any] = await db.query(`
            SELECT DATE(timestamp) as active_day, COUNT(*) as count
            FROM messages
            GROUP BY active_day
            ORDER BY active_day
        `);
    
        return rows.map((row: any) => ({
            date: row.active_day,
            count: row.count,
        }));
    }
    