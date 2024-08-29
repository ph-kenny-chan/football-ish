import { getTeamStatisticsBySeason } from '../api-football-client';

export const fetchTeamStatistics = async (leagueId: number, teamId: number, season: number) => {
  try {
    const statistics = await getTeamStatisticsBySeason({leagueId, teamId, season});
    return statistics;
  } catch (error) {
    throw new Error('Failed to fetch team statistics');
  }
};
