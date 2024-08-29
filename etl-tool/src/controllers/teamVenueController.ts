import { Request, Response } from 'express';
import { logger } from '../middlewares/loggerConfig';
import { findLeaguesByCountryId } from '../models/league';
import { fetchTeamVenues, addNewTeamVenuesToDB, teams } from '../services/teamVenueService';
import { updateTeamsInDB } from '../services/teamService';
import { upsertVenuesInDB } from '../services/venueService';
import { allCountries } from '../services/countryService';

export const syncTeamVenueByCountryCodes = async (req: Request, res: Response) => {
  const countryCodes: string = req.body.countryCodes;
  const season: number = req.body.season;
  if (!countryCodes || !season) {
    return res.status(400).json({ code: 400, message: 'Bad Request' });
  }

  const countryIds = countryCodes.split(',').map(countryCode => allCountries.find(country => country.code === countryCode)?.id);
  logger.info(`countryIds: ${countryIds}`);
  for (const countryId of countryIds) {
    const leagues = await findLeaguesByCountryId(countryId ?? 0, 3);
    const leagueIds: number[] = leagues.map(league => league.apiId ?? 0);
    logger.info(`${leagueIds.length} leagues found for countryId: ${countryId}`);
    if (leagueIds) {
      const result = await fetchTeamVenues(leagueIds, season);
      return res.status(result.code).send({ result: result.message });
    } else {
      return res.status(400).json({ code: 400, message: 'Bad Request' });
    }
  }
};

export const syncAllTeamVenues = async (req: Request, res: Response) => {
  try {
    Promise.all([await updateTeamsInDB(), await upsertVenuesInDB()]).then(async () => {
      await addNewTeamVenuesToDB();
    });
    return res.status(200).send({ message: 'ok' });
  } catch (error) {
    return res.status(400).send({ message: 'error' });
  }
};

export const getTeamsInfo = async (req: Request, res: Response) => {
  return res.status(200).send({ message: teams });
};
