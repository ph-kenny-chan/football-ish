import { Database } from '../config/Database';
import { logger } from '../config/loggerConfig';
import { TeamVenue } from '../types/TeamVenue';

type TeamVenueSchema = {
  id?: number;
  team_id?: number;
  venue_id?: number;
  year_num: number;
  created_at: Date;
  updated_at: Date;
};

export const upsertTeamVenues = async (teamVenues: TeamVenue[]): Promise<any> => {
  const teamVenuesToInsert = teamVenues.map(
    teamVenue =>
      ({
        team_id: teamVenue.team.id,
        venue_id: teamVenue.venue.id,
        year_num: teamVenue.season,
        created_at: new Date(),
        updated_at: new Date()
      }) as TeamVenueSchema
  );
  teamVenuesToInsert.forEach(teamVenue => {
    logger.info(`Upserting teamVenue: ${teamVenue.team_id}, ${teamVenue.venue_id}, ${teamVenue.year_num}`);
  });

  try {
    const result = await(await Database.getClient())
      .table('team_venue')
      .insert(teamVenuesToInsert)
      .onConflict(['team_id', 'venue_id','year_num'])
      .merge((record: TeamVenueSchema, idx: number) => {
        record.updated_at = new Date();
      })
      .returning('*');

    logger.info(`Upserted ${result.length} teamVenues`);
    return result;
  } catch (error) {
    logger.error(error);
  }
};

export const findTeamVenues = async (): Promise<TeamVenueSchema[]> => {
  try {
    const result = await (await Database.getClient()).select<Array<TeamVenueSchema>>('*').from('team_venue');
    return result;
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const findTeamVenueByTeamIdAndVenueId = async (teamId: number, venueId: number): Promise<TeamVenue> => {
  try {
    const result: TeamVenueSchema | undefined = await (await Database.getClient())
      .select<TeamVenueSchema>('*')
      .from('team_venue')
      .where('team_id', teamId)
      .where('venue_id', venueId)
      .first();
    if (result?.id === undefined) {
      logger.info(`TeamVenue not found for teamId: ${teamId} and venueId: ${venueId}`)
      return undefined as unknown as TeamVenue;
    }
    return {
      team: { id: result.team_id },
      venue: { id: result.venue_id }
    } as TeamVenue;
  } catch (error) {
    logger.error(error);
    return {} as TeamVenue;
  }
};
