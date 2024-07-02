import express, { Request, Response } from 'express';
import { syncYearNumbersFromAPI } from '../../services/yearNum';

const router = express.Router();

router.post('/sync', async (req: Request, res: Response) => {
  const result = await syncYearNumbersFromAPI();
  res.status(result.code).send({ result: result.message });
});

export { router as year };
