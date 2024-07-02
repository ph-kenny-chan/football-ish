import express, { Request, Response } from 'express';
import { syncCountriesFromAPI } from '../../services/country';

const router = express.Router();

router.post('/sync', async (req: Request, res: Response) => {
  const result = await syncCountriesFromAPI();
  res.status(result.code).send({ result: result.message });
});

export { router as country };
