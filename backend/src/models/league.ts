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

export const upsertLeagues = async (leagues: League[]): Promise<any> => {
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

  try {
    return await (
      await Database.getClient()
    )
      .table('league')
      .insert(leaguesToInsert)
      .onConflict(['api_id'])
      .merge((record: LeagueSchema, idx: number) => {
        (record.country_id = leaguesToInsert[idx].country_id),
          (record.name = leaguesToInsert[idx].name),
          (record.type = leaguesToInsert[idx].type),
          (record.logo = leaguesToInsert[idx].logo),
          (record.updated_at = new Date());
      })
      .returning('*');
  } catch (error) {
    logger.error('Error upserting league:', error);
    throw error;
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

export const findLeagueByApiId = async (apiId: number): Promise<League> => {
  try {
    const result: LeagueSchema | undefined = await (await Database.getClient())
      .select<LeagueSchema>(['*'])
      .from('league')
      .where('api_id', apiId)
      .first();
    if (result?.api_id === undefined) {
      logger.info(`league api id ${apiId} is not existed`);
      return undefined as unknown as League;
    }
    return {
      id: result.id,
      apiId: result.api_id,
      countryId: result.country_id,
      name: result.name,
      type: result.type,
      logo: result.logo
    };
  } catch (error) {
    logger.error(error);
    return {} as League;
  }
}

export const findLeaguesByCountryIds = async (countryIds: number[], limit: number | null = null): Promise<League[]> => {
  try {
    const result = await (
      await Database.getClient()
    )
      .select<Array<LeagueSchema>>('*')
      .from('league')
      .whereIn('country_id', countryIds)
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