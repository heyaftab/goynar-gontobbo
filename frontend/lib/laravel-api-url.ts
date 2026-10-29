const productionApiUrl = "https://goynar-gontobbo-api.onrender.com";

export function getLaravelApiUrl(): string | undefined {
  const configuredUrl = process.env.LARAVEL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = configuredUrl || (process.env.NODE_ENV === "production" ? productionApiUrl : undefined);
  return apiUrl?.replace(/\/$/, "");
}
