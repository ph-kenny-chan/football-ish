import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';
import { ForAgainst, HomeAway, TeamGoal } from '../types/TeamStatistic';

export type TeamGoalSchema = {
  id: number;
  team_id: number;
  year_num: number;
  home_away: HomeAway;
  for_against: ForAgainst;
  total: number;
  average: number;
  created_at: Date;
  updated_at: Date;
};

export const upsertTeamGoal = async (teamGoal: TeamGoal): Promise<void> => {
  const teamGoalToInsert = {
    team_id: teamGoal.teamId,
    year_num: teamGoal.yearNum,
    home_away: teamGoal.homeAway,
    for_against: teamGoal.forAgainst,
    total: teamGoal.total,
    average: teamGoal.average,
    created_at: new Date(),
    updated_at: new Date()
  } as TeamGoalSchema;
  try {
    await (await Database.getClient())
      .table('team_goal')
      .insert(teamGoalToInsert)
      .onConflict(['team_id', 'year_num', 'home_away', 'for_against'])
      .merge({
        total: teamGoal.total,
        average: teamGoal.average,
        updated_at: new Date()
      });
  } catch (error) {
    logger.error('Error upserting team goal:', error);
    throw error;
  }
};
