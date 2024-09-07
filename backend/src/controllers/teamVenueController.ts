import { Request, Response } from 'express';
import { logger } from '../middlewares/loggerConfig';
import { fetchTeamVenues, addNewTeamVenuesToDB, teams } from '../services/teamVenueService';
import { updateTeamsInDB } from '../services/teamService';
import { upsertVenuesInDB } from '../services/venueService';

export const fetchTeamVenueByLeagueIds = async (req: Request, res: Response) => {
  const reqLeagueIds: string = req.params.leagueIds;
  const leagueIds = reqLeagueIds.split(',').map(Number);
  const reqSeason: number = +req.params.season;
  if (!reqLeagueIds || !reqSeason) {
    return res.status(400).json({ code: 400, message: 'Bad Request' });
  }

  const batchSize = 5;
  const totalBatches = Math.ceil(leagueIds.length / batchSize);
  let result: any[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const start = i * batchSize;
    const end = start + batchSize;
    const batch = leagueIds.slice(start, end);

    const batchResult = await fetchTeamVenues(batch.join(','), reqSeason);
    result[i] = batchResult;
  }

  return res.status(200).json({ code: 200, message: result });
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
