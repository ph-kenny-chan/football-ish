import { Database } from "../config/Database";
import { logger } from "../middlewares/loggerConfig";
import { Season } from "../types/Season";

type SeasonSchema = {
  id?: string;
  year_num: number;
  league_id: number;
  start_date: Date;
  end_date: Date;
  current: boolean;
  coverage: string;
  created_at: Date;
  updated_at: Date;
};

export const upsertSeasons = async (seasons: Season[]) => {
  const seasonsToInsert = seasons.map(
    season =>
      ({
        id: `${season.leagueId}_${season.year}`,
        year_num: season.year,
        league_id: season.leagueId,
        start_date: new Date(season.start),
        end_date: new Date(season.end),
        current: season.current,
        coverage: JSON.stringify(season.coverage),
        created_at: new Date(),
        updated_at: new Date()
      }) as SeasonSchema
  );

  try {
    const result = await (
      await Database.getClient()
    )
      .table('season')
      .insert(seasonsToInsert)
      .onConflict(['year_num', 'league_id'])
      .ignore()
      .returning<SeasonSchema[]>('*');

    return result.map(
      seasonSchema =>
        ({
          year: seasonSchema.year_num,
          leagueId: seasonSchema.league_id,
          start: seasonSchema.start_date.toDateString(),
          end: seasonSchema.end_date.toDateString(),
          current: seasonSchema.current,
          coverage: JSON.parse(seasonSchema.coverage)
        }) as Season
    );
  } catch (error) {
    logger.error(error);
  }
}