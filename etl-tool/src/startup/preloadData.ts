import { getCountries } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { getAllCountries } from '../services/countryService';
import { getAllYearNumbers } from '../services/yearNumberService';

export const preloadData = async () => {
  await getAllCountries();
  await getAllYearNumbers();
  logger.info('Data preloaded');
};
