import { log } from 'console';
import { Database } from '../config/Database';
import { logger } from '../config/loggerConfig';
import { Team } from '../types/TeamVenue';
import knex from 'knex';

type TeamSchema = {
  id?: number;
  api_id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
  created_at: Date;
  updated_at: Date;
};

export const insertTeams = async (teams: Team[]): Promise<any> => {
  const teamsToInsert = teams.map(
    team =>
      ({
        api_id: team.apiId,
        name: team.name,
        code: team.code,
        country: team.country,
        founded: team.founded,
        national: team.national,
        logo: team.logo,
        created_at: new Date(),
        updated_at: new Date()
      }) as TeamSchema
  );
  try {
    const result = await (await Database.getClient())
      .insert<Array<Team>>(teamsToInsert)
      .into('team')
      .returning('*');
    logger.info(`Inserted ${result.length} teams`);
    return result;
  } catch (error) {
    logger.error(error);
  }
};

export const updateTeam = async (team: Team): Promise<any> => {
  try {
    const result = await (
      await Database.getClient()
    )
      .update({
        name: team.name,
        code: team.code,
        country: team.country,
        founded: team.founded,
        national: team.national,
        logo: team.logo,
        updated_at: new Date()
      })
      .from('team')
      .where('api_id', team.apiId)
      .returning('*');
    return result[0];
  } catch (error) {
    logger.error(error);
  }
};

export const upsertTeams = async (teams: Team[]): Promise<any> => {
  try {
    // Step 1: Prepare the data
    const teamsToInsert = teams.map(team => ({
      api_id: team.apiId,
      name: team.name,
      code: team.code,
      country: team.country,
      founded: team.founded,
      national: team.national,
      logo: team.logo,
      created_at: new Date(),
      updated_at: new Date()
    }) as TeamSchema);

    logger.info(`Upserting ${teamsToInsert.length} teams`);

    const result = await (await Database.getClient())
    .table('team')
    .insert(teamsToInsert)
    .onConflict('api_id')
    .merge((record:TeamSchema, idx: number) => {
      record.code = teamsToInsert[idx].code;
      record.country = teamsToInsert[idx].country;
      record.founded = teamsToInsert[idx].founded;
      record.logo = teamsToInsert[idx].logo;
      record.name = teamsToInsert[idx].name;
      record.national = teamsToInsert[idx].national;
      record.updated_at = new Date();
    })
    .returning('*');
    
    logger.info(`Upserted ${result.length} teams`);
    return result;
  } catch (error) {
    logger.error(error);
  }
};

export const findTeamByApiId = async (apiId: number): Promise<Team> => {
  try {
    const result: TeamSchema | undefined = await (await Database.getClient())
      .select<TeamSchema>('*')
      .from('team')
      .where('api_id', apiId)
      .first();
    if (result?.api_id === undefined) {
      logger.info(`team api id ${apiId} is not existed`);
      return undefined as unknown as Team;
    }
    return {
      id: result.id,
      apiId: result.api_id,
      name: result.name,
      code: result.code,
      country: result.country,
      founded: result.founded,
      national: result.national,
      logo: result.logo
    } as Team;
  } catch (error) {
    logger.error(error);
    return {} as Team;
  }
};
