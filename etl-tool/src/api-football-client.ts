import { API_FOOTBALL_ENDPOINTS, API_FOOTBALL_KEY } from './config/env';
import { logger } from './middlewares/loggerConfig';
import { ApiResponse } from './types/apiObj/ApiResponse';
import { Country } from './types/Country';
import { get } from 'lodash';
import { ResLeague } from './types/apiObj/ResLeague';
import { ResTeamVenue } from './types/apiObj/ResTeamVenue';
import { ResTeamStatistics } from './types/apiObj/ResTeamStatistics';

async function fetchData(method: string, path: string): Promise<any> {
  const options = {
    method: method,
    headers: {
      'X-RapidAPI-Key': API_FOOTBALL_KEY,
      'X-RapidAPI-Host': API_FOOTBALL_ENDPOINTS.base
    }
  };

  const url = API_FOOTBALL_ENDPOINTS.V3 + path;
  logger.info(`${method} ${url}`);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error(error);
  }
}

export async function getCountries(): Promise<ApiResponse<Country, Country[]>> {
  try {
    const countries = await fetchData('GET', '/countries');
    return countries;
  } catch (error) {
    logger.error('Error getting countries:', error);
    throw error;
  }
}

export const getLeagues = async (countryCode?: string): Promise<ApiResponse<ResLeague, ResLeague[]>> => {
  try {
    let params = '';
    params += countryCode ? `?code=${countryCode}` : '';
    const resLeague = await fetchData('GET', `/leagues${params}`);
    return resLeague;
  } catch (error) {
    logger.error('Error getting leagues:', error);
    throw error;
  }
};

export const getYearNumbers = async (): Promise<ApiResponse<number, number[]>> => {
  try {
    const yearNumbers = await fetchData('GET', `/leagues/seasons`);
    return yearNumbers;
  } catch (error) {
    logger.error('Error getting yearNumbers:', error);
    throw error;
  }
};

type GetTeamsProp = {
  season: number;
  id?: number;
  name?: string;
  leagueId?: number;
};

export const getTeamsByLeagueId = async ({ season, id, name, leagueId }: GetTeamsProp): Promise<ApiResponse<ResTeamVenue, ResTeamVenue[]>> => {
  try {
    let params = '';
    id && (params += `&id=${id}`);
    name && (params += `&name=${name}`);
    leagueId && (params += `&league=${leagueId}`);
    if (!params) throw new Error('Either one id, name or leagueId should be provided');

    const teamVenues = await fetchData('GET', `/teams?season=${season}${params}`);
    return teamVenues;
  } catch (error) {
    logger.error('Error getting teams:', error);
    throw error;
  }
};

type GetTeamStatisticsProp = {
  leagueId: number;
  teamId: number;
  season: number;
};

export const getTeamStatisticsBySeason = async ({
  leagueId,
  teamId,
  season
}: GetTeamStatisticsProp): Promise<ApiResponse<ResTeamStatistics, ResTeamStatistics>> => {
  try {
    let params = `?league=${leagueId}&team=${teamId}&season=${season}`;
    const teamStatistics = await fetchData('GET', `/teams/statistics${params}`);
    return teamStatistics;
  } catch (error) {
    logger.error('Error getting team statistics:', error);
    throw error;
  }
};
