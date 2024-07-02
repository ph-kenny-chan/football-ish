import { NextFunction, Request, Response } from 'express';
import { Database } from '../config/Database';

const getHealthCheck = async (req: Request, res: Response) => {
  try {
    const db = await Database.getClient();
    await db.raw('select version();');
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error });
  }
};

export { getHealthCheck };
