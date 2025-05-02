import { Router } from 'express';
import {
  getMessages,
  postMessage,
  patchReaction,
} from '../controllers/messagesController';

const router = Router();

router.get('/', getMessages);
router.post('/', postMessage);
router.patch('/:id/reaction', patchReaction);

export default router;
