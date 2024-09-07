import knex from 'knex';
import { Country } from '../types/Country';
import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';

export type CountrySchema = {
  id?: number;
  code: string;
  name: string;
  flag: string;
  created_at: Date;
  updated_at: Date;
};

export const insertCountries = async (countries: Country[]): Promise<any> => {
  const countriesToInsert = countries.map(
    country =>
      ({
        code: country.code,
        name: country.name,
        flag: country.flag,
        created_at: new Date(),
        updated_at: new Date()
      }) as CountrySchema
  );

  try {
    const result = await (await Database.getClient()).insert<Array<Country>>(countriesToInsert).into('country').returning('*');
    return result;
  } catch (error) {
    logger.error(error);
  }
};

export const findCountries = async (): Promise<Country[]> => {
  try {
    const result = await (await Database.getClient()).select<Array<CountrySchema>>(['*']).from('country');
    return result.map(
      country =>
        ({
          id: country.id,
          code: country.code,
          name: country.name,
          flag: country.flag
        }) as Country
    );
  } catch (error) {
    logger.error(error);
    return [];
  }
};

export const upsertCountries = async (countries: Country[]): Promise<any> => {
  const countriesToInsert = countries.map(country => ({
    code: country.code,
    name: country.name,
    flag: country.flag,
    created_at: new Date(),
    updated_at: new Date()
  } as CountrySchema
  ));

  try {
    const result = await (
      await Database.getClient()
    )
      .table('country')
      .insert(countriesToInsert)
      .onConflict(['code', 'name'])
      .merge((record: CountrySchema, idx: number) => {
        record.name = countriesToInsert[idx].name,
        record.flag = countriesToInsert[idx].flag,
        record.updated_at = new Date()
      })
      .returning('*');
    return result;
  } catch (error) {
    logger.error(error);
  }
};

export const findCountryById = async (countryId: number): Promise<Country> => {
  try {
    const result = await (await Database.getClient()).select<CountrySchema>(['*']).from('country').where('id', countryId);
    return {
      id: result.id,
      code: result.code,
      name: result.name,
      flag: result.flag
    } as Country;
  } catch (error) {
    logger.error(error);
    return {} as Country;
  }
};

export const findCountryByCountryCodeAndName = async (countryCode: string, name: string): Promise<Country> => {
  try {
    const result = await (await Database.getClient())
      .select<CountrySchema>(['id', 'code', 'name', 'flag'])
      .from('country')
      .where('code', countryCode)
      .andWhere('name', name);
    return {
      id: result.id,
      code: result.code,
      name: result.name,
      flag: result.flag
    } as Country;
  } catch (error) {
    logger.error(error);
    return {} as Country;
  }
};
