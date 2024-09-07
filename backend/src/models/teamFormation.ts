import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';
import { TeamFormation } from '../types/TeamStatistic';

export type TeamFormationSchema = {
  id?: number;
  team_id: number;
  league_id: number;
  year_num: number;
  formation: string;
  played: number;
  created_at: Date;
  updated_at: Date;
};

export const upsertTeamFormation = async (teamFormation: TeamFormation): Promise<void> => {
  const teamFormationToInsert = {
    team_id: teamFormation.teamId,
    league_id: teamFormation.leagueId,
    year_num: teamFormation.yearNum,
    formation: teamFormation.formation,
    played: teamFormation.played,
    created_at: new Date(),
    updated_at: new Date()
  } as TeamFormationSchema;

  try {
    await(await Database.getClient())
      .table('team_formation')
      .insert(teamFormationToInsert)
      .onConflict(['team_id', 'league_id', 'year_num', 'formation'])
      .merge({
        played: teamFormation.played,
        updated_at: new Date()
      });
  } catch (error) {
    logger.error('Error upserting team formation:', error);
    throw error;
  }
};
