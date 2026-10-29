export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_POST'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
  }
}