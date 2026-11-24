import { tmdbApi } from "./tmdbApi";

export async function getData(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
  page: number = 1,
) {
  const response = await tmdbApi.get(endpoint, {
    params: {
      language: "es-ES",
      page,
      ...params,
    },
  });

  return response.data;
}
