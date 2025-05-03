import { Router } from 'express';
import { getUserAwards, postAward } from '../controllers/awardsController';

const router = Router();

router.get('/:userId', getUserAwards);
router.post('/', postAward);

export default router;
