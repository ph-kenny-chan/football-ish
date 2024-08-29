import { logger } from '../middlewares/loggerConfig';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const db_host = process.env.DB_HOST;
const db_port = parseInt(process.env.DB_PORT as string) || 27555;
const db_database = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_ssl_ca = process.env.DB_SSL_CA;

const API_FOOTBALL_HOST = process.env.API_FOOTBALL_HOST ?? '';

const API_FOOTBALL_ENDPOINTS = {
  base: API_FOOTBALL_HOST,
  V1: 'https://' + API_FOOTBALL_HOST + '/v1',
  V2: 'https://' + API_FOOTBALL_HOST + '/v2',
  V3: 'https://' + API_FOOTBALL_HOST + '/v3'
};

const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY ?? '';

const preloadCountries = 'ENG,ITA';

export { port, db_host, db_port, db_database, db_user, db_password, db_ssl_ca, API_FOOTBALL_ENDPOINTS, API_FOOTBALL_KEY };
