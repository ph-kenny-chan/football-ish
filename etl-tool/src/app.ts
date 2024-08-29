import express from 'express';
import { healthCheck } from './routes/healthcheck';
import { countryRoutes } from './routes/v1/countryRoutes';
import { leagueRoutes } from './routes/v1/leagueRoutes';
import { year } from './routes/v1/year';
import { teamVenueRoutes } from './routes/v1/teamVenueRoutes';
import { teamStatRoutes } from './routes/v1/teamStatRoutes';

const App = express.Router();

const prefix = '/football-ish/etl';
const V1 = '/v1';

App.use(prefix + '/healthCheck', healthCheck);
App.use(prefix + V1 + '/countries', countryRoutes);
App.use(prefix + V1 + '/leagues', leagueRoutes);
App.use(prefix + V1 + '/teams/venues', teamVenueRoutes);
App.use(prefix + V1 + '/teams/statistics', teamStatRoutes);
App.use(prefix + V1 + '/years', year);

export { App };
