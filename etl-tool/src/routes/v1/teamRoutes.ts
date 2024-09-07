import { Router } from "express";
import { fetchTeamVenueByLeagueIds, getTeamsInfo, syncAllTeamVenues } from '../../controllers/teamVenueController';
import { getTeamStatistics } from "../../controllers/teamStatisticController";

const router = Router();

router.post('/venues/fetch/:leagueIds/:season', fetchTeamVenueByLeagueIds);
router.post('/venues/sync', syncAllTeamVenues);

router.post('/statistics/sync/:leagueId/:teamId/:season', getTeamStatistics);

export { router as teamRoutes };