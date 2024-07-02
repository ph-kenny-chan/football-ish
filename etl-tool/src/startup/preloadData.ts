import { getCountries } from '../api-football-client';
import { logger } from '../config/loggerConfig';
import { findTeamByApiId } from '../models/team';
import { getAllCountries, getAllYearNums } from '../services/league';

export const preloadData = async () => {
  await getAllCountries();
  await getAllYearNums();
  logger.info('Data preloaded');
};
