import express, { Request, Response } from 'express';
import { syncCountries } from '../../controllers/countryController';

const router = express.Router();

router.post('/sync/all', syncCountries);

export { router as countryRoutes };
