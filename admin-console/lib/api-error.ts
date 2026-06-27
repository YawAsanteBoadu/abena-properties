export class ApiError extends Error {
  status: number;
  code: string;
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    code: string = 'UNKNOWN',
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
}
