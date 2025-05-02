import { Router } from 'express';
import * as awardsController from '../controllers/awardsController';


const router = Router();

router.get('/:userId', async (req, res, next) => {
    try {
      await awardsController.getUserAwards(req, res);
      next();
    } catch (err) {
      next(err);
    }
  });
  
  router.post('/', async (req, res, next) => {
    try {
      await awardsController.postAward(req, res);
      next();
    } catch (err) {
      next(err);
    }
  });
  

export default router;
