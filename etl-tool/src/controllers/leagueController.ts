import { Request, Response } from 'express';
import { fetchAllLeagues, fetchLeaguesByCountryCodes } from '../services/leagueService';

export const syncAllLeagues = async (req: Request, res: Response) => {
  const result = await fetchAllLeagues();
  return res.status(result.code).send({ result: result.message });
};

export const syncLeaguesByCountryCodes = async (req: Request, res: Response) => {
  const countryCodes = req.params.countryCodes;
  if (countryCodes) {
    const result = await fetchLeaguesByCountryCodes(countryCodes);
    res.status(result.code).send({ result: result.message });
  }
  return res.status(400).send({ result: 'error' });
}
