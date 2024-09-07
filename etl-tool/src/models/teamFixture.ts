import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';
import { HomeAway, TeamFixture } from '../types/TeamStatistic';

export type TeamFixtureSchema = {
  id: number;
  team_id: number;
  year_num: number;
  home_away: HomeAway;
  played: number;
  wins: number;
  draws: number;
  loses: number;
  created_at: Date;
  updated_at: Date;
};

export const upsertTeamFixture = async (teamFixture: TeamFixture): Promise<void> => {
  const teamFixtureToInsert = {
    team_id: teamFixture.teamId,
    year_num: teamFixture.yearNum,
    home_away: teamFixture.homeAway,
    played: teamFixture.played,
    wins: teamFixture.wins,
    draws: teamFixture.draws,
    loses: teamFixture.loses,
    created_at: new Date(),
    updated_at: new Date()
  } as TeamFixtureSchema;
  try {
    await(await Database.getClient())
      .table('team_fixture')
      .insert(teamFixtureToInsert)
      .onConflict(['team_id', 'year_num', 'home_away'])
      .merge({
        played: teamFixture.played,
        wins: teamFixture.wins,
        draws: teamFixture.draws,
        loses: teamFixture.loses,
        updated_at: new Date()
      });
  } catch (error) {
    logger.error('Error upserting team fixture:', error);
    throw error;
  }
};
