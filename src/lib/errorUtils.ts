/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Extracts error message from various error response structures
 * @param error - The error object from API responses or exceptions
 * @param fallbackMessage - Default message if extraction fails
 * @returns The extracted error message
 */
export function extractErrorMessage(error: any, fallbackMessage: string = "An error occurred. Please try again."): string {
  // Direct message property
  if (typeof error === 'string') {
    return error;
  }

  // Check nested data.message (from our API structure)
  if (error?.data?.message) {
    return error.data.message;
  }

  // Check response.data.message (from axios error structure)
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  // Check direct message property
  if (error?.message) {
    return error.message;
  }

  // Check errorSources (from our API error structure)
  if (error?.data?.errorSources && Array.isArray(error.data.errorSources) && error.data.errorSources.length > 0) {
    return error.data.errorSources[0].message;
  }

  // Check data.error.message
  if (error?.data?.error?.message) {
    return error.data.error.message;
  }

  return fallbackMessage;
}
