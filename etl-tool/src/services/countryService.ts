import { getCountries } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findCountries, insertCountries } from '../models/country';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { Country } from '../types/Country';

export let allCountries = new Array<Country>();

export const getAllCountries = async () => {
  allCountries = await findCountries();
  logger.info(`Countries loaded: ${allCountries.length} countries`);
};

export const fetchCountries = async () => {
  try {
    const apiResCountries: ApiResponse<Country> = await getCountries();
    const countries = apiResCountries.response;
    const response = await insertCountries(countries);

    return { code: 200, message: 'ok' };
  } catch (error) {
    logger.error(error);
    return { code: 400, message: 'error' };
  }
};
