import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';
import { ForAgainst, HomeAway, MinuteRange, TeamGoal, TeamGoalMinute } from '../types/TeamStatistic';

export type TeamGoalMinuteSchema = {
  id: number;
  team_id: number;
  year_num: number;
  for_against: ForAgainst;
  minute: MinuteRange;
  total: number,
  percentage: number,
  created_at: Date;
  updated_at: Date;
};

export const upsertTeamGoalMinute = async (teamGoalMinute: TeamGoalMinute): Promise<void> => {
  const teamGoalMinuteToInsert = {
    team_id: teamGoalMinute.teamId,
    year_num: teamGoalMinute.yearNum,
    for_against: teamGoalMinute.forAgainst,
    minute: teamGoalMinute.minute,
    total: teamGoalMinute.total,
    percentage: teamGoalMinute.percentage,
    created_at: new Date(),
    updated_at: new Date()
  } as TeamGoalMinuteSchema;
  try {
    await(await Database.getClient())
      .table('team_goal_minute')
      .insert(teamGoalMinuteToInsert)
      .onConflict(['team_id', 'year_num', 'for_against', 'minute'])
      .merge({
        total: teamGoalMinute.total,
        percentage: teamGoalMinute.percentage,
        updated_at: new Date()
      });
  } catch (error) {
    logger.error('Error upserting team goal minute:', error);
    throw error;
  }
};
