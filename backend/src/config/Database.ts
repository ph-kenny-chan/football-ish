import { db_database, db_host, db_password, db_port, db_ssl_ca, db_user } from './env';
import { Knex, knex } from 'knex';
import convertToCamel from '../utils/convertToCamel';

export class Database {
  private static connection: Knex;

  private constructor() {}

  private static connectDB() {
    this.connection = knex({
      client: 'pg',
      connection: {
        host: db_host,
        port: db_port,
        user: db_user,
        database: db_database,
        password: db_password
        // ssl: {
        //   rejectUnauthorized: true,
        //   ca: db_ssl_ca,
        // }
      },
      // debug: true,
      acquireConnectionTimeout: 2000,
      pool: { min: 0, max: 10 }
      // postProcessResponse: (result, queryContext) => {
      //   // TODO: add special case for raw results
      //   // (depends on dialect)
      //   if (Array.isArray(result)) {
      //     return result.map(row => convertToCamel(row));
      //   } else {
      //     return convertToCamel(result);
      //   }
      // },
    });
  }

  public static async getClient() {
    if (!this.connection) this.connectDB();
    return this.connection;
  }

  public static async transaction() {
    return await (await this.getClient()).transaction();
  }

  public static async withTransaction(callback: (trx: Knex.Transaction) => Promise<any>) {
    const trx = await this.transaction();
    try {
      const result = await callback(trx);
      await trx.commit();
      return result;
    } catch (error) {
      await trx.rollback();
      throw new Error(error as string);
    }
  }
}
