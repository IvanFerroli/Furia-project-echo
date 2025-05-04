import express from 'express';
import { getDashboard } from '../controllers/metricsController';

const router = express.Router();

router.get('/', getDashboard);

export default router;
