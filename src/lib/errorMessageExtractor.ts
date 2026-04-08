/**
 * Safely extracts error message from various error formats
 * Provides sensible fallbacks for missing messages
 */
export const extractErrorMessage = (error: unknown, fallback = "An error occurred"): string => {
  if (!error || typeof error !== "object") {
    return fallback;
  }

  const err = error as Record<string, unknown>;

  // Direct message property
  if (typeof err.message === "string" && err.message.trim()) {
    return err.message;
  }

  // API response message
  if (typeof err.response === "object" && err.response) {
    const response = err.response as Record<string, unknown>;
    if (typeof response.data === "object" && response.data) {
      const data = response.data as Record<string, unknown>;
      if (typeof data.message === "string" && data.message.trim()) {
        return data.message;
      }

      // Error sources array (from backend error handler)
      if (Array.isArray(data.errorSources) && data.errorSources.length > 0) {
        const firstSource = data.errorSources[0] as Record<string, unknown>;
        if (typeof firstSource?.message === "string" && firstSource.message.trim()) {
          return firstSource.message;
        }
      }
    }

    // HTTP status text
    if (typeof response.statusText === "string" && response.statusText.trim()) {
      return response.statusText;
    }

    // API response data as string (sometimes the entire response is an error)
    if (typeof response.data === "string" && response.data.trim()) {
      return response.data;
    }
  }

  // Zod validation errors format
  if (typeof err.fieldErrors === "object" && err.fieldErrors) {
    const fieldErrors = err.fieldErrors as Record<string, unknown[]>;
    const firstField = Object.keys(fieldErrors)[0];
    const firstError = fieldErrors[firstField]?.[0];
    if (typeof firstError === "string" && firstError.trim()) {
      return firstError;
    }
  }

  // Fallback to provided fallback message or default
  return fallback;
};

/**
 * Extracts error message from API response specifically
 * Used for onSuccess handlers where we have the response object
 */
export const extractResponseErrorMessage = (
  response: unknown,
  fallback = "Operation failed"
): string => {
  if (!response || typeof response !== "object") {
    return fallback;
  }

  const res = response as Record<string, unknown>;

  // Check response message
  if (typeof res.message === "string" && res.message.trim()) {
    return res.message;
  }

  // Check nested data message
  if (typeof res.data === "object" && res.data) {
    const data = res.data as Record<string, unknown>;
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }

  // Check error sources
  if (Array.isArray(res.errorSources) && res.errorSources.length > 0) {
    const firstSource = res.errorSources[0] as Record<string, unknown>;
    if (typeof firstSource?.message === "string" && firstSource.message.trim()) {
      return firstSource.message;
    }
  }

  return fallback;
};

/**
 * Safely extract success message from response
 */
export const extractSuccessMessage = (
  response: unknown,
  fallback = "Operation successful"
): string => {
  if (!response || typeof response !== "object") {
    return fallback;
  }

  const res = response as Record<string, unknown>;

  if (typeof res.message === "string" && res.message.trim()) {
    return res.message;
  }

  if (typeof res.data === "object" && res.data) {
    const data = res.data as Record<string, unknown>;
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  }

  return fallback;
};
