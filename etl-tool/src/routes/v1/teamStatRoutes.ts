import { Router } from 'express';
import { getTeamStatistics } from '../../controllers/teamStatController';

const router = Router();

router.get('/team-statistics/:leagueId/:teamId/:season', getTeamStatistics);

export { router as teamStatRoutes };
