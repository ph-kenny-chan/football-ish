import { getCountries } from '../api-football-client';
import { logger } from '../config/loggerConfig';
import { insertCountries } from '../models/country';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { Country } from '../types/Country';

export const syncCountriesFromAPI = async () => {
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
