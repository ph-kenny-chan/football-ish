import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';
import { TeamCard } from '../types/TeamStatistic';

export type TeamCardSchema = {
  id: number;
  team_id: number;
  league_id: number;
  year_num: number;
  minute: string;
  yellow_total: number;
  yellow_percentage: number;
  red_total: number;
  red_percentage: number;
  createdAt: Date;
  updatedAt: Date;
};

export const upsertTeamCard = async (teamCard: TeamCard): Promise<void> => {
  const teamCardToInsert = {
    team_id: teamCard.teamId,
    league_id: teamCard.leagueId,
    year_num: teamCard.yearNum,
    minute: teamCard.minute,
    yellow_total: teamCard.yellowTotal,
    yellow_percentage: teamCard.yellowPercentage,
    red_total: teamCard.redTotal,
    red_percentage: teamCard.redPercentage,
    created_at: new Date(),
    updated_at: new Date()
  };

  try {
    await (await Database.getClient()).table('team_card').insert(teamCardToInsert).onConflict(['team_id', 'league_id', 'year_num', 'minute']).merge({
      yellow_total: teamCard.yellowTotal,
      yellow_percentage: teamCard.yellowPercentage,
      red_total: teamCard.redTotal,
      red_percentage: teamCard.redPercentage,
      updated_at: new Date()
    }).returning('*');
  } catch (error) {
    logger.error('Error upserting team card:', error);
    throw error;
  }
};
