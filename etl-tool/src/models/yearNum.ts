import { Database } from '../config/Database';
import { logger } from '../middlewares/loggerConfig';

type YearNumSchema = {
  id?: number;
  year_num: number;
  created_at: Date;
  updated_at: Date;
};

export const insertYearNumbers = async (yearNums: number[]): Promise<any> => {
  const yearNumbersToInsert = yearNums.map(
    yearNum =>
      ({
        year_num: yearNum,
        created_at: new Date(),
        updated_at: new Date()
      }) as YearNumSchema
  );

  try {
    const result = await (await Database.getClient()).insert<Array<YearNumSchema>>(yearNumbersToInsert).into('year_num').returning('*');
    return result[0];
  } catch (error) {
    logger.error(error);
  }
};

export const insertYearNumber = async (yearNum: YearNumSchema): Promise<any> => {
  try {
    const result = await (await Database.getClient()).insert<YearNumSchema>(yearNum).into('year_num').returning('*');
    return result[0];
  } catch (error) {
    logger.error(error);
  }
};

export const findYearNumbers = async (): Promise<number[]> => {
  try {
    const result = await (await Database.getClient()).select<Array<YearNumSchema>>('*').from('year_num');
    return result.map(yearNum => yearNum.year_num) as number[];
  } catch (error) {
    logger.error(error);
    return [];
  }
};
