import { describe, it, expect, vi, beforeEach } from "vitest";
import { tmdbApi } from "@/shared/services/tmdbApi";
import { getMovieTrailer } from "../services/movieTrailerService";

vi.mock("@/shared/services/tmdbApi", () => ({
  tmdbApi: {
    get: vi.fn(),
  },
}));

const mockGet = vi.mocked(tmdbApi.get);

describe("getMovieTrailer", () => {

  const movieId = 157336;

  const spanishTrailer = {
    key: "spanish-trailer-key",
    name: "Tráiler oficial",
    type: "Trailer",
    official: true,
    site: "YouTube",
  };

  const englishTrailer = {
    key: "english-trailer-key",
    name: "Official trailer",
    type: "Trailer",
    official: true,
    site: "YouTube",
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return the official Spanish trailer", async () => {

    mockGet.mockResolvedValueOnce({
      data: {
        results: [spanishTrailer],
      },
    });

    const result = await getMovieTrailer(movieId);

    expect(result).toEqual(spanishTrailer);

    expect(mockGet).toHaveBeenCalledTimes(1);

    expect(mockGet).toHaveBeenCalledWith(
      `movie/${movieId}/videos`,
      {
        params: {
          language: "es-ES",
        },
      }
    );
  });

  it("should return the English trailer when no Spanish trailer is available", async () => {

    mockGet
      .mockResolvedValueOnce({
        data: { results: [] },
      })
      .mockResolvedValueOnce({
        data: { results: [englishTrailer] },
      });

    const result = await getMovieTrailer(movieId);

    expect(result).toEqual(englishTrailer);

    expect(mockGet).toHaveBeenCalledTimes(2);

    expect(mockGet).toHaveBeenNthCalledWith(
      1,
      `movie/${movieId}/videos`,
      {
        params: {
          language: "es-ES",
        },
      }
    );

    expect(mockGet).toHaveBeenNthCalledWith(
      2,
      `movie/${movieId}/videos`,
      {
        params: {
          language: "en-US",
        },
      }
    );
  });

  it("should return null when no trailer is available", async () => {

    mockGet
      .mockResolvedValueOnce({
        data: { results: [] },
      })
      .mockResolvedValueOnce({
        data: { results: [] },
      });

    const result = await getMovieTrailer(movieId);

    expect(result).toBeNull();

    expect(mockGet).toHaveBeenCalledTimes(2);
  });

  it("should ignore videos that are not trailers", async () => {

    const teaser = {
      ...spanishTrailer,
      type: "Teaser",
    };

    mockGet.mockResolvedValueOnce({
      data: {
        results: [teaser, spanishTrailer],
      },
    });

    const result = await getMovieTrailer(movieId);

    expect(result).toEqual(spanishTrailer);
  });

  it("should ignore unofficial trailers", async () => {

    const unofficialTrailer = {
      ...spanishTrailer,
      official: false,
    };

    mockGet.mockResolvedValueOnce({
      data: {
        results: [unofficialTrailer, spanishTrailer],
      },
    });

    const result = await getMovieTrailer(movieId);

    expect(result).toEqual(spanishTrailer);
  });

  it("should ignore trailers that are not hosted on YouTube", async () => {

    const vimeoTrailer = {
      ...spanishTrailer,
      site: "Vimeo",
    };

    mockGet.mockResolvedValueOnce({
      data: {
        results: [vimeoTrailer, spanishTrailer],
      },
    });

    const result = await getMovieTrailer(movieId);

    expect(result).toEqual(spanishTrailer);
  });

  it("should ignore invalid trailers in the English response", async () => {

    mockGet
      .mockResolvedValueOnce({
        data: {
          results: [],
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { ...englishTrailer, type: "Teaser" },
            { ...englishTrailer, official: false },
            { ...englishTrailer, site: "Vimeo" },
            englishTrailer,
          ],
        },
      });

    const result = await getMovieTrailer(movieId);

    expect(result).toEqual(englishTrailer);
  });

  it("should reject when the API request fails", async () => {

    mockGet.mockRejectedValueOnce(
      new Error("API request failed")
    );

    await expect(getMovieTrailer(movieId)).rejects.toThrow(
      "API request failed"
    );

    expect(mockGet).toHaveBeenCalledTimes(1);
  });
});