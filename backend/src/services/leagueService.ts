import { getLeagues } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findAllLeagues, upsertLeagues } from '../models/league';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { League } from '../types/League';
import { ResLeague } from '../types/apiObj/ResLeague';
import { allCountries } from './countryService';
import { Season } from '../types/Season';
import { upsertSeasons } from '../models/season';
import { insertSeasonsByLeagueId, upsertSeasonsInDB } from './seasonService';

export const fetchAllLeagues = async () => {
  return fetchLeagueInner();
};

export const fetchLeaguesByCountryCodes = async (countryCodes?: string) => {
  return fetchLeagueInner(countryCodes);
};

const fetchLeagueInner = async (countryCodes?: string) => {
  try {
    const apiResLeagues: ApiResponse<ResLeague, ResLeague[]> = await getLeagues(countryCodes);
    const response = apiResLeagues.response;
    const leagues: League[] = response.map(
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
    const leagueResult = await upsertLeagues(leagues);
    // insert seasons data
    const leagueSeasons = leagueResult.flatMap(dbLeague => {
      const seasons = response
        .filter(() => dbLeague.id !== undefined)
        .filter(resLeague => resLeague.league.id === dbLeague.id)
        .flatMap(resLeague => {
          return resLeague.seasons.map(season => {
            return {
              year: season.year,
              leagueId: dbLeague.id,
              start: season.start,
              end: season.end,
              current: season.current,
              coverage: season.coverage
            } as Season;
          });
        })
      return {
        leagueId: dbLeague.id ?? 0,
        seasons
      };
    });
    const result = leagueSeasons
      .filter(leagueSeason => leagueSeason.leagueId !== undefined)
      .map(async leagueSeason =>
        await insertSeasonsByLeagueId(leagueSeason.leagueId, leagueSeason.seasons));
    return { code: 200, message: result ? leagueSeasons : 'No league and seasons inserted' };
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
