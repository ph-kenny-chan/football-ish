import express, { Request, Response } from 'express';
import { fetchTeamVenues, addNewTeamVenuesToDB, teams } from '../../services/teamVenueService';
import { findAllLeagues, findLeaguesByCountryId } from '../../models/league';
import { logger } from '../../middlewares/loggerConfig';
import { getTeamsInfo, syncAllTeamVenues, syncTeamVenueByCountryCodes } from '../../controllers/teamVenueController';

const router = express.Router();

router.post('/syncByCountryCodes', syncTeamVenueByCountryCodes);

router.post('/syncAllTeamVenues', syncAllTeamVenues);

router.get('/getTeamsInfo', getTeamsInfo);

export { router as teamVenueRoutes };
