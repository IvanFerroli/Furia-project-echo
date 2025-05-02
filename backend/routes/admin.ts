import { Router } from 'express';
import { getUsers, getStats } from '../controllers/adminController';
import isAdmin from '../middleware/isAdmin';

const router = Router();

router.get('/users', isAdmin, getUsers);
router.get('/stats', isAdmin, getStats);

export default router;
