import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';
import { TeamRecord } from '../types/TeamStatistic';

export type TeamRecordSchema = {
  id: number;
  team_id: number;
  year_num: number;
  form: string;
  streak_wins: number;
  streak_draws: number;
  streak_loses: number;
  wins_home: number;
  wins_away: number;
  loses_home: number;
  loses_away: number;
  biggest_for_home: number;
  biggest_for_away: number;
  biggest_against_home: number;
  biggest_against_away: number;
  clean_sheet_home: number;
  clean_sheet_away: number;
  clean_sheet_total: number;
  failed_to_score_home: number;
  failed_to_score_away: number;
  failed_to_score_total: number;
  penalty_total: number;
  penalty_scored_total: number;
  penalty_scored_percentage: number;
  penalty_missed_total: number;
  penalty_missed_percentage: number;
  created_at: Date;
  updated_at: Date;
};

export const upsertTeamRecord = async (teamRecord: TeamRecord): Promise<void> => {
  const teamRecordToInsert = {
    team_id: teamRecord.teamId,
    year_num: teamRecord.yearNum,
    form: teamRecord.form,
    streak_wins: teamRecord.streakWins,
    streak_draws: teamRecord.streakDraws,
    streak_loses: teamRecord.streakLoses,
    wins_home: teamRecord.winsHome,
    wins_away: teamRecord.winsAway,
    loses_home: teamRecord.losesHome,
    loses_away: teamRecord.losesAway,
    biggest_for_home: teamRecord.biggestForHome,
    biggest_for_away: teamRecord.biggestForAway,
    biggest_against_home: teamRecord.biggestAgainstHome,
    biggest_against_away: teamRecord.biggestAgainstAway,
    clean_sheet_home: teamRecord.cleanSheetHome,
    clean_sheet_away: teamRecord.cleanSheetAway,
    clean_sheet_total: teamRecord.cleanSheetTotal,
    failed_to_score_home: teamRecord.failedToScoreHome,
    failed_to_score_away: teamRecord.failedToScoreAway,
    failed_to_score_total: teamRecord.failedToScoreTotal,
    penalty_total: teamRecord.penaltyTotal,
    penalty_scored_total: teamRecord.penaltyScoredTotal,
    penalty_scored_percentage: teamRecord.penaltyScoredPercentage,
    penalty_missed_total: teamRecord.penaltyMissedTotal,
    penalty_missed_percentage: teamRecord.penaltyMissedPercentage
  } as TeamRecordSchema;

  try {
    await (await Database.getClient()).table('team_record').insert(teamRecordToInsert).onConflict(['team_id', 'year_num']).merge({
      form: teamRecord.form,
      streak_wins: teamRecord.streakWins,
      streak_draws: teamRecord.streakDraws,
      streak_loses: teamRecord.streakLoses,
      wins_home: teamRecord.winsHome,
      wins_away: teamRecord.winsAway,
      loses_home: teamRecord.losesHome,
      loses_away: teamRecord.losesAway,
      biggest_for_home: teamRecord.biggestForHome,
      biggest_for_away: teamRecord.biggestForAway,
      biggest_against_home: teamRecord.biggestAgainstHome,
      biggest_against_away: teamRecord.biggestAgainstAway,
      clean_sheet_home: teamRecord.cleanSheetHome,
      clean_sheet_away: teamRecord.cleanSheetAway,
      clean_sheet_total: teamRecord.cleanSheetTotal,
      failed_to_score_home: teamRecord.failedToScoreHome,
      failed_to_score_away: teamRecord.failedToScoreAway,
      failed_to_score_total: teamRecord.failedToScoreTotal,
      penalty_total: teamRecord.penaltyTotal,
      penalty_scored_total: teamRecord.penaltyScoredTotal,
      penalty_scored_percentage: teamRecord.penaltyScoredPercentage,
      penalty_missed_total: teamRecord.penaltyMissedTotal,
      penalty_missed_percentage: teamRecord.penaltyMissedPercentage,
      updated_at: new Date()
    });
  } catch (error) {
    logger.error('Error upserting team record:', error);
    throw error;
  }
};
