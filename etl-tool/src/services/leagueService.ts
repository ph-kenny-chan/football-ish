import { getLeagues } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findAllLeagues, upsertLeagues } from '../models/league';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { League } from '../types/League';
import { ResLeague } from '../types/apiObj/ResLeague';
import { allCountries } from './countryService';

export const fetchAllLeagues = async () => {
  return fetchLeagueInner();
};

export const fetchLeaguesByCountryCodes = async (countryCodes?: string) => {
  return fetchLeagueInner(countryCodes);
};

const fetchLeagueInner = async (countryCodes?: string) => {
  try {
    const apiResLeagues: ApiResponse<ResLeague, ResLeague[]> = await getLeagues(countryCodes);
    const resLeagues = apiResLeagues.response;
    const leagues: League[] = resLeagues.map(
      resLeague =>
        ({
          apiId: resLeague.league.id,
          countryId: allCountries.find(country => {
            return resLeague.country?.name === 'World'
              ? country.code === 'ALL'
              : country.code === resLeague.country?.code && country.name === resLeague.country?.name;
          })?.id,
          name: resLeague.league.name,
          type: resLeague.league.type,
          logo: resLeague.league.logo
        }) as League
    );
    const result = await upsertLeagues(leagues);
    return { code: 200, message: result ? result : 'No league inserted' };
  } catch (error) {
    logger.error(error);
    return { code: 400, message: 'error' };
  }
};

export const isUpdatedTeamData = (leagueFromAPI: ResLeague, leagueFromDB: League): boolean => {
  return (
    leagueFromAPI.league.name !== leagueFromDB.name ||
    leagueFromAPI.league.type !== leagueFromDB.type ||
    leagueFromAPI.league.logo !== leagueFromDB.logo
  );
};
