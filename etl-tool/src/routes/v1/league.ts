import express, { Request, Response } from 'express';
import { syncLeaguesFromAPI } from '../../services/league';

const router = express.Router();

router.post('/sync', async (req: Request, res: Response) => {
  const result = await syncLeaguesFromAPI();
  res.status(result.code).send({ result: result.message });
});

export { router as league };
