import { getLeagues } from '../api-football-client';
import { logger } from '../middlewares/loggerConfig';
import { findAllLeagues, insertLeagues, updateLeague } from '../models/league';
import { ApiResponse } from '../types/apiObj/ApiResponse';
import { League } from '../types/League';
import { ResLeague } from '../types/apiObj/ResLeague';
import { allCountries } from './countryService';

export const fetchLeagues = async () => {
  try {
    const apiResLeagues: ApiResponse<ResLeague> = await getLeagues();
    const leaguesFromDB = await findAllLeagues();
    const resLeagues = apiResLeagues.response;
    const leaguesToInsert = new Array<League>();

    resLeagues.forEach(async resLeague => {
      const country = allCountries.find(country => country.code === resLeague.country.code && country.name === resLeague.country.name);

      const leagueFromDB = leaguesFromDB.find(league => league.apiId === resLeague.league.id);

      if (leagueFromDB === undefined) {
        leaguesToInsert.push({
          apiId: resLeague.league.id,
          countryId: country?.id,
          name: resLeague.league.name,
          type: resLeague.league.type,
          logo: resLeague.league.logo
        } as League);
        logger.info(`new league added: ${country?.name} - ${country?.code} - resLeague: ${resLeague.league.name}`);
      } else if (leagueFromDB && isUpdatedTeamData(resLeague, leagueFromDB)) {
        await updateLeague({
          ...leagueFromDB,
          name: resLeague.league.name,
          type: resLeague.league.type,
          logo: resLeague.league.logo
        } as League);
        logger.info(`league updated: ${country?.name} - ${country?.code} - resLeague: ${resLeague.league.name}`);
      }
    });

    if (leaguesToInsert.length > 0) await insertLeagues(leaguesToInsert);

    return { code: 200, message: 'ok' };
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
