import { getCountries } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findCountries, upsertCountries } from '../models/country';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { Country } from '../types/Country';

export let allCountries = new Array<Country>();

export const getAllCountries = async () => {
  allCountries = await findCountries();
  logger.info(`Countries loaded: ${allCountries.length} countries`);
};

export const fetchCountries = async () => {
  try {
    const apiResCountries: ApiResponse<Country, Country[]> = await getCountries();
    const resCountries = apiResCountries.response;
    const countries = resCountries.map(country => {
      return {
        code: country.name === 'World' ? 'ALL' : country.code,
        name: country.name,
        flag: country.flag
      } as Country;
    });

    const result = await upsertCountries(countries);

    return { code: 200, message: result ? result : 'No country inserted' };
  } catch (error) {
    logger.error(error);
    return { code: 400, message: 'error' };
  }
};
