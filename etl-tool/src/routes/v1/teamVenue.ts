import express, { Request, Response } from 'express';
import { syncTeamVenuesFromAPI, syncTeamVenuesToDB, syncTeamsToDB, syncVenuesToDB, teams } from '../../services/team';
import { findAllLeagues, findLeaguesByCountryId } from '../../models/league';
import { allCountries } from '../../services/league';
import { logger } from '../../config/loggerConfig';

const router = express.Router();

router.post('/syncByCountryCodes', async (req: Request, res: Response) => {
  const countryCodes: string = req.body.countryCodes;
  const season: number = req.body.season;
  if (!countryCodes || !season) {
    return res.status(400).json({ code: 400, message: 'Bad Request' });
  };
  
  const countryIds = countryCodes.split(',').map(countryCode => allCountries.find(country => country.code === countryCode)?.id);
  logger.info(`countryIds: ${countryIds}`);
  for (const countryId of countryIds) {
    const leagues = await findLeaguesByCountryId(countryId ?? 0, 3);
    const leagueIds: number[] = leagues.map(league => league.apiId ?? 0);
    logger.info(`${leagueIds.length} leagues found for countryId: ${countryId}`);
    if (leagueIds) {
      const result = await syncTeamVenuesFromAPI(leagueIds, season);
      return res.status(result.code).send({ result: result.message });
    } else {
      return res.status(400).json({ code: 400, message: 'Bad Request' });
    }
  }
});

router.post('/upsertTeamVenues', async (req: Request, res: Response) => {
  try {
    Promise.all([await syncTeamsToDB(), await syncVenuesToDB()])
      .then(async () => {
        await syncTeamVenuesToDB();
      });
    return res.status(200).send({ message: 'ok' });
  } catch (error) {
    return res.status(400).send({ message: 'error' });
  }
  
});

router.get('/getTeamsInfo', async (req: Request, res: Response) => {
  return res.status(200).send({ message: teams });
});

export { router as teamVenue };
