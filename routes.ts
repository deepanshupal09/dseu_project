import { Router } from 'express';
import * as controller from './controller';

const router = Router();

router.get("/getUserByRollno", controller.getUserByRollno);
router.post("/updateDetailsByRollno",controller.updateDetailsByRollno)

export default router;
