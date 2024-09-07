import express from 'express';
import { healthCheck } from './routes/healthcheck';
import { countryRoutes } from './routes/v1/countryRoutes';
import { leagueRoutes } from './routes/v1/leagueRoutes';
import { year } from './routes/v1/year';
import { teamRoutes } from './routes/v1/teamRoutes';

const App = express.Router();

const etlPrefix = '/football-ish/etl';
const V1 = '/v1';

App.use(etlPrefix + '/healthCheck', healthCheck);
App.use(etlPrefix + V1 + '/countries', countryRoutes);
App.use(etlPrefix + V1 + '/leagues', leagueRoutes);
App.use(etlPrefix + V1 + '/teams', teamRoutes);
App.use(etlPrefix + V1 + '/years', year);

export { App };
