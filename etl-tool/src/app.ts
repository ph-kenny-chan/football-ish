import express from 'express';
import { healthCheck } from './routes/healthcheck';
import { country } from './routes/v1/country';
import { league } from './routes/v1/league';
import { year } from './routes/v1/year';
import { teamVenue } from './routes/v1/teamVenue';

const App = express.Router();

const prefix = '/football-ish/etl';
const V1 = '/v1';

App.use(prefix + '/healthCheck', healthCheck);
App.use(prefix + V1 + '/countries', country);
App.use(prefix + V1 + '/leagues', league);
App.use(prefix + V1 + '/teamVenues', teamVenue);
App.use(prefix + V1 + '/years', year);

export { App };
