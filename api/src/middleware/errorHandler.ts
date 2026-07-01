import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

interface ErrorEnvelope {
  error: string;
  code?: string;
  details?: unknown;
}

function isSqliteError(err: unknown): err is Error & { code: string } {
  return err instanceof Error && 'code' in err && typeof (err as Record<string, unknown>).code === 'string';
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const isProd = process.env.NODE_ENV === 'production';

  if (err instanceof multer.MulterError) {
    const envelope: ErrorEnvelope = { error: '', code: '' };
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        envelope.error = 'File too large. Maximum size is 10 MB.';
        envelope.code = 'PAYLOAD_TOO_LARGE';
        res.status(413).json(envelope);
        return;
      case 'LIMIT_FILE_COUNT':
      case 'LIMIT_UNEXPECTED_FILE':
        envelope.error = 'Too many files or unexpected field name. Maximum 20 images.';
        envelope.code = 'VALIDATION_ERROR';
        res.status(400).json(envelope);
        return;
      default:
        envelope.error = `Upload error: ${err.message}`;
        envelope.code = 'VALIDATION_ERROR';
        res.status(400).json(envelope);
        return;
    }
  }

  if (isSqliteError(err)) {
    const envelope: ErrorEnvelope = { error: '', code: '' };
    if (err.code === 'SQLITE_CONSTRAINT_CHECK' || err.code?.includes('CONSTRAINT_CHECK')) {
      envelope.error = 'Invalid value for a constrained field (e.g. category or status).';
      envelope.code = 'VALIDATION_ERROR';
      res.status(400).json(envelope);
      return;
    }
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE' || err.code?.includes('CONSTRAINT_UNIQUE')) {
      envelope.error = 'A record with that unique value already exists.';
      envelope.code = 'CONFLICT';
      res.status(409).json(envelope);
      return;
    }
    if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || err.code?.includes('CONSTRAINT_FOREIGNKEY')) {
      envelope.error = 'Referenced record does not exist.';
      envelope.code = 'VALIDATION_ERROR';
      res.status(400).json(envelope);
      return;
    }
  }

  if (err.message?.startsWith('Invalid file type')) {
    const envelope: ErrorEnvelope = { error: err.message, code: 'VALIDATION_ERROR' };
    res.status(400).json(envelope);
    return;
  }

  if ('status' in err && typeof (err as Record<string, unknown>).status === 'number') {
    const status = (err as Record<string, unknown>).status as number;
    const envelope: ErrorEnvelope = { error: err.message };
    res.status(status).json(envelope);
    return;
  }

  process.stderr.write(`[error] ${err.message}\n`);
  if (!isProd && err.stack) {
    process.stderr.write(`${err.stack}\n`);
  }

  const envelope: ErrorEnvelope = {
    error: isProd ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
  };
  res.status(500).json(envelope);
}
