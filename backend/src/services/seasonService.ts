import { logger } from '../middlewares/loggerConfig';
import { upsertSeasons } from '../models/season';
import { Season } from '../types/Season';

export const upsertSeasonsInDB = async (seasons: Season[]) => {
    return await upsertSeasons(seasons);
}

export const insertSeasonsByLeagueId = async (leagueId: number, seasons: Season[]) => {
  logger.info(`Inserting seasons for leagueId: ${leagueId}`);
  logger.info(`Seasons to insert: ${seasons.length}`);
    const seasonsToInsert = seasons.map(season => {
        return {
            year: season.year,
            leagueId: leagueId,
            start: season.start,
            end: season.end,
            current: season.current,
            coverage: season.coverage
        } as Season;
    });

    return seasonsToInsert.length > 0 ? await upsertSeasons(seasonsToInsert) : [];
};