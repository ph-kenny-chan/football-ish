import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { db_database, db_ssl_ca } from './config/env';
import connectDB from './startup/connectDB';
import { App } from './app';
import { preloadData } from './startup/preloadData';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(App);

app.listen(port, () => {
  connectDB();
  preloadData();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
