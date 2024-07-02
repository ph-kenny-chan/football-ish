import knex from 'knex';
import { Database } from '../config/Database';
import { logger } from '../config/loggerConfig';
import { Venue } from '../types/TeamVenue';

type VenueSchema = {
  id?: number;
  api_id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
  created_at: Date;
  updated_at: Date;
};

export const insertVenues = async (venues: Venue[]): Promise<any> => {
  const venuesToInsert = venues.map(
    venue =>
      ({
        api_id: venue.apiId,
        name: venue.name,
        address: venue.address,
        city: venue.city,
        capacity: venue.capacity,
        surface: venue.surface,
        image: venue.image,
        created_at: new Date(),
        updated_at: new Date()
      }) as VenueSchema
  );
  try {
    const result = await(await Database.getClient())
      .insert<Array<Venue>>(venuesToInsert)
      .into('venue')
      .returning('*');
    logger.info(`Inserted ${result.length} venues`);
    logger.info(result);
    return result;
  } catch (error) {
    logger.error(error);
  }
};

export const updateVenue = async (venue: Venue): Promise<any> => {
  try {
    const result = await (
      await Database.getClient()
    )
      .update({
        name: venue.name,
        address: venue.address,
        city: venue.city,
        capacity: venue.capacity,
        surface: venue.surface,
        image: venue.image,
        updated_at: new Date()
      })
      .from('venue')
      .where('api_id', venue.apiId)
      .returning('*');
    return result[0];
  } catch (error) {
    logger.error(error);
  }
};
export const upsertVenues = async (venues: Venue[]): Promise<any> => {
  try {
    const venuesToInsert = venues.map(venue => ({
      api_id: venue.apiId,
      name: venue.name,
      address: venue.address,
      city: venue.city,
      capacity: venue.capacity,
      surface: venue.surface,
      image: venue.image,
      created_at: new Date(),
      updated_at: new Date()
    }) as VenueSchema);

    logger.info(`Upserting ${venuesToInsert.length} venues`);

    const result = await(await Database.getClient())
      .table('venue')  
      .insert(venuesToInsert)
      .onConflict('api_id')
      .merge((record: VenueSchema, idx: number) => {
        record.name = venuesToInsert[idx].name;
        record.address = venuesToInsert[idx].address;
        record.city = venuesToInsert[idx].city;
        record.capacity = venuesToInsert[idx].capacity;
        record.surface = venuesToInsert[idx].surface;
        record.image = venuesToInsert[idx].image;
        record.updated_at = new Date();
      })
      .returning('*'); // Return all columns of the inserted/updated rows

    logger.info(`Upserted ${result.length} venues`);
    return result;
  } catch (error) {
    logger.error(error);
  }
};

export const findVenues = async (): Promise<Venue[]> => {
  try {
    const result = await (await Database.getClient()).select<Array<VenueSchema>>('*').from('venue');
    if (result.length === 0) {
      return undefined as unknown as Venue[];
    }
    return result.map(
      venue =>
        ({
          id: venue.id,
          apiId: venue.api_id,
          name: venue.name,
          address: venue.address,
          city: venue.city,
          capacity: venue.capacity,
          surface: venue.surface,
          image: venue.image
        }) as Venue
    );
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const findVenueByApiId = async (apiId: number): Promise<Venue> => {
  try {
    const result: VenueSchema | undefined = await (await Database.getClient())
      .select<VenueSchema>('*')
      .from('venue')
      .where('api_id', apiId)
      .first();
    
    if (result?.api_id === undefined) {
      logger.info(`venue api id ${apiId} is not existed`);
      return undefined as unknown as Venue;
    }
    return {
      id: result.id,
      apiId: result.api_id,
      name: result.name,
      address: result.address,
      city: result.city,
      capacity: result.capacity,
      surface: result.surface,
      image: result.image
    } as Venue;
  } catch (error) {
    logger.error(error);
    return {} as Venue;
  }
};
