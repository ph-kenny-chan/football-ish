import express, { Request, Response } from 'express';
import { fetchYearNumbers } from '../../services/yearNumberService';

const router = express.Router();

router.post('/sync', async (req: Request, res: Response) => {
  const result = await fetchYearNumbers();
  res.status(result.code).send({ result: result.message });
});

export { router as year };
