const defaultApiUrl = "http://localhost:3000";

export function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  return defaultApiUrl;
}

