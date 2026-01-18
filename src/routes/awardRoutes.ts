import { Router, Request, Response } from 'express';
import { AwardController } from '../controllers/AwardController';

const router = Router();

export function createAwardRoutes(awardController: AwardController): Router {
    router.get('/award-intervals', (req: Request, res: Response) => {
        awardController.getAwardIntervals(req, res);
    });
    return router;
}

export default router;