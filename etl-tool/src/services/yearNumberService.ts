import { getYearNumbers } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findYearNumbers, insertYearNumbers } from '../models/yearNum';
import { ApiResponse } from '../types/apiObj/ApiResponse';

export let allYearNums = new Array<number>();
export let currentYearNum: number;

export const fetchYearNumbers = async () => {
  try {
    const apiResSeasons: ApiResponse<number, number[]> = await getYearNumbers();
    const yearnumbers = apiResSeasons.response;
    await insertYearNumbers(yearnumbers);
    return { code: 200, message: 'ok' };
  } catch (error) {
    console.error('Error retrieving year numbers:', error);
    throw error;
  }
};

export const getAllYearNumbers = async () => {
  allYearNums = await findYearNumbers();
  const currentYear = new Date().getFullYear();
  currentYearNum = allYearNums.includes(currentYear) ? currentYear : allYearNums[allYearNums.length - 1];
  logger.info(`Year numbers loaded: ${allYearNums.length} year numbers`);
  logger.info(`Current year number: ${currentYearNum}`);
};
