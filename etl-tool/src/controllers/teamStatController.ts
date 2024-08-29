import { Request, Response } from 'express';
import { fetchTeamStatistics } from '../services/teamStatService';

export const getTeamStatistics = async (req: Request, res: Response) => {
  const { leagueId, teamId, season } = req.params;

  try {
    const statistics = await fetchTeamStatistics(parseInt(leagueId), parseInt(teamId), parseInt(season));
    res.status(200).json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team statistics' });
  }
};
