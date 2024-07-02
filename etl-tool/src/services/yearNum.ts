import { getYearNumbers } from '../api-football-client';
import { insertYearNumbers } from '../models/yearNum';
import { ApiResponse } from '../types/apiObj/ApiResponse';

export const syncYearNumbersFromAPI = async () => {
  try {
    const apiResSeasons: ApiResponse<number> = await getYearNumbers();
    const yearnumbers = apiResSeasons.response;
    await insertYearNumbers(yearnumbers);
    return { code: 200, message: 'ok' };
  } catch (error) {
    console.error('Error retrieving year numbers:', error);
    throw error;
  }
};
