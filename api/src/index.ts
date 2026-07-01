import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { initDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import listingsRouter from './routes/listings';
import authRouter from './routes/auth';
import adminListingsRouter from './routes/admin/listings';
import adminImagesRouter from './routes/admin/images';

process.on('unhandledRejection', (reason) => {
  process.stderr.write(`[fatal] Unhandled rejection: ${reason}\n`);
});

process.on('uncaughtException', (err) => {
  process.stderr.write(`[fatal] Uncaught exception: ${err.message}\n${err.stack}\n`);
  process.exit(1);
});

async function start() {
  initDatabase();

  const app = express();

  app.use(morgan('combined'));
  app.use(cors({
    origin: [env.webOrigin, env.adminOrigin],
    credentials: true,
  }));
  app.use(express.json());

  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.use('/api/listings', listingsRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/admin/listings', adminListingsRouter);
  app.use('/api/admin/images', adminImagesRouter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(errorHandler);

  app.listen(env.port, () => {
    process.stderr.write(`[api] Server running on http://localhost:${env.port}\n`);
  });
}

start().catch((err) => {
  process.stderr.write(`[api] Failed to start: ${err.message}\n`);
  process.exit(1);
});
