import express, { Request, Response } from 'express';
import { syncLeagues } from '../../controllers/leagueController';

const router = express.Router();

router.post('/sync', syncLeagues);

export { router as leagueRoutes };
