import { Request, Response } from 'express';
import { fetchCountries } from '../services/countryService';

export const syncCountries = async (req: Request, res: Response) => {
  const result = await fetchCountries();
  res.status(result.code).send({ result: result.message });
};
