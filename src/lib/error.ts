import type { HttpError } from '@code-judge/api';

export function resolveErrorMessage(e: HttpError): string {
  let response = JSON.parse(e.message);

  if (
    'data' in response &&
    'message' in response.data &&
    typeof response.data.message === 'string'
  ) {
    return response.data.message;
  }
  return '';
}
