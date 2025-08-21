export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
}

export function createApiError(statusCode: number, message: string): ApiError {
  return {
    statusCode,
    message,
    timestamp: new Date().toISOString(),
  };
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'statusCode' in error &&
    'message' in error &&
    'timestamp' in error
  );
}
