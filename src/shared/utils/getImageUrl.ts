const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export function getImageUrl(path: string, size: string) {
  return `${TMDB_IMAGE_BASE_URL}${size}${path}`;
}
