import { Request, Response } from 'express';
import { fetchLeagues } from '../services/leagueService';

export const syncLeagues = async (req: Request, res: Response) => {
  const result = await fetchLeagues();
  res.status(result.code).send({ result: result.message });
};
