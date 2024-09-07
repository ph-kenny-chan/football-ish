import express, { Request, Response } from 'express';
import { syncAllLeagues, syncLeaguesByCountryCodes } from '../../controllers/leagueController';

const router = express.Router();

router.post('/sync/countries/all', syncAllLeagues);
router.post('/sync/countries/:countryCodes', syncLeaguesByCountryCodes);

export { router as leagueRoutes };
