import express from 'express';
import { getHealthCheck } from '../services/healthcheck';

const router = express.Router();

router.get('/', getHealthCheck);

export { router as healthCheck };
