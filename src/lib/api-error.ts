export function getApiErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'value' in error) {
    const value = (error as { value?: unknown }).value;

    if (typeof value === 'object' && value !== null && 'error' in value) {
      const message = (value as { error?: unknown }).error;
      if (typeof message === 'string') return message;
    }

    if (typeof value === 'string') return value;
  }

  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  return 'Greška servera';
}
