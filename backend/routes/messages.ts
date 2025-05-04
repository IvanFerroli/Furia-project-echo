// /home/ivanilson-ferreira/Desktop/furia-project-echo/backend/routes/messages.ts
import db from '../db';
import { Router } from 'express';
import {
  getMessages,
  postMessage,
  patchReaction,
} from '../controllers/messagesController';

import { RowDataPacket, FieldPacket } from 'mysql2';

const router = Router();

router.get('/', getMessages);
router.post('/', postMessage);
router.patch('/:id/reaction', patchReaction);

export default router;

export async function getDashboardMetrics() {
  const [mostLiked]: [RowDataPacket[], FieldPacket[]] = await db.query(`
    SELECT * FROM messages
    WHERE parent_id IS NULL
    ORDER BY likes DESC LIMIT 1
  `);

  const [mostDisliked]: [RowDataPacket[], FieldPacket[]] = await db.query(`
    SELECT * FROM messages
    WHERE parent_id IS NULL
    ORDER BY dislikes DESC LIMIT 1
  `);

  const [topHashtags]: [RowDataPacket[], FieldPacket[]] = await db.query(`
    SELECT LOWER(SUBSTRING_INDEX(SUBSTRING_INDEX(text, '#', -1), ' ', 1)) AS tag,
           COUNT(*) AS count
    FROM messages
    WHERE text LIKE '%#%'
    GROUP BY tag
    ORDER BY count DESC
    LIMIT 5
  `);

  const [userRanking]: [RowDataPacket[], FieldPacket[]] = await db.query(`
    SELECT user_id, nickname, COUNT(*) AS messages, 
           SUM(likes) AS total_likes, 
           SUM(dislikes) AS total_dislikes
    FROM messages
    GROUP BY user_id, nickname
    ORDER BY total_likes DESC
    LIMIT 5
  `);

  return {
    mostLiked: mostLiked[0] || null,
    mostDisliked: mostDisliked[0] || null,
    topHashtags,
    userRanking,
  };
}
