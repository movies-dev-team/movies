import { describe, it, expect, vi, beforeEach } from "vitest";
import { tmdbApi } from "@/shared/services/tmdbApi";
import { getMovieDetail } from "../services/movieDetailService";

vi.mock("@/shared/services/tmdbApi", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}));

const mockGet = vi.mocked(tmdbApi.get);

describe("getMovieDetail", () => {

  const movieId = 157336;

  const mockMovie = {
    id: movieId,
    title: "Interstellar",
    original_title: "Interstellar",
    overview: "Un grupo de exploradores viaja por el espacio.",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should request the movie details with the correct parameters", async () => {

    mockGet.mockResolvedValue({ data: mockMovie });

    await getMovieDetail(movieId);

    expect(mockGet).toHaveBeenCalledTimes(1);

    expect(mockGet).toHaveBeenCalledWith(`movie/${movieId}`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        append_to_response: "images,credits",
        language: "es-ES",
        include_image_language: "es-ES,null",
      },
    });
  });

  it("should return the movie details", async () => {

    mockGet.mockResolvedValue({ data: mockMovie });

    const result = await getMovieDetail(movieId);

    expect(result).toEqual(mockMovie);
  });

  it("should reject when the API request fails", async () => {

    mockGet.mockRejectedValue(new Error("API request failed"));

    await expect(getMovieDetail(movieId)).rejects.toThrow(
      "API request failed"
    );
  });
});