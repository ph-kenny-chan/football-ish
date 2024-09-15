import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';
import { HomeAway, TeamMatchOverview } from '../types/TeamStatistic';

export type TeamMatchOverviewSchema = {
  id: number;
  team_id: number;
  league_id: number;
  year_num: number;
  home_away: HomeAway;
  played: number;
  wins: number;
  draws: number;
  loses: number;
  created_at: Date;
  updated_at: Date;
};

export const upsertTeamMatchOverview = async (teamMatchOverview: TeamMatchOverview): Promise<void> => {
  const teamMatchOverviewToInsert = {
    team_id: teamMatchOverview.teamId,
    league_id: teamMatchOverview.leagueId,
    year_num: teamMatchOverview.yearNum,
    home_away: teamMatchOverview.homeAway,
    played: teamMatchOverview.played,
    wins: teamMatchOverview.wins,
    draws: teamMatchOverview.draws,
    loses: teamMatchOverview.loses,
    created_at: new Date(),
    updated_at: new Date()
  } as TeamMatchOverviewSchema;
  try {
    await(await Database.getClient())
      .table('team_match_overview')
      .insert(teamMatchOverviewToInsert)
      .onConflict(['team_id', 'league_id', 'year_num', 'home_away'])
      .merge({
        played: teamMatchOverview.played,
        wins: teamMatchOverview.wins,
        draws: teamMatchOverview.draws,
        loses: teamMatchOverview.loses,
        updated_at: new Date()
      });
  } catch (error) {
    logger.error('Error upserting team match overview:', error);
    throw error;
  }
};
