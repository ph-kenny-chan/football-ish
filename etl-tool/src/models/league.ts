import knex from 'knex';
import { logger } from '../middlewares/loggerConfig';
import { League } from '../types/League';
import { Database } from '../config/Database';

export type LeagueSchema = {
  id?: number;
  api_id: number;
  country_id: number;
  name: string;
  type: string;
  logo: string;
  created_at: Date;
  updated_at: Date;
};

export const insertLeagues = async (leagues: League[]): Promise<any> => {
  const leaguesToInsert = leagues.map(
    league =>
      ({
        api_id: league.apiId,
        country_id: league.countryId,
        name: league.name,
        type: league.type,
        logo: league.logo,
        created_at: new Date(),
        updated_at: new Date()
      }) as LeagueSchema
  );
  logger.info(`leaguesToInsert: ${leaguesToInsert.length}`);
  try {
    const result = await (await Database.getClient()).insert<Array<League>>(leaguesToInsert).into('league').returning('*');
    return result[0];
  } catch (error) {
    logger.error(error);
  }
};

export const updateLeague = async (league: League): Promise<any> => {
  try {
    const result = await (
      await Database.getClient()
    )
      .update({
        name: league.name,
        type: league.type,
        logo: league.logo,
        updated_at: new Date()
      })
      .from('league')
      .where('api_id', league.apiId)
      .returning('*');
    return result[0];
  } catch (error) {
    logger.error(error);
  }
};

export const findAllLeagues = async (): Promise<League[]> => {
  try {
    const result = await (await Database.getClient()).select<Array<LeagueSchema>>(['*']).from('league');
    return result.map(
      league =>
        ({
          id: league.id,
          apiId: league.api_id,
          countryId: league.country_id,
          name: league.name,
          type: league.type,
          logo: league.logo
        }) as League
    );
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const findLeaguesByCountryId = async (countryId: number, limit: number | null = null): Promise<League[]> => {
  try {
    const result = await (
      await Database.getClient()
    )
      .select<Array<LeagueSchema>>('*')
      .from('league')
      .where('country_id', countryId)
      .where('type', 'League')
      .limit(limit ?? 100000);
    return result.map(
      league =>
        ({
          id: league.id,
          apiId: league.api_id,
          countryId: league.country_id,
          name: league.name,
          type: league.type,
          logo: league.logo
        }) as League
    );
  } catch (error) {
    logger.error(error);
    return [];
  }
};
