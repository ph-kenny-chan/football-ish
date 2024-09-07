import { Request, Response } from 'express';
import { fetchTeamStatistics } from '../services/teamStatisticService';

export const getTeamStatistics = async (req: Request, res: Response) => {
  const { leagueId, teamId, season } = req.params;

  try {
    const statistics = await fetchTeamStatistics(parseInt(leagueId), parseInt(teamId), parseInt(season));
    return res.status(200).json(statistics);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch team statistics' });
  }
};
