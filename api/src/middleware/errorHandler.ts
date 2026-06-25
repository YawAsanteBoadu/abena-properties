import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  process.stderr.write(`[error] ${err.message}\n${err.stack}\n`);
  res.status(500).json({ error: 'Internal server error' });
}
